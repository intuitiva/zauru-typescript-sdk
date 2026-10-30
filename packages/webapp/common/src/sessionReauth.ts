export const ZAURU_SESSION_REAUTH_URL = "/logout?reauth=1";
export const ZAURU_OAUTH_REAUTH_COOKIE = "zauru_oauth_reauth";

export type ZauruSessionReauthPayload = {
  error: true;
  reauthRequired: true;
  reauthUrl: string;
  title: string;
  type: "info";
  description: string;
};

type ZauruSessionReauthPayloadOverrides = Partial<
  Pick<
    ZauruSessionReauthPayload,
    "reauthUrl" | "title" | "type" | "description"
  >
>;

const errorText = (value: unknown): string => {
  if (value instanceof Error) return value.message;
  if (typeof value === "string") return value;
  if (value == null) return "";

  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
};

const hasUnauthorizedStatus = (value: unknown): boolean => {
  if (!value || typeof value !== "object" || !("status" in value)) {
    return false;
  }

  return Number((value as { status?: unknown }).status) === 401;
};

/**
 * Detects the HTTP 401 response Zauru emits when the API token stored in the
 * Remix session expires. It accepts direct Response-like values and nested
 * messages produced by handlePossibleAxiosErrors.
 */
export const isZauruSessionExpiredError = (...values: unknown[]): boolean => {
  for (const value of values) {
    if (hasUnauthorizedStatus(value)) return true;

    const text = errorText(value);
    const isUnauthorized =
      /HTTP\s*401/i.test(text) ||
      /status(?:\s+code)?[\s:=]+401/i.test(text) ||
      /401\s+Unauthorized/i.test(text);
    const isFromZauru =
      /zauru/i.test(text) ||
      /\/apps\/webapp_tables\//i.test(text) ||
      /your session expired/i.test(text);

    if (isUnauthorized && isFromZauru) return true;
  }

  return false;
};

export const hasZauruOauthReauthCookie = (
  cookieHeader?: string | null,
): boolean =>
  (cookieHeader ?? "")
    .split(";")
    .some(
      (part) =>
        part.trim() === `${ZAURU_OAUTH_REAUTH_COOKIE}=1`,
    );

export const createZauruSessionReauthPayload = (
  overrides: ZauruSessionReauthPayloadOverrides = {},
): ZauruSessionReauthPayload => ({
  error: true,
  reauthRequired: true,
  reauthUrl: overrides.reauthUrl ?? ZAURU_SESSION_REAUTH_URL,
  title: overrides.title ?? "La sesión venció",
  type: overrides.type ?? "info",
  description:
    overrides.description ??
    "Inicie sesión nuevamente para continuar con la operación.",
});

export const isZauruSessionReauthPayload = (
  value: unknown,
): value is ZauruSessionReauthPayload =>
  Boolean(
    value &&
      typeof value === "object" &&
      (value as { reauthRequired?: unknown }).reauthRequired === true,
  );
