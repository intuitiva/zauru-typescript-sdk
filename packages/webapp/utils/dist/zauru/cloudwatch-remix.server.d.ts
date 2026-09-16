import type { ActionFunction } from "@remix-run/node";
/**
 * Remix `handleError` for `entry.server.tsx`. Captures loader/action errors
 * and sends them to CloudWatch (`<APP_ENV>/server`). Never throws.
 */
export declare function handleError(error: unknown, { request }: {
    request: Request;
}): Promise<void>;
/**
 * Remix action for `POST /api/client-errors`.
 *
 * Best-effort: session is optional (errors can happen on /login), but if a
 * cookie is present the username is attached. Never requires app access.
 */
export declare function createClientErrorsAction(): ActionFunction;
