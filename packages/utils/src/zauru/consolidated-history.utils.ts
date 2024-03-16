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
  ConsolidatedHistory,
  WebAppTableUpdateResponse,
} from "@zauru-sdk/types";

/**
 * Get getConsolidatedHistories from the web app table.
 * @param headers Request headers.
 * @param session Session object.
 * @returns A Promise of AxiosUtilsResponse<ConsolidatedHistory[]>.
 */
export async function getConsolidatedHistories(
  headers: any,
  session: Session
): Promise<AxiosUtilsResponse<WebAppRowGraphQL<ConsolidatedHistory>[]>> {
  return handlePossibleAxiosErrors(async () => {
    const { purchase_order_consolidates_web_app_table_id } =
      await getVariablesByName(headers, session, [
        "purchase_order_consolidates_web_app_table_id",
      ]);

    const response = await getWebAppTableRegisters<ConsolidatedHistory>(
      session,
      purchase_order_consolidates_web_app_table_id
    );

    if (response.error) {
      throw new Error(
        `Ocurrió un error al consultar el historial de consolidados: ${response.userMsg}`
      );
    }

    const history = response?.data ?? [];

    return history;
  });
}

/**
 * Create a template in the web app table.
 * @param headers Request headers.
 * @param session Session object.
 * @param body ConsolidatedHistory data to be created.
 * @returns A Promise of AxiosUtilsResponse<ConsolidatedHistory>.
 */
export async function createConsolidatedHistory(
  headers: any,
  session: Session,
  body: ConsolidatedHistory
): Promise<AxiosUtilsResponse<WebAppTableUpdateResponse>> {
  return handlePossibleAxiosErrors(async () => {
    const { purchase_order_consolidates_web_app_table_id } =
      await getVariablesByName(headers, session, [
        "purchase_order_consolidates_web_app_table_id",
      ]);
    const response = await createWebAppTableRegister<ConsolidatedHistory>(
      headers,
      purchase_order_consolidates_web_app_table_id,
      body
    );
    return response;
  });
}

/**
 * Put updateConsolidatedHistory from the web app table.
 * @param headers Request headers.
 * @param session Session object.
 * @returns A Promise of AxiosUtilsResponse<ConsolidatedHistory[]>.
 */
export async function updateConsolidatedHistory(
  headers: any,
  session: Session,
  body: ConsolidatedHistory,
  id_registro: string | number
): Promise<AxiosUtilsResponse<WebAppTableUpdateResponse>> {
  return handlePossibleAxiosErrors(async () => {
    const { purchase_order_consolidates_web_app_table_id } =
      await getVariablesByName(headers, session, [
        "purchase_order_consolidates_web_app_table_id",
      ]);

    const response = await updateWebAppTableRegister<ConsolidatedHistory>(
      headers,
      purchase_order_consolidates_web_app_table_id,
      id_registro,
      { ...body }
    );

    return response;
  });
}
