/**
 * OAuth webapps use the authorize `code` as Bearer against `/api/userinfo`.
 * Cirio returns 401 when that code is missing from Redis (expired, reused
 * URL with `?code=`, or never issued). Nested `handlePossibleAxiosErrors`
 * wraps the message; match status + path, not the exact prefix.
 */
export declare function isOauthUserinfoUnauthorizedError(message?: string | null): boolean;
