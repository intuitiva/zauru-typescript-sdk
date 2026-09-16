/**
 * Remix 2 SSR entry + CloudWatch `handleError`.
 *
 * ```ts
 * export { handleRequest as default, handleError } from "@zauru-sdk/utils/remix-entry.server";
 * ```
 */
export { handleRequest, handleError } from "./remix-handle-request.server.js";
