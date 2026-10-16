/**
 * Timeouts and retries for outbound HTTP (Zauru REST + Hasura GraphQL).
 *
 * Defaults keep the 25s action budget of Netlify sync functions. Background
 * lambdas opt into {@link BACKGROUND_HTTP_CLIENT_POLICY}: per-request max of
 * 30s (Heroku router H12 and Hasura `HASURA_GRAPHQL_SERVER_TIMEOUT` default)
 * and one retry. The 25s `handlePossibleAxiosErrors` race is disabled there
 * so a slow query is not aborted before the platform itself gives up.
 *
 * Use {@link runWithHttpClientPolicy} / {@link withHttpClientPolicy} around a
 * set of calls, or pass `timeout` on a single axios config to override one
 * request. GraphQL POSTs retry; Zauru writes do not retry on timeout (the
 * server may have committed).
 */
export type HttpClientKind = "graphql" | "zauru";
export type HttpClientPolicy = {
    /**
     * Budget for the whole `handlePossibleAxiosErrors` callback.
     * `false` disables that race so each HTTP call uses its own timeout.
     */
    actionTimeoutSeconds?: number | false;
    zauruTimeoutSeconds?: number;
    graphqlTimeoutSeconds?: number;
    /** Extra attempts after the first failure. `1` = retry once. */
    retries?: number;
};
export type ResolvedHttpClientPolicy = {
    actionTimeoutSeconds: number | false;
    zauruTimeoutSeconds: number;
    graphqlTimeoutSeconds: number;
    retries: number;
};
export type HttpErrorLike = {
    code?: string;
    message?: string;
    response?: {
        status?: number;
    };
    config?: {
        method?: string;
    };
};
export declare const DEFAULT_ACTION_TIMEOUT_SECONDS = 25;
export declare const DEFAULT_HTTP_TIMEOUT_SECONDS = 200;
export declare const HEROKU_ROUTER_TIMEOUT_SECONDS = 30;
export declare const HASURA_SERVER_TIMEOUT_SECONDS = 30;
export declare const DEFAULT_HTTP_CLIENT_POLICY: ResolvedHttpClientPolicy;
export declare const BACKGROUND_HTTP_CLIENT_POLICY: HttpClientPolicy;
export declare function mergeHttpClientPolicies(base: HttpClientPolicy | undefined, override?: HttpClientPolicy): ResolvedHttpClientPolicy;
type PolicyRuntime = {
    get: () => HttpClientPolicy | undefined;
    run: <T>(policy: ResolvedHttpClientPolicy, fn: () => T) => T;
};
/**
 * Services bind AsyncLocalStorage here so concurrent serverless invocations
 * do not leak policy. Common stays browser-safe (no `node:async_hooks`).
 */
export declare function bindHttpClientPolicyRuntime(next: PolicyRuntime): void;
export declare function getHttpClientPolicy(): ResolvedHttpClientPolicy;
export declare function runWithHttpClientPolicy<T>(policy: HttpClientPolicy, fn: () => T): T;
export declare function withHttpClientPolicy<Args extends unknown[], Result>(policy: HttpClientPolicy, fn: (...args: Args) => Result): (...args: Args) => Result;
export declare function isRetryableHttpError(error: HttpErrorLike, client: HttpClientKind): boolean;
export declare function httpTimeoutMsForClient(client: HttpClientKind, policy?: ResolvedHttpClientPolicy): number;
export {};
