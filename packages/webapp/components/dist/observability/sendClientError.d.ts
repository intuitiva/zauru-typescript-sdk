/**
 * Client helper to report errors to `/api/client-errors`, which forwards
 * them to CloudWatch Logs (with host logs as fallback).
 *
 * `keepalive: true` keeps the request alive if the page unloads right after.
 */
export interface ClientErrorPayload {
    message: string;
    stack?: string;
    /** Sub-origin: errorBoundary, window.onerror, unhandledrejection. */
    source?: string;
    url?: string;
    userAgent?: string;
    appVersion?: string;
    timestamp?: number;
    [key: string]: unknown;
}
export declare function setClientErrorAppVersion(version?: string): void;
/**
 * Sends a client error to the server. Best-effort: never throws.
 * Deduplicates identical consecutive reports so re-renders of the same
 * error do not flood CloudWatch.
 */
export declare function sendClientError(payload: ClientErrorPayload): void;
