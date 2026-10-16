import { bindHttpClientPolicyRuntime, getHttpClientPolicy, httpTimeoutMsForClient, isRetryableHttpError, } from "@zauru-sdk/common";
/**
 * Bind Node ALS without a static `node:async_hooks` import. Vite's client
 * bundle stubs that builtin as `__vite-browser-external` and fails named
 * exports. `process.getBuiltinModule` is runtime-only (Node 20.16+/22+).
 * Older Node and the browser keep common's fallback store.
 */
function tryBindNodeAls() {
    const processRef = globalThis.process;
    if (!processRef?.versions?.node ||
        typeof processRef.getBuiltinModule !== "function") {
        return;
    }
    try {
        const hooks = processRef.getBuiltinModule("async_hooks") ??
            processRef.getBuiltinModule("node:async_hooks");
        const AsyncLocalStorage = hooks?.AsyncLocalStorage;
        if (!AsyncLocalStorage) {
            return;
        }
        const als = new AsyncLocalStorage();
        bindHttpClientPolicyRuntime({
            get: () => als.getStore(),
            run: (policy, fn) => als.run(policy, fn),
        });
    }
    catch {
        // Keep common's in-process fallback.
    }
}
tryBindNodeAls();
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
