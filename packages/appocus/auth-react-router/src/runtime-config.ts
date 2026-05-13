import {
  DEFAULT_REAUTH_CONSTANTS,
  type ReauthConstants,
} from "./reauth-constants.js";

export type AuthRuntimeConfig = {
  reauthConstants: ReauthConstants;
  /**
   * Window name passed to `window.open` for the reauth popup. Setting this to a
   * stable per-app value lets users reuse an already-open popup.
   */
  popupWindowName: string;
};

let runtime: AuthRuntimeConfig = {
  reauthConstants: DEFAULT_REAUTH_CONSTANTS,
  popupWindowName: "appocus-reauth",
};

/**
 * Configure the runtime singletons used by `authenticatedFetch`,
 * `requestReauthInPopup`, and the bundled route factories. Call this once at
 * client startup (e.g. from `root.tsx`).
 */
export function configureAuthRuntime(
  opts: Partial<AuthRuntimeConfig>,
): AuthRuntimeConfig {
  runtime = {
    reauthConstants: opts.reauthConstants ?? runtime.reauthConstants,
    popupWindowName: opts.popupWindowName ?? runtime.popupWindowName,
  };
  return runtime;
}

export function getAuthRuntime(): AuthRuntimeConfig {
  return runtime;
}
