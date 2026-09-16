/**
 * Client helper to report errors to `/api/client-errors`, which forwards
 * them to CloudWatch Logs (with host logs as fallback).
 *
 * `keepalive: true` keeps the request alive if the page unloads right after.
 */
const ENDPOINT = "/api/client-errors";
let lastReportedKey = "";
let defaultAppVersion;
export function setClientErrorAppVersion(version) {
    defaultAppVersion = version;
}
/**
 * Sends a client error to the server. Best-effort: never throws.
 * Deduplicates identical consecutive reports so re-renders of the same
 * error do not flood CloudWatch.
 */
export function sendClientError(payload) {
    if (typeof window === "undefined")
        return;
    const body = {
        message: payload.message,
        stack: payload.stack,
        source: payload.source ?? "unknown",
        url: payload.url ?? window.location.href,
        userAgent: payload.userAgent ?? navigator.userAgent,
        appVersion: payload.appVersion ?? defaultAppVersion,
        timestamp: payload.timestamp ?? Date.now(),
    };
    const dedupKey = `${body.source}|${body.message}|${body.url}`;
    if (dedupKey === lastReportedKey)
        return;
    lastReportedKey = dedupKey;
    try {
        fetch(ENDPOINT, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
            keepalive: true,
            credentials: "same-origin",
        }).catch(() => {
            // Silent: reporting must not break UX.
        });
    }
    catch {
        // Silent.
    }
}
