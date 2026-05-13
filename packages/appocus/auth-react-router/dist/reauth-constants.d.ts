export type ReauthConstants = {
    /** OAuth `state` value used when the login is happening inside a popup. */
    REAUTH_POPUP_OAUTH_STATE: string;
    /** `postMessage` type emitted by the popup after a successful re-login. */
    ZAURU_REAUTH_MESSAGE_TYPE: string;
    /** `postMessage` type emitted by the popup when re-login fails. */
    ZAURU_REAUTH_FAILURE_TYPE: string;
};
/**
 * Build per-app reauth constants with a deployment-unique prefix so multiple
 * Appocus apps on the same origin can't interfere with each other's popups.
 *
 * ```ts
 * const reauthConstants = createReauthConstants("4pinos-agrocreditos");
 * ```
 */
export declare function createReauthConstants(appKey: string): ReauthConstants;
/** Sensible defaults used when the host app never calls `configureAuthRuntime`. */
export declare const DEFAULT_REAUTH_CONSTANTS: ReauthConstants;
