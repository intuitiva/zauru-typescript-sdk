import { createZauruApiLoader, ZauruApiRoute } from "@zauru-sdk/utils";

/**
 * Splat for /api/catalogs, /api/profiles, /api/session and /api/templates.
 * Extra keys under a resource override or add handlers for this webapp.
 *
 * @example
 * export const loader = createZauruApiLoader({
 *   catalogs: {
 *     programaciones4pinos: async ({ headers, session, url }) => { ... },
 *   },
 * });
 */
export const loader = createZauruApiLoader();

export default ZauruApiRoute;
