/**
 * Server-only CloudWatch observability for Remix webapps.
 *
 * Import from `@zauru-sdk/utils/cloudwatch.server` (not the main barrel) so
 * the AWS SDK stays out of the client bundle.
 */
export {
  isCloudWatchEnabled,
  logError,
  logEvent,
  resolveCloudWatchConfig,
  withBackgroundLogs,
  type CloudWatchConfigInfo,
  type LogErrorResult,
  type LogLevel,
  type LogOrigin,
  type LogPayload,
} from "./cloudwatch-logger.server.js";

export {
  createClientErrorsAction,
  handleError,
} from "./cloudwatch-remix.server.js";
