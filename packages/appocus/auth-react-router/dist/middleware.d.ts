/**
 * Throws a redirect to `/login` if the request has no OAuth session cookie.
 * Attach as a route middleware on authenticated routes.
 */
export declare const authMiddleware: ({ request }: {
    request: Request;
}) => Promise<void>;
/**
 * Throws a redirect to `/` if the request already has an OAuth session cookie.
 * Attach to `/login`, `/callback` etc. to bounce already-logged-in users home.
 */
export declare const loginMiddleware: ({ request }: {
    request: Request;
}) => Promise<void>;
/**
 * After-handler middleware that bumps the session cookie / Redis TTL when a
 * `code` cookie is present. Errors are swallowed so a failed refresh never breaks
 * the underlying response.
 */
export declare function sessionRefreshMiddleware({ request }: {
    request: Request;
}, next: () => Promise<Response>): Promise<Response>;
