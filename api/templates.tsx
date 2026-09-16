import { TemplatesRoute, createTemplatesLoader } from "@zauru-sdk/utils";

/** Optional per-route stub. Prefer `api/$.tsx` + `createZauruApiLoader`. */
export const loader = createTemplatesLoader();

export default TemplatesRoute;
