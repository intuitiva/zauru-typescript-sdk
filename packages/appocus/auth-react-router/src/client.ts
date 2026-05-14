/**
 * Browser-safe entry point for @appocus/auth-react-router.
 *
 * Does NOT include middleware.ts or the route factories that depend on
 * @zauru-sdk/services (which pulls in @remix-run/node at runtime).
 * Those server-only exports remain accessible via the default entry point in
 * SSR / Node.js environments.
 */
export * from "./authenticated-fetch.js";
export * from "./oauth-authorize-url.js";
export * from "./reauth-constants.js";
export * from "./reauth-popup.client.js";
export * from "./auth-shell-layout.js";
export * from "./redirect-if-authenticated.js";
export * from "./route-types.js";
export * from "./runtime-config.js";
export * from "./routes/callback.js";
export * from "./routes/login-popup.js";
export * from "./routes/reauth-popup-done.js";
