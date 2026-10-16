"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.BACKGROUND_HTTP_CLIENT_POLICY = exports.DEFAULT_HTTP_CLIENT_POLICY = exports.HASURA_SERVER_TIMEOUT_SECONDS = exports.HEROKU_ROUTER_TIMEOUT_SECONDS = exports.DEFAULT_HTTP_TIMEOUT_SECONDS = exports.DEFAULT_ACTION_TIMEOUT_SECONDS = void 0;
exports.mergeHttpClientPolicies = mergeHttpClientPolicies;
exports.bindHttpClientPolicyRuntime = bindHttpClientPolicyRuntime;
exports.getHttpClientPolicy = getHttpClientPolicy;
exports.runWithHttpClientPolicy = runWithHttpClientPolicy;
exports.withHttpClientPolicy = withHttpClientPolicy;
exports.isRetryableHttpError = isRetryableHttpError;
exports.httpTimeoutMsForClient = httpTimeoutMsForClient;
exports.DEFAULT_ACTION_TIMEOUT_SECONDS = 25;
exports.DEFAULT_HTTP_TIMEOUT_SECONDS = 200;
exports.HEROKU_ROUTER_TIMEOUT_SECONDS = 30;
exports.HASURA_SERVER_TIMEOUT_SECONDS = 30;
exports.DEFAULT_HTTP_CLIENT_POLICY = {
    actionTimeoutSeconds: exports.DEFAULT_ACTION_TIMEOUT_SECONDS,
    zauruTimeoutSeconds: exports.DEFAULT_HTTP_TIMEOUT_SECONDS,
    graphqlTimeoutSeconds: exports.DEFAULT_HTTP_TIMEOUT_SECONDS,
    retries: 0,
};
exports.BACKGROUND_HTTP_CLIENT_POLICY = {
    actionTimeoutSeconds: false,
    zauruTimeoutSeconds: exports.HEROKU_ROUTER_TIMEOUT_SECONDS,
    graphqlTimeoutSeconds: exports.HASURA_SERVER_TIMEOUT_SECONDS,
    retries: 1,
};
const RETRYABLE_STATUS = new Set([408, 429, 502, 503, 504]);
const RETRYABLE_NETWORK_CODES = new Set([
    "ECONNRESET",
    "ECONNABORTED",
    "ETIMEDOUT",
    "ENOTFOUND",
    "EAI_AGAIN",
    "ERR_NETWORK",
    "ERR_CANCELED",
]);
function mergeHttpClientPolicies(base, override = {}) {
    return {
        ...exports.DEFAULT_HTTP_CLIENT_POLICY,
        ...base,
        ...override,
    };
}
let fallbackStore;
function isThenable(value) {
    return (typeof value === "object" &&
        value !== null &&
        typeof value.then === "function");
}
function runWithFallbackStore(policy, fn) {
    const previous = fallbackStore;
    fallbackStore = policy;
    try {
        const result = fn();
        if (isThenable(result)) {
            return result.finally(() => {
                fallbackStore = previous;
            });
        }
        fallbackStore = previous;
        return result;
    }
    catch (error) {
        fallbackStore = previous;
        throw error;
    }
}
const fallbackRuntime = {
    get: () => fallbackStore,
    run: runWithFallbackStore,
};
let runtime = fallbackRuntime;
/**
 * Services bind AsyncLocalStorage here so concurrent serverless invocations
 * do not leak policy. Common stays browser-safe (no `node:async_hooks`).
 */
function bindHttpClientPolicyRuntime(next) {
    runtime = next;
}
function getHttpClientPolicy() {
    return mergeHttpClientPolicies(undefined, runtime.get() ?? {});
}
function runWithHttpClientPolicy(policy, fn) {
    const merged = mergeHttpClientPolicies(runtime.get(), policy);
    return runtime.run(merged, fn);
}
function withHttpClientPolicy(policy, fn) {
    return (...args) => runWithHttpClientPolicy(policy, () => fn(...args));
}
function isTimeoutError(error) {
    const code = error.code ?? "";
    if (code === "ECONNABORTED" || code === "ETIMEDOUT") {
        return true;
    }
    return /timeout/i.test(error.message ?? "");
}
function isTransientFailure(error) {
    const status = error.response?.status;
    if (status != null) {
        return RETRYABLE_STATUS.has(status);
    }
    const code = error.code ?? "";
    return isTimeoutError(error) || RETRYABLE_NETWORK_CODES.has(code);
}
function isRetryableZauruError(error) {
    const method = (error.config?.method ?? "get").toLowerCase();
    const idempotent = method === "get" || method === "head" || method === "options";
    if (idempotent) {
        return isTransientFailure(error);
    }
    if (error.response?.status != null || isTimeoutError(error)) {
        return false;
    }
    return RETRYABLE_NETWORK_CODES.has(error.code ?? "");
}
function isRetryableHttpError(error, client) {
    switch (client) {
        case "graphql":
            return isTransientFailure(error);
        case "zauru":
            return isRetryableZauruError(error);
        default: {
            const _never = client;
            return _never;
        }
    }
}
function httpTimeoutMsForClient(client, policy = getHttpClientPolicy()) {
    switch (client) {
        case "graphql":
            return policy.graphqlTimeoutSeconds * 1000;
        case "zauru":
            return policy.zauruTimeoutSeconds * 1000;
        default: {
            const _never = client;
            return _never;
        }
    }
}
