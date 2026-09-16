export type LogOrigin = "client" | "server" | "background";
export type LogLevel = "error" | "info" | "warn";
export type CloudWatchConfigInfo = {
    enabled: boolean;
    logGroup?: string;
    region?: string;
    prefixLabel?: string;
    appEnv: string;
    appVersion: string;
    skipReason?: string;
};
/**
 * Introspection for smoke tests / diagnostics. Never returns secrets.
 */
export declare function resolveCloudWatchConfig(): CloudWatchConfigInfo;
export declare function isCloudWatchEnabled(): boolean;
export interface LogPayload {
    message: string;
    stack?: string;
    url?: string;
    method?: string;
    userAgent?: string;
    userId?: string | number | null;
    appVersion?: string;
    timestamp?: number;
    /** Sub-origin: errorBoundary, window.onerror, unhandledrejection, loader, action. */
    source?: string;
    level?: LogLevel;
    [key: string]: unknown;
}
export type LogErrorResult = {
    status: "sent";
    logGroup: string;
    stream: string;
} | {
    status: "skipped";
    reason: string;
} | {
    status: "failed";
    error: string;
};
/**
 * Sends an event to CloudWatch. Never throws.
 * For client/server also prints with `console.error` (Netlify fallback).
 */
export declare function logEvent(origin: LogOrigin, payload: LogPayload): Promise<LogErrorResult>;
/**
 * Sends an error event to CloudWatch (and console.error as fallback).
 * Never throws: if CloudWatch fails, the error still lands in host logs.
 */
export declare function logError(origin: "client" | "server", payload: LogPayload): Promise<LogErrorResult>;
/**
 * Wraps a Netlify background handler: intercepts console.log/error/warn
 * during the invocation, prefixes `[functionName]:`, and flushes to the
 * `<APP_ENV>/background-functions` stream before returning (so logs are not
 * lost when Netlify freezes the isolate).
 */
export declare function withBackgroundLogs<TEvent, TContext, TResult>(functionName: string, handler: (event: TEvent, context: TContext) => TResult | Promise<TResult>): (event: TEvent, context: TContext) => Promise<TResult>;
