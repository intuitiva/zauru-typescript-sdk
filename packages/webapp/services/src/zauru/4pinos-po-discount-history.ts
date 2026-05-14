import type { Session } from "@remix-run/node";
import { handlePossibleAxiosErrors } from "@zauru-sdk/common";
import {
  AxiosUtilsResponse,
  PoDiscountHistory,
  WebAppRowGraphQL,
  WebAppTableUpdateResponse,
} from "@zauru-sdk/types";
import { getVariablesByName } from "../common.js";
import {
  createWebAppTableRegister,
  deleteWebAppTableRegister,
  getWebAppTableRegisters,
  updateWebAppTableRegister,
} from "./zauru-web-app-tables.js";

export async function get4pinosPoDiscountHistory(
  headers: any,
  session: Session
): Promise<AxiosUtilsResponse<WebAppRowGraphQL<PoDiscountHistory>[]>> {
  return handlePossibleAxiosErrors(async () => {
    const { historial_porcentajes_de_rechazo_webapp_table_id } =
      await getVariablesByName(headers, session, [
        "historial_porcentajes_de_rechazo_webapp_table_id",
      ]);

    const response = await getWebAppTableRegisters<PoDiscountHistory>(
      session,
      historial_porcentajes_de_rechazo_webapp_table_id
    );

    if (response.error || !response.data) {
      throw new Error(response.userMsg);
    }

    return response?.data;
  });
}

export async function delete4pinosPoDiscountHistory(
  headers: any,
  session: Session,
  id: number
): Promise<AxiosUtilsResponse<WebAppTableUpdateResponse>> {
  return handlePossibleAxiosErrors(async () => {
    const { historial_porcentajes_de_rechazo_webapp_table_id } =
      await getVariablesByName(headers, session, [
        "historial_porcentajes_de_rechazo_webapp_table_id",
      ]);

    const response = await deleteWebAppTableRegister(
      headers,
      historial_porcentajes_de_rechazo_webapp_table_id,
      id
    );

    return response;
  });
}

export async function create4pinosPoDiscountHistory(
  headers: any,
  session: Session,
  body: PoDiscountHistory
): Promise<AxiosUtilsResponse<WebAppTableUpdateResponse>> {
  return handlePossibleAxiosErrors(async () => {
    const { historial_porcentajes_de_rechazo_webapp_table_id } =
      await getVariablesByName(headers, session, [
        "historial_porcentajes_de_rechazo_webapp_table_id",
      ]);
    const response = await createWebAppTableRegister<PoDiscountHistory>(
      headers,
      historial_porcentajes_de_rechazo_webapp_table_id,
      body,
      { temp_purchase_order_id: `${body.purchase_order_id}` }
    );
    return response;
  });
}

export async function update4pinosPoDiscountHistory(
  headers: any,
  session: Session,
  id: number,
  body: PoDiscountHistory
): Promise<AxiosUtilsResponse<WebAppTableUpdateResponse>> {
  return handlePossibleAxiosErrors(async () => {
    const { historial_porcentajes_de_rechazo_webapp_table_id } =
      await getVariablesByName(headers, session, [
        "historial_porcentajes_de_rechazo_webapp_table_id",
      ]);
    const response = await updateWebAppTableRegister(
      headers,
      historial_porcentajes_de_rechazo_webapp_table_id,
      id,
      body
    );
    return response;
  });
}
