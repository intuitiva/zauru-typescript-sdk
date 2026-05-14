"use client";
import { jsx as _jsx } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { redirect, useNavigate, useSearchParams, useSubmit, } from "react-router";
import { toast } from "sonner";
import { commitSession, getSession, nativeLogin, } from "@zauru-sdk/services";
import { config } from "@zauru-sdk/config";
import { loginMiddleware } from "../middleware.js";
import { AuthShellLayout } from "../auth-shell-layout.js";
import { getAuthRuntime } from "../runtime-config.js";
export function createCallbackRoute({ LoginForm, onSuccess, onLoginError, isMobile: isMobileFn, }) {
    const action = async ({ request, }) => {
        const formData = await request.formData();
        const isPopupReauth = formData.get("popup") === "1";
        const rawCode = formData.get("code");
        const codeValue = rawCode === "null" || rawCode === "undefined" || rawCode == null
            ? null
            : String(rawCode);
        const cookie = request.headers.get("Cookie") ?? null;
        const session = (await getSession(cookie));
        if (session.has("code")) {
            console.log("[appocus/auth] User is already logged in, redirecting to home.");
            if (isPopupReauth) {
                const reqUrl = new URL(request.url);
                return redirect(`${reqUrl.origin}/auth/reauth-popup-done`);
            }
            return redirect("/");
        }
        if (!codeValue) {
            console.error("[appocus/auth] Authorization code is missing in the callback URL.");
            return {
                error: "Authorization code is missing.",
            };
        }
        const loginResponse = await nativeLogin(session, codeValue);
        if (loginResponse.error) {
            console.error("[appocus/auth] Login failed:", loginResponse.userMsg);
            return { error: String(loginResponse.userMsg ?? "Login failed.") };
        }
        let onSuccessResult;
        try {
            onSuccessResult = await onSuccess({
                session,
                codeValue,
                request,
            });
        }
        catch (e) {
            console.error("[appocus/auth] onSuccess threw:", e);
            return {
                error: e instanceof Error
                    ? e.message
                    : "Error completando el inicio de sesión.",
            };
        }
        if ("error" in onSuccessResult) {
            return { error: onSuccessResult.error };
        }
        const expires = new Date();
        expires.setSeconds(expires.getSeconds() + Number(config.expirationDurationInSeconds));
        const setCookie = await commitSession(session, { expires });
        const reqUrl = new URL(request.url);
        if (isPopupReauth) {
            return redirect(`${reqUrl.origin}/auth/reauth-popup-done`, {
                headers: { "Set-Cookie": setCookie },
            });
        }
        const params = onSuccessResult.queryParams?.toString();
        return redirect(params ? `/?${params}` : `/`, {
            headers: { "Set-Cookie": setCookie },
        });
    };
    function CallbackPage({ actionData }) {
        const [isClient, setIsClient] = useState(false);
        const submit = useSubmit();
        const [params] = useSearchParams();
        const navigate = useNavigate();
        const mobile = isMobileFn?.() ?? false;
        const { reauthConstants } = getAuthRuntime();
        const oauthCode = params.get("code");
        const isReauthPopupFlow = params.get("state") === reauthConstants.REAUTH_POPUP_OAUTH_STATE;
        useEffect(() => {
            setIsClient(true);
        }, []);
        useEffect(() => {
            if (!isClient || !oauthCode)
                return;
            submit({
                code: oauthCode,
                ...(isReauthPopupFlow ? { popup: "1" } : {}),
            }, { method: "post", action: "/callback" });
        }, [isClient, submit, oauthCode, isReauthPopupFlow]);
        useEffect(() => {
            if (!actionData ||
                !("error" in actionData) ||
                !actionData.error) {
                return;
            }
            const description = actionData.error;
            if (isReauthPopupFlow) {
                window.opener?.postMessage({
                    type: reauthConstants.ZAURU_REAUTH_FAILURE_TYPE,
                    error: description,
                }, window.location.origin);
                window.close();
                return;
            }
            if (onLoginError?.(description))
                return;
            toast.error("Error", {
                description,
                position: mobile ? "bottom-center" : "bottom-right",
                duration: 4000,
            });
            navigate("/login");
        }, [actionData, mobile, navigate, isReauthPopupFlow, reauthConstants]);
        return (_jsx(AuthShellLayout, { children: _jsx(LoginForm, { isLoading: true }) }));
    }
    return {
        middleware: [loginMiddleware],
        action: action,
        default: CallbackPage,
    };
}
