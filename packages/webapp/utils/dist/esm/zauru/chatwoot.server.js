/**
 * Server-only Chatwoot identity helpers.
 *
 * Import from `@zauru-sdk/utils/chatwoot.server` (not the main barrel) so
 * Node crypto stays out of the client bundle.
 *
 * HMAC token: Chatwoot → Inboxes → Configuration → Identity Validation.
 * Never expose it as `VITE_*` or in the website widget snippet.
 */
import { createHmac } from "node:crypto";
export function createChatwootIdentifierHash(identifier, hmacToken) {
    return createHmac("sha256", hmacToken).update(identifier).digest("hex");
}
