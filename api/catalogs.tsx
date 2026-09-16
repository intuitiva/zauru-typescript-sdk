import { CatalogsRoute, createCatalogsLoader } from "@zauru-sdk/utils";

/**
 * Shared catalog loader. Extra keys override or add catalogs for this webapp.
 *
 * @example
 * export const loader = createCatalogsLoader({
 *   programaciones4pinos: async ({ headers, session, url }) => { ... },
 * });
 */
export const loader = createCatalogsLoader();

export default CatalogsRoute;
