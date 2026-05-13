import { type ReauthConstants } from "./reauth-constants.js";
export type AuthRuntimeConfig = {
    reauthConstants: ReauthConstants;
    /**
     * Window name passed to `window.open` for the reauth popup. Setting this to a
     * stable per-app value lets users reuse an already-open popup.
     */
    popupWindowName: string;
};
/**
 * Configure the runtime singletons used by `authenticatedFetch`,
 * `requestReauthInPopup`, and the bundled route factories. Call this once at
 * client startup (e.g. from `root.tsx`).
 */
export declare function configureAuthRuntime(opts: Partial<AuthRuntimeConfig>): AuthRuntimeConfig;
export declare function getAuthRuntime(): AuthRuntimeConfig;
