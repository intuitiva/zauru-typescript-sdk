import { useEffect } from "react";
import { sendClientError, setClientErrorAppVersion, } from "./sendClientError.js";
/**
 * Captures `window.onerror` and `unhandledrejection` and POSTs them to
 * `/api/client-errors`. Used by `BodyContainer` by default.
 */
export function useZauruClientErrorReporting(options) {
    const enabled = options?.enabled !== false;
    const appVersion = options?.appVersion;
    useEffect(() => {
        if (!enabled || typeof window === "undefined")
            return;
        if (appVersion)
            setClientErrorAppVersion(appVersion);
        const onError = (event) => {
            sendClientError({
                message: event.message || "Error no capturado (window.onerror)",
                stack: event.error instanceof Error ? event.error.stack : undefined,
                source: "window.onerror",
            });
        };
        const onRejection = (event) => {
            const reason = event.reason;
            sendClientError({
                message: reason instanceof Error
                    ? reason.message
                    : typeof reason === "string"
                        ? reason
                        : "Promesa rechazada no manejada",
                stack: reason instanceof Error ? reason.stack : undefined,
                source: "unhandledrejection",
            });
        };
        window.addEventListener("error", onError);
        window.addEventListener("unhandledrejection", onRejection);
        return () => {
            window.removeEventListener("error", onError);
            window.removeEventListener("unhandledrejection", onRejection);
        };
    }, [enabled, appVersion]);
}
