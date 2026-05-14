"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import {
  redirect,
  useNavigate,
  useSearchParams,
  useSubmit,
} from "react-router";
import { toast } from "sonner";
import {
  commitSession,
  getSession,
  nativeLogin,
} from "@zauru-sdk/services";
import { config } from "@zauru-sdk/config";
import { loginMiddleware } from "../middleware.js";
import { AuthShellLayout } from "../auth-shell-layout.js";
import { getAuthRuntime } from "../runtime-config.js";
import type { LoginFormComponent, RouteModule } from "../route-types.js";

/**
 * Minimal session contract this route depends on. Re-typed locally so we don't
 * pull `@zauru-sdk/services` types into the consumer surface.
 */
type ZauruSession = {
  get: (key: string) => unknown;
  has: (key: string) => boolean;
};

export type CallbackSuccessArgs = {
  session: ZauruSession;
  codeValue: string;
  request: Request;
};

export type CallbackSuccessResult = {
  /**
   * Query params appended to the post-login redirect (`/?<queryParams>`). Used
   * by apps to seed their local user context with names, ids, etc.
   */
  queryParams?: URLSearchParams;
};

export type CallbackErrorResult = { error: string };

export type CallbackActionData = CallbackErrorResult | { ok: true };

export type CreateCallbackRouteOptions = {
  /** Your app's `LoginForm` (used as the splash while the action runs). */
  LoginForm: LoginFormComponent;
  /**
   * Called after `nativeLogin` succeeds. Use it to persist domain-specific user
   * records (employees, agencies, etc.) and to assemble redirect query params.
   * Throw or return `{ error }` to surface an error to the page.
   */
  onSuccess: (
    args: CallbackSuccessArgs,
  ) => Promise<CallbackSuccessResult | CallbackErrorResult>;
  /**
   * Optional hook for handling client-side login errors before the default toast
   * + navigate fallback runs. Return `true` to skip the default behavior.
   */
  onLoginError?: (description: string) => boolean | void;
  /** Optional override for the position of the error toast. */
  isMobile?: () => boolean;
};

export function createCallbackRoute({
  LoginForm,
  onSuccess,
  onLoginError,
  isMobile: isMobileFn,
}: CreateCallbackRouteOptions): RouteModule<CallbackActionData> {
  const action = async ({
    request,
  }: {
    request: Request;
  }): Promise<Response | CallbackActionData> => {
    const formData = await request.formData();
    const isPopupReauth = formData.get("popup") === "1";

    const rawCode = formData.get("code");
    const codeValue =
      rawCode === "null" || rawCode === "undefined" || rawCode == null
        ? null
        : String(rawCode);
    const cookie = request.headers.get("Cookie") ?? null;
    const session = (await getSession(cookie)) as unknown as ZauruSession;

    if (session.has("code")) {
      console.log(
        "[appocus/auth] User is already logged in, redirecting to home.",
      );
      if (isPopupReauth) {
        const reqUrl = new URL(request.url);
        return redirect(`${reqUrl.origin}/auth/reauth-popup-done`);
      }
      return redirect("/");
    }

    if (!codeValue) {
      console.error(
        "[appocus/auth] Authorization code is missing in the callback URL.",
      );
      return {
        error: "Authorization code is missing.",
      };
    }

    const loginResponse = await nativeLogin(session as never, codeValue);
    if (loginResponse.error) {
      console.error("[appocus/auth] Login failed:", loginResponse.userMsg);
      return { error: String(loginResponse.userMsg ?? "Login failed.") };
    }

    let onSuccessResult: CallbackSuccessResult | CallbackErrorResult;
    try {
      onSuccessResult = await onSuccess({
        session,
        codeValue,
        request,
      });
    } catch (e) {
      console.error("[appocus/auth] onSuccess threw:", e);
      return {
        error:
          e instanceof Error
            ? e.message
            : "Error completando el inicio de sesión.",
      };
    }

    if ("error" in onSuccessResult) {
      return { error: onSuccessResult.error };
    }

    const expires = new Date();
    expires.setSeconds(
      expires.getSeconds() + Number(config.expirationDurationInSeconds),
    );

    const setCookie = await commitSession(session as never, { expires });
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

  function CallbackPage({ actionData }: { actionData?: CallbackActionData }) {
    const [isClient, setIsClient] = useState(false);
    const submit = useSubmit();
    const [params] = useSearchParams();
    const navigate = useNavigate();
    const mobile = isMobileFn?.() ?? false;
    const { reauthConstants } = getAuthRuntime();

    const oauthCode = params.get("code");
    const isReauthPopupFlow =
      params.get("state") === reauthConstants.REAUTH_POPUP_OAUTH_STATE;

    useEffect(() => {
      setIsClient(true);
    }, []);

    useEffect(() => {
      if (!isClient || !oauthCode) return;
      submit(
        {
          code: oauthCode,
          ...(isReauthPopupFlow ? { popup: "1" } : {}),
        },
        { method: "post", action: "/callback" },
      );
    }, [isClient, submit, oauthCode, isReauthPopupFlow]);

    useEffect(() => {
      if (
        !actionData ||
        !("error" in actionData) ||
        !(actionData as CallbackErrorResult).error
      ) {
        return;
      }
      const description = (actionData as CallbackErrorResult).error;

      if (isReauthPopupFlow) {
        window.opener?.postMessage(
          {
            type: reauthConstants.ZAURU_REAUTH_FAILURE_TYPE,
            error: description,
          },
          window.location.origin,
        );
        window.close();
        return;
      }

      if (onLoginError?.(description)) return;

      toast.error("Error", {
        description,
        position: mobile ? "bottom-center" : "bottom-right",
        duration: 4000,
      });
      navigate("/login");
    }, [actionData, mobile, navigate, isReauthPopupFlow, reauthConstants]);

    return (
      <AuthShellLayout>
        <LoginForm isLoading />
      </AuthShellLayout>
    );
  }

  return {
    middleware: [loginMiddleware],
    action: action as RouteModule<CallbackActionData>["action"],
    default: CallbackPage,
  };
}
