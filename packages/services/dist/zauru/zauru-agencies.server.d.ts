import type { Session } from "@remix-run/node";
import type { AgencyGraphQL } from "@zauru-sdk/graphql";
import type { AxiosUtilsResponse } from "./httpZauru.server.js";
/**
 * getAgencies
 * @param headers
 * @returns
 */
export declare function getAgencies(session: Session): Promise<AxiosUtilsResponse<AgencyGraphQL[]>>;
