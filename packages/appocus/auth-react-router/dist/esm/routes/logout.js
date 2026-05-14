"use client";
import { jsx as _jsx } from "react/jsx-runtime";
import { useEffect } from "react";
import { redirect, useSubmit } from "react-router";
import { getSession, destroySession } from "@zauru-sdk/services";
import { config } from "@zauru-sdk/config";
import { AuthShellLayout } from "../auth-shell-layout.js";
/** Module-scope flag to avoid double-submission under React Strict Mode. */
let logoutAutoSubmitStarted = false;
export function createLogoutRoute({ LoginForm, clearUserData, copy, }) {
    const action = async ({ request }) => {
        const cookie = request.headers.get("Cookie");
        const session = await getSession(cookie || "");
        return redirect(`${config.oauthBaseURL}/logout`, {
            headers: {
                "Set-Cookie": await destroySession(session),
            },
        });
    };
    function LogoutPage() {
        const submit = useSubmit();
        useEffect(() => {
            clearUserData?.();
            if (logoutAutoSubmitStarted)
                return;
            logoutAutoSubmitStarted = true;
            submit(null, { method: "post", action: "/logout" });
        }, [submit]);
        return (_jsx(AuthShellLayout, { children: _jsx(LoginForm, { isLoading: true, mode: "logout", title: copy?.title ?? "Cerrando sesión", loadingText: copy?.loadingText ?? "Cerrando sesión...", buttonText: copy?.buttonText ?? "Cerrar sesión" }) }));
    }
    return {
        action,
        default: LogoutPage,
    };
}
