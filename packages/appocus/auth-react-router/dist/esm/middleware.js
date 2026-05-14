import { redirect } from "react-router";
import { getSession, getRefreshSession } from "@zauru-sdk/services";
/**
 * Throws a redirect to `/login` if the request has no OAuth session cookie.
 * Attach as a route middleware on authenticated routes.
 */
export const authMiddleware = async ({ request }) => {
    const cookie = request.headers.get("Cookie") ?? "";
    const session = await getSession(cookie);
    if (!session.has("code")) {
        console.log("[appocus/auth] User is not authenticated, redirecting to login.");
        throw redirect("/login");
    }
};
/**
 * Throws a redirect to `/` if the request already has an OAuth session cookie.
 * Attach to `/login`, `/callback` etc. to bounce already-logged-in users home.
 */
export const loginMiddleware = async ({ request }) => {
    const cookie = request.headers.get("Cookie") ?? "";
    const session = await getSession(cookie);
    if (session.has("code")) {
        console.log("[appocus/auth] User is already authenticated, redirecting to home.");
        throw redirect("/");
    }
};
/**
 * After-handler middleware that bumps the session cookie / Redis TTL when a
 * `code` cookie is present. Errors are swallowed so a failed refresh never breaks
 * the underlying response.
 */
export async function sessionRefreshMiddleware({ request }, next) {
    const response = await next();
    try {
        const cookie = request.headers.get("Cookie") ?? "";
        const session = await getSession(cookie);
        if (!session.has("code")) {
            return response;
        }
        const setCookie = await getRefreshSession(request);
        if (!setCookie || typeof setCookie !== "string") {
            return response;
        }
        const headers = new Headers(response.headers);
        headers.append("Set-Cookie", setCookie);
        return new Response(response.body, {
            status: response.status,
            statusText: response.statusText,
            headers,
        });
    }
    catch {
        return response;
    }
}
