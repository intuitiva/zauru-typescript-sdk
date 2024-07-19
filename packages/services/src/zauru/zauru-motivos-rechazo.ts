import type { Session } from "@remix-run/node";
import { handlePossibleAxiosErrors } from "@zauru-sdk/common";
import {
  AxiosUtilsResponse,
  MotivoRechazo,
  RegisterMotivosRechazoBody,
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

export async function getMotivosRechazo(
  headers: any,
  session: Session
): Promise<AxiosUtilsResponse<WebAppRowGraphQL<MotivoRechazo>[]>> {
  return handlePossibleAxiosErrors(async () => {
    const { recepciones_rejection_types_webapp_table_id } =
      await getVariablesByName(headers, session, [
        "recepciones_rejection_types_webapp_table_id",
      ]);

    const response = await getWebAppTableRegisters<MotivoRechazo>(
      session,
      recepciones_rejection_types_webapp_table_id
    );

    if (response.error || !response.data) {
      throw new Error(response.userMsg);
    }

    return response?.data;
  });
}

export async function deleteMotivosRechazo(
  headers: any,
  session: Session,
  id: number
): Promise<AxiosUtilsResponse<WebAppTableUpdateResponse>> {
  return handlePossibleAxiosErrors(async () => {
    const { recepciones_rejection_types_webapp_table_id } =
      await getVariablesByName(headers, session, [
        "recepciones_rejection_types_webapp_table_id",
      ]);

    const response = await deleteWebAppTableRegister(
      headers,
      recepciones_rejection_types_webapp_table_id,
      id
    );

    return response;
  });
}

export async function createMotivoRechazo(
  headers: any,
  session: Session,
  body: MotivoRechazo
): Promise<AxiosUtilsResponse<WebAppTableUpdateResponse>> {
  return handlePossibleAxiosErrors(async () => {
    const { recepciones_rejection_types_webapp_table_id } =
      await getVariablesByName(headers, session, [
        "recepciones_rejection_types_webapp_table_id",
      ]);
    const response = await createWebAppTableRegister<MotivoRechazo>(
      headers,
      recepciones_rejection_types_webapp_table_id,
      body
    );
    return response;
  });
}

export async function updateMotivosRechazo(
  headers: any,
  session: Session,
  id: number,
  Name: string
): Promise<AxiosUtilsResponse<WebAppTableUpdateResponse>> {
  return handlePossibleAxiosErrors(async () => {
    const { recepciones_rejection_types_webapp_table_id } =
      await getVariablesByName(headers, session, [
        "recepciones_rejection_types_webapp_table_id",
      ]);
    const response = await updateWebAppTableRegister(
      headers,
      recepciones_rejection_types_webapp_table_id,
      id,
      { Name }
    );
    return response;
  });
}

export async function saveMotivosDeRechazoByPurchase(
  headers: any,
  session: Session,
  body: RegisterMotivosRechazoBody,
  extraBody: { temp_purchase_order_id: string }
): Promise<AxiosUtilsResponse<any>> {
  return handlePossibleAxiosErrors(async () => {
    const { qc_rejections_webapp_table_id } = await getVariablesByName(
      headers,
      session,
      ["qc_rejections_webapp_table_id"]
    );

    const response =
      await createWebAppTableRegister<RegisterMotivosRechazoBody>(
        headers,
        qc_rejections_webapp_table_id,
        body,
        extraBody
      );
    return response.data;
  });
}
