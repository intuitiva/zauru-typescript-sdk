import { AsyncLocalStorage } from "node:async_hooks";
import { bindHttpClientPolicyRuntime, getHttpClientPolicy, httpTimeoutMsForClient, isRetryableHttpError, } from "@zauru-sdk/common";
const als = new AsyncLocalStorage();
bindHttpClientPolicyRuntime({
    get: () => als.getStore(),
    run: (policy, fn) => als.run(policy, fn),
});
export function applyHttpClientTimeout(request, client) {
    if (request.timeout != null && request.timeout > 0) {
        return request;
    }
    request.timeout = httpTimeoutMsForClient(client);
    return request;
}
export async function maybeRetryHttpRequest(error, instance, client) {
    const axiosError = error;
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
    console.log(`[http] retry ${config.__zauruRetryCount}/${retries} ${client} ${(config.method ?? "get").toUpperCase()} ${config.baseURL ?? ""}${config.url ?? ""}`);
    return instance.request(config);
}
