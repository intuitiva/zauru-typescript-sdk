/**
 * Open the OAuth popup and resolve once the session cookie has been refreshed.
 * Concurrent callers share a single in-flight promise.
 */
export declare function requestReauthInPopup(): Promise<void>;
