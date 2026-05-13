/**
 * Build per-app reauth constants with a deployment-unique prefix so multiple
 * Appocus apps on the same origin can't interfere with each other's popups.
 *
 * ```ts
 * const reauthConstants = createReauthConstants("4pinos-agrocreditos");
 * ```
 */
export function createReauthConstants(appKey) {
    return {
        REAUTH_POPUP_OAUTH_STATE: `${appKey}_reauth_popup`,
        ZAURU_REAUTH_MESSAGE_TYPE: `${appKey}:reauth-success`,
        ZAURU_REAUTH_FAILURE_TYPE: `${appKey}:reauth-failure`,
    };
}
/** Sensible defaults used when the host app never calls `configureAuthRuntime`. */
export const DEFAULT_REAUTH_CONSTANTS = createReauthConstants("appocus");
