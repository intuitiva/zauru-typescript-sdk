export declare function fetchWithRetries(url: string, config?: {}, retries?: number, backoff?: number): Promise<import("axios").AxiosResponse<any, any> | null>;
export declare function createUpstashSessionStorage({ cookie }: any): import("@remix-run/node").SessionStorage<import("@remix-run/node").SessionData, import("@remix-run/node").SessionData>;
