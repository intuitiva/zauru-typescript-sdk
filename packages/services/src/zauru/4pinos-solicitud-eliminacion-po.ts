import type { Session } from "@remix-run/node";
import { handlePossibleAxiosErrors } from "@zauru-sdk/common";
import {
  AxiosUtilsResponse,
  SolicitudEliminacionPO,
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

export async function get4pinosSolicitudEliminacionPO(
  headers: any,
  session: Session
): Promise<AxiosUtilsResponse<WebAppRowGraphQL<SolicitudEliminacionPO>[]>> {
  return handlePossibleAxiosErrors(async () => {
    const { solicitud_eliminacion_po_webapp_table_id } =
      await getVariablesByName(headers, session, [
        "solicitud_eliminacion_po_webapp_table_id",
      ]);

    const response = await getWebAppTableRegisters<SolicitudEliminacionPO>(
      session,
      solicitud_eliminacion_po_webapp_table_id
    );

    if (response.error || !response.data) {
      throw new Error(response.userMsg);
    }

    return response?.data;
  });
}

export async function delete4pinosSolicitudEliminacionPO(
  headers: any,
  session: Session,
  id: number
): Promise<AxiosUtilsResponse<WebAppTableUpdateResponse>> {
  return handlePossibleAxiosErrors(async () => {
    const { solicitud_eliminacion_po_webapp_table_id } =
      await getVariablesByName(headers, session, [
        "solicitud_eliminacion_po_webapp_table_id",
      ]);

    const response = await deleteWebAppTableRegister(
      headers,
      solicitud_eliminacion_po_webapp_table_id,
      id
    );

    return response;
  });
}

export async function create4pinosSolicitudEliminacionPO(
  headers: any,
  session: Session,
  body: SolicitudEliminacionPO
): Promise<AxiosUtilsResponse<WebAppTableUpdateResponse>> {
  return handlePossibleAxiosErrors(async () => {
    const { solicitud_eliminacion_po_webapp_table_id } =
      await getVariablesByName(headers, session, [
        "solicitud_eliminacion_po_webapp_table_id",
      ]);
    const response = await createWebAppTableRegister<SolicitudEliminacionPO>(
      headers,
      solicitud_eliminacion_po_webapp_table_id,
      body
    );
    return response;
  });
}

export async function update4pinosSolicitudEliminacionPO(
  headers: any,
  session: Session,
  id: number,
  body: SolicitudEliminacionPO
): Promise<AxiosUtilsResponse<WebAppTableUpdateResponse>> {
  return handlePossibleAxiosErrors(async () => {
    const { solicitud_eliminacion_po_webapp_table_id } =
      await getVariablesByName(headers, session, [
        "solicitud_eliminacion_po_webapp_table_id",
      ]);
    const response = await updateWebAppTableRegister(
      headers,
      solicitud_eliminacion_po_webapp_table_id,
      id,
      body
    );
    return response;
  });
}
