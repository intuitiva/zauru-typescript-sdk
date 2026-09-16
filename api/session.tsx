import { SessionRoute, createSessionLoader } from "@zauru-sdk/utils";

/** Optional per-route stub. Prefer `api/$.tsx` + `createZauruApiLoader`. */
export const loader = createSessionLoader();

export default SessionRoute;
