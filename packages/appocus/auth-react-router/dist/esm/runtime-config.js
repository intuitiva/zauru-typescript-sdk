import { DEFAULT_REAUTH_CONSTANTS, } from "./reauth-constants.js";
let runtime = {
    reauthConstants: DEFAULT_REAUTH_CONSTANTS,
    popupWindowName: "appocus-reauth",
};
/**
 * Configure the runtime singletons used by `authenticatedFetch`,
 * `requestReauthInPopup`, and the bundled route factories. Call this once at
 * client startup (e.g. from `root.tsx`).
 */
export function configureAuthRuntime(opts) {
    runtime = {
        reauthConstants: opts.reauthConstants ?? runtime.reauthConstants,
        popupWindowName: opts.popupWindowName ?? runtime.popupWindowName,
    };
    return runtime;
}
export function getAuthRuntime() {
    return runtime;
}
