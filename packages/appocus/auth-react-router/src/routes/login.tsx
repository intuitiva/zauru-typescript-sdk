import * as React from "react";
import { redirect } from "react-router";
import { loginMiddleware } from "../middleware.js";
import { buildOAuthAuthorizeURL } from "../oauth-authorize-url.js";
import { AuthShellLayout } from "../auth-shell-layout.js";
import { RedirectIfAuthenticated } from "../redirect-if-authenticated.js";
import type { LoginFormComponent, RouteModule } from "../route-types.js";

export type CreateLoginRouteOptions = {
  /** Your app's `LoginForm` (e.g. from `@appocus/ui`). */
  LoginForm: LoginFormComponent;
  /**
   * Override the default action (e.g. to log analytics). Defaults to redirecting
   * to the OAuth authorize URL derived from `request.url`.
   */
  onAction?: (request: Request) => Promise<Response> | Response;
};

export function createLoginRoute({
  LoginForm,
  onAction,
}: CreateLoginRouteOptions): RouteModule {
  const action = async ({ request }: { request: Request }) => {
    if (onAction) return onAction(request);
    return redirect(buildOAuthAuthorizeURL(request.url));
  };

  function LoginPage() {
    return (
      <AuthShellLayout>
        <RedirectIfAuthenticated />
        <LoginForm />
      </AuthShellLayout>
    );
  }

  return {
    middleware: [loginMiddleware],
    action,
    default: LoginPage,
  };
}
