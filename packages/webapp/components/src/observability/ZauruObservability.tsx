import { useZauruClientErrorReporting } from "./useZauruClientErrorReporting.js";
import type { ZauruClientErrorReportingOptions } from "./useZauruClientErrorReporting.js";

/**
 * Optional drop-in for apps that do not use `BodyContainer`.
 * `BodyContainer` already installs the same listeners.
 */
export function ZauruObservability(options: ZauruClientErrorReportingOptions) {
  useZauruClientErrorReporting(options);
  return null;
}
