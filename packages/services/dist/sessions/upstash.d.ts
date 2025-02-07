export declare const MAX_AGE_SESSION_COOKIE: number;
export declare function fetchWithRetries(url: string, config?: {}, retries?: number, backoff?: number): Promise<import("node-fetch").Response>;
export declare function createUpstashSessionStorage({ cookie }: any): import("@remix-run/node").SessionStorage<import("@remix-run/node").SessionData, import("@remix-run/node").SessionData>;
