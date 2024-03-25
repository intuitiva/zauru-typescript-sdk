import type { Session } from "@remix-run/node";
import { handlePossibleAxiosErrors } from "@zauru-sdk/common";
import { AxiosUtilsResponse, CaseGraphQL } from "@zauru-sdk/types";
import { getGraphQLAPIHeaders } from "../common.server.js";
import httpGraphQLAPI from "./httpGraphQL.server.js";
import { getCasesByResponsibleIdStringQuery } from "@zauru-sdk/graphql";

/**
 * getCasesByResponsibleId
 */
export async function getCasesByResponsibleId(
  session: Session,
  responsible_id: string,
  wheres: string[] = []
): Promise<AxiosUtilsResponse<CaseGraphQL[]>> {
  return handlePossibleAxiosErrors(async () => {
    const headers = await getGraphQLAPIHeaders(session);

    const response = await httpGraphQLAPI.post<{
      data: { cases: CaseGraphQL[] };
      errors?: {
        message: string;
        extensions: { path: string; code: string };
      }[];
    }>(
      "",
      {
        query: getCasesByResponsibleIdStringQuery(wheres),
        variables: {
          responsible_id,
        },
      },
      { headers }
    );

    if (response.data.errors) {
      throw new Error(response.data.errors.map((x) => x.message).join(";"));
    }

    const registers = response?.data?.data?.cases;

    return registers;
  });
}
