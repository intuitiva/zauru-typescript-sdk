"use client";

import { useEffect } from "react";
import { useNavigate } from "react-router";

/**
 * Probes `/api/auth/me` and, on success, navigates to `/`.
 * Reinforces the server-side redirect for SPA flows where the URL isn't updated
 * after the route module's middleware runs.
 */
export function RedirectIfAuthenticated({
  meEndpoint = "/api/auth/me",
  redirectTo = "/",
}: {
  meEndpoint?: string;
  redirectTo?: string;
} = {}) {
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;
    fetch(meEndpoint, { credentials: "include" })
      .then((res) => {
        if (!cancelled && res.ok) {
          navigate(redirectTo, { replace: true });
        }
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, [navigate, meEndpoint, redirectTo]);

  return null;
}
