/**
 * Remix 2 only. Remix 1 apps keep their own `renderToString` entry.server
 * (no `handleError` hook).
 *
 * Copy to `app/entry.server.tsx`. CloudWatch is no-op until
 * CLOUDWATCH_LOG_GROUP + AWS creds are set.
 */
export {
  handleRequest as default,
  handleError,
} from "@zauru-sdk/utils/remix-entry.server";
