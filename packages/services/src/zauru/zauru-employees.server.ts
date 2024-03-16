import type { Session } from "@remix-run/node";
import { handlePossibleAxiosErrors } from "@zauru-sdk/common";
import { AxiosUtilsResponse, EmployeeGraphQL } from "@zauru-sdk/types";
import { getGraphQLAPIHeaders } from "~/common.server.js";
import httpGraphQLAPI from "./httpGraphQL.server.js";
import { getEmployeesByAgencyIdStringQuery } from "@zauru-sdk/graphql";

/**
 * getEmployeesByAgencyId
 */
export async function getEmployeesByAgencyId(
  session: Session,
  id: number | string
): Promise<AxiosUtilsResponse<EmployeeGraphQL[]>> {
  return handlePossibleAxiosErrors(async () => {
    const headers = await getGraphQLAPIHeaders(session);

    const response = await httpGraphQLAPI.post<{
      data: { employees: EmployeeGraphQL[] };
      errors?: {
        message: string;
        extensions: { path: string; code: string };
      }[];
    }>(
      "",
      {
        query: getEmployeesByAgencyIdStringQuery,
        variables: {
          id,
        },
      },
      { headers }
    );

    if (response.data.errors) {
      throw new Error(response.data.errors.map((x) => x.message).join(";"));
    }

    const registers = response?.data?.data?.employees;

    return registers;
  });
}
