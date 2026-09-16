import { useZauruClientErrorReporting } from "./useZauruClientErrorReporting.js";
/**
 * Optional drop-in for apps that do not use `BodyContainer`.
 * `BodyContainer` already installs the same listeners.
 */
export function ZauruObservability(options) {
    useZauruClientErrorReporting(options);
    return null;
}
