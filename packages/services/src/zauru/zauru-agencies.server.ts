import type { Session } from "@remix-run/node";
import type { AgencyGraphQL } from "@zauru-sdk/graphql";
import queries from "@zauru-sdk/graphql";
import { getGraphQLAPIHeaders } from "@zauru-sdk/utils";
import type { AxiosUtilsResponse } from "./httpZauru.server";
import { handlePossibleAxiosErrors } from "./httpZauru.server";
import httpGraphQLAPI from "./httpGraphQL.server";

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
        query: queries.getAgencies,
      },
      {
        headers,
      }
    );

    return response.data?.data.agencies;
  });
}
