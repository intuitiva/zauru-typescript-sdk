"use client";

import * as React from "react";
import { useEffect } from "react";
import { redirect, useSubmit } from "react-router";
import { getSession, destroySession } from "@zauru-sdk/webapp-services";
import { config } from "@zauru-sdk/webapp-config";
import { AuthShellLayout } from "../auth-shell-layout.js";
import type { LoginFormComponent, RouteModule } from "../route-types.js";

export type CreateLogoutRouteOptions = {
  /** Your app's `LoginForm` (used in the "Cerrando sesión" splash). */
  LoginForm: LoginFormComponent;
  /** Clear app-local user state on the client (e.g. context cache). */
  clearUserData?: () => void;
  /** Copy override for the splash (defaults are Spanish to match the rest of the suite). */
  copy?: {
    title?: string;
    loadingText?: string;
    buttonText?: string;
  };
};

/** Module-scope flag to avoid double-submission under React Strict Mode. */
let logoutAutoSubmitStarted = false;

export function createLogoutRoute({
  LoginForm,
  clearUserData,
  copy,
}: CreateLogoutRouteOptions): RouteModule {
  const action = async ({ request }: { request: Request }) => {
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
      if (logoutAutoSubmitStarted) return;
      logoutAutoSubmitStarted = true;
      submit(null, { method: "post", action: "/logout" });
    }, [submit]);

    return (
      <AuthShellLayout>
        <LoginForm
          isLoading
          mode="logout"
          title={copy?.title ?? "Cerrando sesión"}
          loadingText={copy?.loadingText ?? "Cerrando sesión..."}
          buttonText={copy?.buttonText ?? "Cerrar sesión"}
        />
      </AuthShellLayout>
    );
  }

  return {
    action,
    default: LogoutPage,
  };
}
