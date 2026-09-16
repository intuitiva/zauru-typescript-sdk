import { CatalogsRoute, createCatalogsLoader } from "@zauru-sdk/utils";

/** Optional per-route stub. Prefer `api/$.tsx` + `createZauruApiLoader`. */
export const loader = createCatalogsLoader();

export default CatalogsRoute;
