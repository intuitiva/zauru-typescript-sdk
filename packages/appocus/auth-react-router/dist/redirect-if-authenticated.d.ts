/**
 * Probes `/api/auth/me` and, on success, navigates to `/`.
 * Reinforces the server-side redirect for SPA flows where the URL isn't updated
 * after the route module's middleware runs.
 */
export declare function RedirectIfAuthenticated({ meEndpoint, redirectTo, }?: {
    meEndpoint?: string;
    redirectTo?: string;
}): null;
