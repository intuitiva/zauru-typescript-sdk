import type { Session } from "@remix-run/node";
import { handlePossibleAxiosErrors } from "@zauru-sdk/common";
import {
  createWebAppTableRegister,
  getVariablesByName,
  getWebAppTableRegisters,
  updateWebAppTableRegister,
} from "@zauru-sdk/services";
import {
  AxiosUtilsResponse,
  WebAppRowGraphQL,
  DischargeHistory,
  WebAppTableUpdateResponse,
} from "@zauru-sdk/types";

/**
 * Get getDischargeHistories from the web app table.
 * @param headers Request headers.
 * @param session Session object.
 * @returns A Promise of AxiosUtilsResponse<DischargeHistory[]>.
 */
export const getDischargeHistories = (
  headers: any,
  session: Session
): Promise<AxiosUtilsResponse<WebAppRowGraphQL<DischargeHistory>[]>> => {
  return handlePossibleAxiosErrors(async () => {
    const { discharge_history_web_app_table_id } = await getVariablesByName(
      headers,
      session,
      ["discharge_history_web_app_table_id"]
    );

    const response = await getWebAppTableRegisters<DischargeHistory>(
      session,
      discharge_history_web_app_table_id
    );

    if (response.error) {
      throw new Error(
        `Ocurrió un error al consultar el historial de discharges: ${response.userMsg}`
      );
    }

    const history = response?.data ?? [];

    return history;
  });
};

/**
 * Create a template in the web app table.
 * @param headers Request headers.
 * @param session Session object.
 * @param body DischargeHistory data to be created.
 * @returns A Promise of AxiosUtilsResponse<DischargeHistory>.
 */
export const createDischargeHistory = (
  headers: any,
  session: Session,
  body: DischargeHistory
): Promise<AxiosUtilsResponse<WebAppTableUpdateResponse>> => {
  return handlePossibleAxiosErrors(async () => {
    const { discharge_history_web_app_table_id } = await getVariablesByName(
      headers,
      session,
      ["discharge_history_web_app_table_id"]
    );
    const response = await createWebAppTableRegister<DischargeHistory>(
      headers,
      discharge_history_web_app_table_id,
      body
    );
    return response;
  });
};

/**
 * Put updateDischargeHistory from the web app table.
 * @param headers Request headers.
 * @param session Session object.
 * @returns A Promise of AxiosUtilsResponse<DischargeHistory[]>.
 */
export const updateDischargeHistory = (
  headers: any,
  session: Session,
  body: DischargeHistory,
  id_registro: string | number
): Promise<AxiosUtilsResponse<WebAppTableUpdateResponse>> => {
  return handlePossibleAxiosErrors(async () => {
    const { discharge_history_web_app_table_id } = await getVariablesByName(
      headers,
      session,
      ["discharge_history_web_app_table_id"]
    );

    const response = await updateWebAppTableRegister<DischargeHistory>(
      headers,
      discharge_history_web_app_table_id,
      id_registro,
      { ...body }
    );

    return response;
  });
};
