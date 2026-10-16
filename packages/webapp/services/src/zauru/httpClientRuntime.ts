import { AsyncLocalStorage } from "node:async_hooks";
import type { AxiosInstance, InternalAxiosRequestConfig } from "axios";
import {
  bindHttpClientPolicyRuntime,
  getHttpClientPolicy,
  httpTimeoutMsForClient,
  isRetryableHttpError,
  type HttpClientKind,
  type ResolvedHttpClientPolicy,
} from "@zauru-sdk/common";

type RetryableRequestConfig = InternalAxiosRequestConfig & {
  __zauruRetryCount?: number;
};

const als = new AsyncLocalStorage<ResolvedHttpClientPolicy>();

bindHttpClientPolicyRuntime({
  get: () => als.getStore(),
  run: (policy, fn) => als.run(policy, fn),
});

export function applyHttpClientTimeout(
  request: InternalAxiosRequestConfig,
  client: HttpClientKind,
): InternalAxiosRequestConfig {
  if (request.timeout != null && request.timeout > 0) {
    return request;
  }
  request.timeout = httpTimeoutMsForClient(client);
  return request;
}

export async function maybeRetryHttpRequest(
  error: unknown,
  instance: AxiosInstance,
  client: HttpClientKind,
): Promise<unknown | null> {
  const axiosError = error as {
    code?: string;
    message?: string;
    response?: { status?: number };
    config?: RetryableRequestConfig;
  };
  const config = axiosError.config;
  if (!config) {
    return null;
  }

  const policy = getHttpClientPolicy();
  const retries = policy.retries ?? 0;
  const attempt = config.__zauruRetryCount ?? 0;
  if (attempt >= retries || !isRetryableHttpError(axiosError, client)) {
    return null;
  }

  config.__zauruRetryCount = attempt + 1;
  console.log(
    `[http] retry ${config.__zauruRetryCount}/${retries} ${client} ${(config.method ?? "get").toUpperCase()} ${config.baseURL ?? ""}${config.url ?? ""}`,
  );
  return instance.request(config);
}
