export declare const ZAURU_SESSION_REAUTH_URL = "/logout?reauth=1";
export declare const ZAURU_OAUTH_REAUTH_COOKIE = "zauru_oauth_reauth";
export type ZauruSessionReauthPayload = {
    error: true;
    reauthRequired: true;
    reauthUrl: string;
    title: string;
    type: "info";
    description: string;
};
type ZauruSessionReauthPayloadOverrides = Partial<Pick<ZauruSessionReauthPayload, "reauthUrl" | "title" | "type" | "description">>;
/**
 * Detects the HTTP 401 response Zauru emits when the API token stored in the
 * Remix session expires. It accepts direct Response-like values and nested
 * messages produced by handlePossibleAxiosErrors.
 */
export declare const isZauruSessionExpiredError: (...values: unknown[]) => boolean;
export declare const hasZauruOauthReauthCookie: (cookieHeader?: string | null) => boolean;
export declare const createZauruSessionReauthPayload: (overrides?: ZauruSessionReauthPayloadOverrides) => ZauruSessionReauthPayload;
export declare const isZauruSessionReauthPayload: (value: unknown) => value is ZauruSessionReauthPayload;
export {};
