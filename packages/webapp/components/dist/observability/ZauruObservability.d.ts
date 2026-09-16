import type { ZauruClientErrorReportingOptions } from "./useZauruClientErrorReporting.js";
/**
 * Optional drop-in for apps that do not use `BodyContainer`.
 * `BodyContainer` already installs the same listeners.
 */
export declare function ZauruObservability(options: ZauruClientErrorReportingOptions): null;
