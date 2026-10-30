"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isZauruSessionReauthPayload = exports.createZauruSessionReauthPayload = exports.hasZauruOauthReauthCookie = exports.isZauruSessionExpiredError = exports.ZAURU_OAUTH_REAUTH_COOKIE = exports.ZAURU_SESSION_REAUTH_URL = void 0;
exports.ZAURU_SESSION_REAUTH_URL = "/logout?reauth=1";
exports.ZAURU_OAUTH_REAUTH_COOKIE = "zauru_oauth_reauth";
const errorText = (value) => {
    if (value instanceof Error)
        return value.message;
    if (typeof value === "string")
        return value;
    if (value == null)
        return "";
    try {
        return JSON.stringify(value);
    }
    catch {
        return String(value);
    }
};
const hasUnauthorizedStatus = (value) => {
    if (!value || typeof value !== "object" || !("status" in value)) {
        return false;
    }
    return Number(value.status) === 401;
};
/**
 * Detects the HTTP 401 response Zauru emits when the API token stored in the
 * Remix session expires. It accepts direct Response-like values and nested
 * messages produced by handlePossibleAxiosErrors.
 */
const isZauruSessionExpiredError = (...values) => {
    for (const value of values) {
        if (hasUnauthorizedStatus(value))
            return true;
        const text = errorText(value);
        const isUnauthorized = /HTTP\s*401/i.test(text) ||
            /status(?:\s+code)?[\s:=]+401/i.test(text) ||
            /401\s+Unauthorized/i.test(text);
        const isFromZauru = /zauru/i.test(text) ||
            /\/apps\/webapp_tables\//i.test(text) ||
            /your session expired/i.test(text);
        if (isUnauthorized && isFromZauru)
            return true;
    }
    return false;
};
exports.isZauruSessionExpiredError = isZauruSessionExpiredError;
const hasZauruOauthReauthCookie = (cookieHeader) => (cookieHeader ?? "")
    .split(";")
    .some((part) => part.trim() === `${exports.ZAURU_OAUTH_REAUTH_COOKIE}=1`);
exports.hasZauruOauthReauthCookie = hasZauruOauthReauthCookie;
const createZauruSessionReauthPayload = (overrides = {}) => ({
    error: true,
    reauthRequired: true,
    reauthUrl: overrides.reauthUrl ?? exports.ZAURU_SESSION_REAUTH_URL,
    title: overrides.title ?? "La sesión venció",
    type: overrides.type ?? "info",
    description: overrides.description ??
        "Inicie sesión nuevamente para continuar con la operación.",
});
exports.createZauruSessionReauthPayload = createZauruSessionReauthPayload;
const isZauruSessionReauthPayload = (value) => Boolean(value &&
    typeof value === "object" &&
    value.reauthRequired === true);
exports.isZauruSessionReauthPayload = isZauruSessionReauthPayload;
