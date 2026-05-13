"use client";

import { toast } from "sonner";
import { getAuthRuntime } from "./runtime-config.js";

const POPUP_FEATURES =
  "popup=yes,width=520,height=720,scrollbars=yes,resizable=yes";

const REAUTH_TIMEOUT_MS = 5 * 60 * 1000;
const CLOSED_POLL_MS = 400;

let reauthPromise: Promise<void> | null = null;

function waitForReauthPopup(origin: string): Promise<void> {
  const { reauthConstants, popupWindowName } = getAuthRuntime();
  return new Promise((resolve, reject) => {
    const popupUrl = `${origin}/login-popup`;
    const w = window.open(popupUrl, popupWindowName, POPUP_FEATURES);

    if (!w) {
      reject(
        new Error(
          "El navegador bloqueó la ventana emergente. Permite ventanas para este sitio e intenta de nuevo.",
        ),
      );
      return;
    }

    let settled = false;
    const started = Date.now();

    const cleanup = () => {
      window.removeEventListener("message", onMessage);
      clearInterval(closedPoll);
      clearTimeout(timeoutId);
    };

    const finishError = (err: Error) => {
      if (settled) return;
      settled = true;
      cleanup();
      try {
        if (!w.closed) w.close();
      } catch {
        /* ignore */
      }
      reject(err);
    };

    const finishOk = () => {
      if (settled) return;
      settled = true;
      cleanup();
      resolve();
    };

    const onMessage = (ev: MessageEvent) => {
      if (ev.origin !== origin) return;
      const d = ev.data as { type?: string; error?: string } | undefined;
      if (d?.type === reauthConstants.ZAURU_REAUTH_MESSAGE_TYPE) {
        finishOk();
      }
      if (d?.type === reauthConstants.ZAURU_REAUTH_FAILURE_TYPE) {
        finishError(new Error(d.error ?? "No se pudo renovar la sesión."));
      }
    };

    window.addEventListener("message", onMessage);

    const closedPoll = setInterval(() => {
      if (Date.now() - started > REAUTH_TIMEOUT_MS) {
        finishError(
          new Error("Tiempo de espera del inicio de sesión agotado."),
        );
        return;
      }
      if (w.closed) {
        finishError(new Error("Inicio de sesión cancelado."));
      }
    }, CLOSED_POLL_MS);

    const timeoutId = setTimeout(() => {
      finishError(new Error("Tiempo de espera del inicio de sesión agotado."));
    }, REAUTH_TIMEOUT_MS);
  });
}

/**
 * Open the OAuth popup and resolve once the session cookie has been refreshed.
 * Concurrent callers share a single in-flight promise.
 */
export function requestReauthInPopup(): Promise<void> {
  if (typeof window === "undefined") {
    return Promise.reject(
      new Error("Reauth solo disponible en el navegador."),
    );
  }

  if (reauthPromise) {
    return reauthPromise;
  }

  const origin = window.location.origin;

  toast.message("Sesión expirada", {
    description:
      "Completa el inicio de sesión en la ventana emergente para continuar.",
    duration: 12_000,
  });

  reauthPromise = waitForReauthPopup(origin).finally(() => {
    reauthPromise = null;
  });

  return reauthPromise;
}
