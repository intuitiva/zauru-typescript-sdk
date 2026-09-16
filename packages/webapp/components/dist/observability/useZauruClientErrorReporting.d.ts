export type ZauruClientErrorReportingOptions = {
    appVersion?: string;
    enabled?: boolean;
};
/**
 * Captures `window.onerror` and `unhandledrejection` and POSTs them to
 * `/api/client-errors`. Used by `BodyContainer` by default.
 */
export declare function useZauruClientErrorReporting(options?: ZauruClientErrorReportingOptions): void;
