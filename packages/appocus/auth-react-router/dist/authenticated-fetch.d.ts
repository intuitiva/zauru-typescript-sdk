/**
 * Like `fetch` with `credentials: "include"`, but on a 401 carrying
 * `{ code: "UNAUTHORIZED" }` opens the reauth popup and retries **once**.
 */
export declare function authenticatedFetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response>;
