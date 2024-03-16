import type { Session } from "@remix-run/node";
import type { AxiosUtilsResponse } from "./httpZauru.server.js";
import type { AgencyGraphQL } from "@zauru-sdk/types";
/**
 * getAgencies
 * @param headers
 * @returns
 */
export declare function getAgencies(session: Session): Promise<AxiosUtilsResponse<AgencyGraphQL[]>>;
