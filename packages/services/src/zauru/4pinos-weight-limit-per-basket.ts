import type { Session } from "@remix-run/node";
import { handlePossibleAxiosErrors } from "@zauru-sdk/common";
import {
  AxiosUtilsResponse,
  PesoMaximoPorCanasta,
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

export async function get4pinosWeightLimitPerBasket(
  headers: any,
  session: Session
): Promise<AxiosUtilsResponse<WebAppRowGraphQL<PesoMaximoPorCanasta>[]>> {
  return handlePossibleAxiosErrors(async () => {
    const { peso_maximo_por_canasta_webapp_table_id } =
      await getVariablesByName(headers, session, [
        "peso_maximo_por_canasta_webapp_table_id",
      ]);

    const response = await getWebAppTableRegisters<PesoMaximoPorCanasta>(
      session,
      peso_maximo_por_canasta_webapp_table_id
    );

    if (response.error || !response.data) {
      throw new Error(response.userMsg);
    }

    return response?.data;
  });
}

export async function delete4pinosWeightLimitPerBasket(
  headers: any,
  session: Session,
  id: number
): Promise<AxiosUtilsResponse<WebAppTableUpdateResponse>> {
  return handlePossibleAxiosErrors(async () => {
    const { peso_maximo_por_canasta_webapp_table_id } =
      await getVariablesByName(headers, session, [
        "peso_maximo_por_canasta_webapp_table_id",
      ]);

    const response = await deleteWebAppTableRegister(
      headers,
      peso_maximo_por_canasta_webapp_table_id,
      id
    );

    return response;
  });
}

export async function create4pinosWeightLimitPerBasket(
  headers: any,
  session: Session,
  body: PesoMaximoPorCanasta & { purchase_order_id: number }
): Promise<AxiosUtilsResponse<WebAppTableUpdateResponse>> {
  return handlePossibleAxiosErrors(async () => {
    const { peso_maximo_por_canasta_webapp_table_id } =
      await getVariablesByName(headers, session, [
        "peso_maximo_por_canasta_webapp_table_id",
      ]);
    const response = await createWebAppTableRegister<PesoMaximoPorCanasta>(
      headers,
      peso_maximo_por_canasta_webapp_table_id,
      body,
      { temp_purchase_order_id: `${body.purchase_order_id}` }
    );
    return response;
  });
}

export async function update4pinosWeightLimitPerBasket(
  headers: any,
  session: Session,
  id: number,
  body: Partial<PesoMaximoPorCanasta>
): Promise<AxiosUtilsResponse<WebAppTableUpdateResponse>> {
  return handlePossibleAxiosErrors(async () => {
    const { peso_maximo_por_canasta_webapp_table_id } =
      await getVariablesByName(headers, session, [
        "peso_maximo_por_canasta_webapp_table_id",
      ]);
    const response = await updateWebAppTableRegister(
      headers,
      peso_maximo_por_canasta_webapp_table_id,
      id,
      body
    );
    return response;
  });
}
