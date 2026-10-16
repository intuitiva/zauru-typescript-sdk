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
  response?: { status?: number };
  config?: { method?: string };
};

export const DEFAULT_ACTION_TIMEOUT_SECONDS = 25;
export const DEFAULT_HTTP_TIMEOUT_SECONDS = 200;
export const HEROKU_ROUTER_TIMEOUT_SECONDS = 30;
export const HASURA_SERVER_TIMEOUT_SECONDS = 30;

export const DEFAULT_HTTP_CLIENT_POLICY: ResolvedHttpClientPolicy = {
  actionTimeoutSeconds: DEFAULT_ACTION_TIMEOUT_SECONDS,
  zauruTimeoutSeconds: DEFAULT_HTTP_TIMEOUT_SECONDS,
  graphqlTimeoutSeconds: DEFAULT_HTTP_TIMEOUT_SECONDS,
  retries: 0,
};

export const BACKGROUND_HTTP_CLIENT_POLICY: HttpClientPolicy = {
  actionTimeoutSeconds: false,
  zauruTimeoutSeconds: HEROKU_ROUTER_TIMEOUT_SECONDS,
  graphqlTimeoutSeconds: HASURA_SERVER_TIMEOUT_SECONDS,
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

export function mergeHttpClientPolicies(
  base: HttpClientPolicy | undefined,
  override: HttpClientPolicy = {},
): ResolvedHttpClientPolicy {
  return {
    ...DEFAULT_HTTP_CLIENT_POLICY,
    ...base,
    ...override,
  };
}

type PolicyRuntime = {
  get: () => HttpClientPolicy | undefined;
  run: <T>(policy: ResolvedHttpClientPolicy, fn: () => T) => T;
};

let fallbackStore: HttpClientPolicy | undefined;

function isThenable(value: unknown): value is Promise<unknown> {
  return (
    typeof value === "object" &&
    value !== null &&
    typeof (value as { then?: unknown }).then === "function"
  );
}

function runWithFallbackStore<T>(
  policy: ResolvedHttpClientPolicy,
  fn: () => T,
): T {
  const previous = fallbackStore;
  fallbackStore = policy;
  try {
    const result = fn();
    if (isThenable(result)) {
      return result.finally(() => {
        fallbackStore = previous;
      }) as T;
    }
    fallbackStore = previous;
    return result;
  } catch (error) {
    fallbackStore = previous;
    throw error;
  }
}

const fallbackRuntime: PolicyRuntime = {
  get: () => fallbackStore,
  run: runWithFallbackStore,
};

let runtime: PolicyRuntime = fallbackRuntime;

/**
 * Services bind AsyncLocalStorage here so concurrent serverless invocations
 * do not leak policy. Common stays browser-safe (no `node:async_hooks`).
 */
export function bindHttpClientPolicyRuntime(next: PolicyRuntime): void {
  runtime = next;
}

export function getHttpClientPolicy(): ResolvedHttpClientPolicy {
  return mergeHttpClientPolicies(undefined, runtime.get() ?? {});
}

export function runWithHttpClientPolicy<T>(
  policy: HttpClientPolicy,
  fn: () => T,
): T {
  const merged = mergeHttpClientPolicies(runtime.get(), policy);
  return runtime.run(merged, fn);
}

export function withHttpClientPolicy<Args extends unknown[], Result>(
  policy: HttpClientPolicy,
  fn: (...args: Args) => Result,
): (...args: Args) => Result {
  return (...args: Args) =>
    runWithHttpClientPolicy(policy, () => fn(...args));
}

function isTimeoutError(error: HttpErrorLike): boolean {
  const code = error.code ?? "";
  if (code === "ECONNABORTED" || code === "ETIMEDOUT") {
    return true;
  }
  return /timeout/i.test(error.message ?? "");
}

function isTransientFailure(error: HttpErrorLike): boolean {
  const status = error.response?.status;
  if (status != null) {
    return RETRYABLE_STATUS.has(status);
  }
  const code = error.code ?? "";
  return isTimeoutError(error) || RETRYABLE_NETWORK_CODES.has(code);
}

function isRetryableZauruError(error: HttpErrorLike): boolean {
  const method = (error.config?.method ?? "get").toLowerCase();
  const idempotent =
    method === "get" || method === "head" || method === "options";
  if (idempotent) {
    return isTransientFailure(error);
  }
  if (error.response?.status != null || isTimeoutError(error)) {
    return false;
  }
  return RETRYABLE_NETWORK_CODES.has(error.code ?? "");
}

export function isRetryableHttpError(
  error: HttpErrorLike,
  client: HttpClientKind,
): boolean {
  switch (client) {
    case "graphql":
      return isTransientFailure(error);
    case "zauru":
      return isRetryableZauruError(error);
    default: {
      const _never: never = client;
      return _never;
    }
  }
}

export function httpTimeoutMsForClient(
  client: HttpClientKind,
  policy: ResolvedHttpClientPolicy = getHttpClientPolicy(),
): number {
  switch (client) {
    case "graphql":
      return policy.graphqlTimeoutSeconds * 1000;
    case "zauru":
      return policy.zauruTimeoutSeconds * 1000;
    default: {
      const _never: never = client;
      return _never;
    }
  }
}
