"use client";

import * as React from "react";
import { useEffect } from "react";
import { getAuthRuntime } from "../runtime-config.js";
import type { RouteModule } from "../route-types.js";

export type CreateReauthPopupDoneRouteOptions = {
  message?: string;
};

export function createReauthPopupDoneRoute(
  options: CreateReauthPopupDoneRouteOptions = {},
): RouteModule {
  const message =
    options.message ?? "Sesión renovada. Esta ventana se cerrará sola.";

  function ReauthPopupDonePage() {
    useEffect(() => {
      const origin = window.location.origin;
      const { reauthConstants } = getAuthRuntime();
      try {
        window.opener?.postMessage(
          { type: reauthConstants.ZAURU_REAUTH_MESSAGE_TYPE },
          origin,
        );
      } finally {
        window.close();
      }
    }, []);

    return (
      <div className="bg-muted flex min-h-svh items-center justify-center p-6 text-center text-sm text-muted-foreground">
        {message}
      </div>
    );
  }

  return { default: ReauthPopupDonePage };
}
