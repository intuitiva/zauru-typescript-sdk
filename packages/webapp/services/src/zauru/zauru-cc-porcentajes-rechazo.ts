import type { Session } from "@remix-run/node";
import { handlePossibleAxiosErrors } from "@zauru-sdk/common";
import {
  AxiosUtilsResponse,
  CCPorcentajeRechazo,
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

export async function getCCPorcentajesDeRechazo(
  headers: any,
  session: Session
): Promise<AxiosUtilsResponse<WebAppRowGraphQL<CCPorcentajeRechazo>[]>> {
  return handlePossibleAxiosErrors(async () => {
    const { cc_porcentajes_rechazo_en_planta } = await getVariablesByName(
      headers,
      session,
      ["cc_porcentajes_rechazo_en_planta"]
    );

    const response = await getWebAppTableRegisters<CCPorcentajeRechazo>(
      session,
      cc_porcentajes_rechazo_en_planta
    );

    if (response.error || !response.data) {
      throw new Error(response.userMsg);
    }

    return response?.data;
  });
}

export async function deleteCCPorcentajesDeRechazo(
  headers: any,
  session: Session,
  id: number
): Promise<AxiosUtilsResponse<WebAppTableUpdateResponse>> {
  return handlePossibleAxiosErrors(async () => {
    const { cc_porcentajes_rechazo_en_planta } = await getVariablesByName(
      headers,
      session,
      ["cc_porcentajes_rechazo_en_planta"]
    );

    const response = await deleteWebAppTableRegister(
      headers,
      cc_porcentajes_rechazo_en_planta,
      id
    );

    return response;
  });
}

export async function createCCPorcentajesDeRechazo(
  headers: any,
  session: Session,
  body: CCPorcentajeRechazo
): Promise<AxiosUtilsResponse<WebAppTableUpdateResponse>> {
  return handlePossibleAxiosErrors(async () => {
    const { cc_porcentajes_rechazo_en_planta } = await getVariablesByName(
      headers,
      session,
      ["cc_porcentajes_rechazo_en_planta"]
    );
    const response = await createWebAppTableRegister<CCPorcentajeRechazo>(
      headers,
      cc_porcentajes_rechazo_en_planta,
      body
    );
    return response;
  });
}

export async function updateCCPorcentajesDeRechazo(
  headers: any,
  session: Session,
  id: number,
  body: CCPorcentajeRechazo
): Promise<AxiosUtilsResponse<WebAppTableUpdateResponse>> {
  return handlePossibleAxiosErrors(async () => {
    const { cc_porcentajes_rechazo_en_planta } = await getVariablesByName(
      headers,
      session,
      ["cc_porcentajes_rechazo_en_planta"]
    );
    const response = await updateWebAppTableRegister(
      headers,
      cc_porcentajes_rechazo_en_planta,
      id,
      body
    );
    return response;
  });
}
