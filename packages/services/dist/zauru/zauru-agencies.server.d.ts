import type { Session } from "@remix-run/node";
import type { AgencyGraphQL, AxiosUtilsResponse } from "@zauru-sdk/types";
/**
 * getAgencies
 * @param headers
 * @returns
 */
export declare function getAgencies(session: Session): Promise<AxiosUtilsResponse<AgencyGraphQL[]>>;
