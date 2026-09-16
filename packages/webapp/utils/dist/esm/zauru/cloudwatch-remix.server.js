import { getSession } from "@zauru-sdk/services";
import { logError } from "./cloudwatch-logger.server.js";
const MAX_MESSAGE_LENGTH = 8000;
const MAX_STACK_LENGTH = 16000;
function truncate(value, max) {
    if (!value)
        return undefined;
    if (value.length <= max)
        return value;
    return `${value.slice(0, max)}…[truncated]`;
}
function isRouteErrorResponse(error) {
    return (typeof error === "object" &&
        error !== null &&
        "status" in error &&
        "statusText" in error &&
        typeof error.status === "number");
}
/**
 * Remix `handleError` for `entry.server.tsx`. Captures loader/action errors
 * and sends them to CloudWatch (`<APP_ENV>/server`). Never throws.
 */
export async function handleError(error, { request }) {
    if (request.signal.aborted)
        return;
    if (isRouteErrorResponse(error) && error.status < 500)
        return;
    const message = error instanceof Error
        ? error.message
        : isRouteErrorResponse(error)
            ? `${error.status} ${error.statusText}`
            : typeof error === "object" && error !== null && "message" in error
                ? String(error.message)
                : String(error);
    await logError("server", {
        message,
        stack: error instanceof Error ? error.stack : undefined,
        url: request.url,
        method: request.method,
        source: request.method.toUpperCase() === "GET" ? "loader" : "action",
    });
}
/**
 * Remix action for `POST /api/client-errors`.
 *
 * Best-effort: session is optional (errors can happen on /login), but if a
 * cookie is present the username is attached. Never requires app access.
 */
export function createClientErrorsAction() {
    return async ({ request }) => {
        let body;
        try {
            body = (await request.json());
        }
        catch {
            return Response.json({ success: false, error: "Body inválido (se esperaba JSON)." }, { status: 400 });
        }
        if (!body || typeof body !== "object" || !body.message) {
            return Response.json({ success: false, error: "Falta `message` en el payload." }, { status: 400 });
        }
        let userId;
        try {
            const cookie = request.headers.get("Cookie") ?? "";
            const session = await getSession(cookie);
            const username = session.get("username");
            if (typeof username === "string" && username.length > 0) {
                userId = username;
            }
        }
        catch {
            // Ignore: error reporting must not depend on the session.
        }
        const source = typeof body.source === "string" && body.source.length <= 200
            ? body.source
            : "unknown";
        await logError("client", {
            message: truncate(String(body.message), MAX_MESSAGE_LENGTH) ?? "Sin mensaje",
            stack: truncate(typeof body.stack === "string" ? body.stack : undefined, MAX_STACK_LENGTH),
            url: typeof body.url === "string" && body.url.length <= 2000
                ? body.url
                : undefined,
            userAgent: typeof body.userAgent === "string" && body.userAgent.length <= 1000
                ? body.userAgent
                : undefined,
            appVersion: typeof body.appVersion === "string" && body.appVersion.length <= 100
                ? body.appVersion
                : undefined,
            timestamp: typeof body.timestamp === "number" && Number.isFinite(body.timestamp)
                ? body.timestamp
                : Date.now(),
            userId,
            source,
        });
        return new Response(null, { status: 204 });
    };
}
