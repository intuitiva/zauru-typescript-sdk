import type { Session } from "@remix-run/node";
import { handlePossibleAxiosErrors } from "@zauru-sdk/common";
import { httpGraphQLAPI } from "./httpGraphQL.js";
import { getAgenciesStringQuery } from "@zauru-sdk/graphql";
import type { AgencyGraphQL, AxiosUtilsResponse } from "@zauru-sdk/types";
import { getGraphQLAPIHeaders } from "../common.js";

/**
 * getAgencies
 * @param headers
 * @returns
 */
export async function getAgencies(
  session: Session
): Promise<AxiosUtilsResponse<AgencyGraphQL[]>> {
  return handlePossibleAxiosErrors(async () => {
    const headers = await getGraphQLAPIHeaders(session);
    const response = await httpGraphQLAPI.post<{
      data: { agencies: AgencyGraphQL[] };
    }>(
      ``,
      {
        query: getAgenciesStringQuery,
      },
      {
        headers,
      }
    );

    return response.data?.data.agencies;
  });
}
