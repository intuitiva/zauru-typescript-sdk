import type { AppLoadContext, EntryContext } from "@remix-run/node";
import { handleError } from "./cloudwatch-remix.server.js";
/**
 * Remix 2 `handleRequest` (pipeable SSR). Use with `handleError` from
 * `@zauru-sdk/utils/cloudwatch.server` in `app/entry.server.tsx`:
 *
 * ```ts
 * export { handleRequest as default, handleError } from "@zauru-sdk/utils/remix-entry.server";
 * ```
 *
 * Remix 1 apps keep their own `renderToString` entry; they have no `handleError`.
 */
export declare function handleRequest(request: Request, responseStatusCode: number, responseHeaders: Headers, remixContext: EntryContext, _loadContext: AppLoadContext): Promise<unknown>;
export { handleError };
