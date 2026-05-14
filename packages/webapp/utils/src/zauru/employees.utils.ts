import type { Session } from "@remix-run/node";
import { handlePossibleAxiosErrors } from "@zauru-sdk/common";
import {
  getEmployeesByAgencyId,
  getVariablesByName,
} from "@zauru-sdk/services";
import { AxiosUtilsResponse, EmployeeGraphQL } from "@zauru-sdk/types";

/**
 *
 * @param headers
 * @param session
 * @returns
 */
export const getEmployeesByLabAgency = async (
  headers: any,
  session: Session
): Promise<AxiosUtilsResponse<EmployeeGraphQL[]>> => {
  return handlePossibleAxiosErrors(async () => {
    const { lab_agency_id } = await getVariablesByName(headers, session, [
      "lab_agency_id",
    ]);

    const response = await getEmployeesByAgencyId(session, lab_agency_id);

    if (response.error) {
      const msg = `Ocurrió un error al consultar los empleados por agencia de laboratorio: ${response.userMsg}`;
      console.error(msg);
      throw new Error(msg);
    }

    return response?.data ?? [];
  });
};

/**
 *
 * @param headers
 * @param session
 * @returns
 */
export const getEmployeesByCurrentAgency = async (
  session: Session
): Promise<AxiosUtilsResponse<EmployeeGraphQL[]>> => {
  return handlePossibleAxiosErrors(async () => {
    const response = await getEmployeesByAgencyId(
      session,
      session.get("agency_id")
    );

    if (response.error) {
      const msg = `Ocurrió un error al consultar los empleados por la agencia actual: ${response.userMsg}`;
      console.error(msg);
      throw new Error(msg);
    }

    return response?.data ?? [];
  });
};
