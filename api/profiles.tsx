import { ProfilesRoute, createProfilesLoader } from "@zauru-sdk/utils";

/** Optional per-route stub. Prefer `api/$.tsx` + `createZauruApiLoader`. */
export const loader = createProfilesLoader();

export default ProfilesRoute;
