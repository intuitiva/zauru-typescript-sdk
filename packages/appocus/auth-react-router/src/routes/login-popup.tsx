import * as React from "react";
import { redirect } from "react-router";
import { buildOAuthAuthorizeURL } from "../oauth-authorize-url.js";
import { getAuthRuntime } from "../runtime-config.js";
import type { RouteModule } from "../route-types.js";

export type CreateLoginPopupRouteOptions = {
  /** Message shown while the page is redirecting to the OAuth dialog. */
  redirectingMessage?: string;
};

export function createLoginPopupRoute(
  options: CreateLoginPopupRouteOptions = {},
): RouteModule {
  const message = options.redirectingMessage ?? "Redirigiendo al inicio de sesión…";

  const loader = async ({ request }: { request: Request }) => {
    const { reauthConstants } = getAuthRuntime();
    throw redirect(
      buildOAuthAuthorizeURL(request.url, {
        state: reauthConstants.REAUTH_POPUP_OAUTH_STATE,
      }),
    );
  };

  function LoginPopupPage() {
    return (
      <div className="bg-muted flex min-h-svh items-center justify-center p-6 text-center text-sm text-muted-foreground">
        {message}
      </div>
    );
  }

  return {
    loader,
    default: LoginPopupPage,
  };
}
