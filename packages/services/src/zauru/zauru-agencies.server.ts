import type { Session } from "@remix-run/node";
import type { AgencyGraphQL } from "@zauru-sdk/graphql";
import type { AxiosUtilsResponse } from "./httpZauru.server.js";
import { handlePossibleAxiosErrors } from "./httpZauru.server.js";
import httpGraphQLAPI from "./httpGraphQL.server.js";
import { getGraphQLAPIHeaders } from "~/common.server.js";
import graphql from "@zauru-sdk/graphql";

const { default: queries } = graphql;

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
