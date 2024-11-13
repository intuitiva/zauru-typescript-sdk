import type { Session } from "@remix-run/node";
import { handlePossibleAxiosErrors } from "@zauru-sdk/common";
import { AxiosUtilsResponse, EmployeeGraphQL } from "@zauru-sdk/types";
import { getGraphQLAPIHeaders } from "../common.js";
import { httpGraphQLAPI } from "./httpGraphQL.js";
import {
  getEmployeesByAgencyIdStringQuery,
  getEmployeesStringQuery,
} from "@zauru-sdk/graphql";

export async function getEmployees(
  session: Session
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
        query: getEmployeesStringQuery,
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
        query: getEmployeesByAgencyIdStringQuery(Number(id)),
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
