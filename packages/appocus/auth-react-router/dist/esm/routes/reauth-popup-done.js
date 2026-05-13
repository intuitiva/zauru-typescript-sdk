"use client";
import { jsx as _jsx } from "react/jsx-runtime";
import { useEffect } from "react";
import { getAuthRuntime } from "../runtime-config.js";
export function createReauthPopupDoneRoute(options = {}) {
    const message = options.message ?? "Sesión renovada. Esta ventana se cerrará sola.";
    function ReauthPopupDonePage() {
        useEffect(() => {
            const origin = window.location.origin;
            const { reauthConstants } = getAuthRuntime();
            try {
                window.opener?.postMessage({ type: reauthConstants.ZAURU_REAUTH_MESSAGE_TYPE }, origin);
            }
            finally {
                window.close();
            }
        }, []);
        return (_jsx("div", { className: "bg-muted flex min-h-svh items-center justify-center p-6 text-center text-sm text-muted-foreground", children: message }));
    }
    return { default: ReauthPopupDonePage };
}
