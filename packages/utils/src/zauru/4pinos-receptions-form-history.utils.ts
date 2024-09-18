import type { Session } from "@remix-run/node";
import { handlePossibleAxiosErrors } from "@zauru-sdk/common";
import {
  createWebAppTableRegister,
  deleteWebAppTableRegister,
  getVariablesByName,
  getWebAppRow,
  getWebAppTableRegisters,
  updateWebAppTableRegister,
} from "@zauru-sdk/services";
import {
  AxiosUtilsResponse,
  QueueFormReceptionWebAppTable,
  WebAppRowGraphQL,
  WebAppTableUpdateResponse,
} from "@zauru-sdk/types";

export const ESTADOS_COLA_RECEPCIONES = {
  EN_PROCESO: "En proceso",
  ERROR: "Con error",
  REINTENTANDO: "Reintentando",
  PENDIENTE_DE_REINTENTO: "Pendiente de reintento",
  OFFLINE: "Registro local",
};

/**
 * Get getQueueFormReceptionHistories from the web app table.
 * @param headers Request headers.
 * @param session Session object.
 * @returns A Promise of AxiosUtilsResponse<QueueFormReceptionWebAppTable[]>.
 */
export const getQueueFormReceptionHistories = (
  headers: any,
  session: Session
): Promise<
  AxiosUtilsResponse<WebAppRowGraphQL<QueueFormReceptionWebAppTable>[]>
> => {
  return handlePossibleAxiosErrors(async () => {
    const { queue_form_recepcion_submited_web_app_table_id } =
      await getVariablesByName(headers, session, [
        "queue_form_recepcion_submited_web_app_table_id",
      ]);

    const response =
      await getWebAppTableRegisters<QueueFormReceptionWebAppTable>(
        session,
        queue_form_recepcion_submited_web_app_table_id
      );

    if (response.error) {
      throw new Error(
        `Ocurrió un error al consultar el historial de colas: ${response.userMsg}`
      );
    }

    const history = response?.data ?? [];

    return history;
  });
};

/**
 * Get getQueueFormReceptionHistories from the web app table.
 * @param headers Request headers.
 * @param session Session object.
 * @returns A Promise of AxiosUtilsResponse<QueueFormReceptionWebAppTable[]>.
 */
export const getQueueFormReceptionHistoryByID = (
  session: Session,
  id: string | number
): Promise<AxiosUtilsResponse<QueueFormReceptionWebAppTable | null>> => {
  return handlePossibleAxiosErrors(async () => {
    const response = await getWebAppRow<QueueFormReceptionWebAppTable>(
      session,
      Number(id)
    );

    if (response.error) {
      throw new Error(
        `Ocurrió un error al consultar el historial de colas: ${response.userMsg}`
      );
    }

    const history = response?.data ?? null;

    return history;
  });
};

/**
 * Create a template in the web app table.
 * @param headers Request headers.
 * @param session Session object.
 * @param body QueueFormReceptionWebAppTable data to be created.
 * @returns A Promise of AxiosUtilsResponse<QueueFormReceptionWebAppTable>.
 */
export const createQueueFormReceptionHistory = (
  headers: any,
  session: Session,
  body: QueueFormReceptionWebAppTable
): Promise<AxiosUtilsResponse<WebAppTableUpdateResponse>> => {
  return handlePossibleAxiosErrors(async () => {
    const { queue_form_recepcion_submited_web_app_table_id } =
      await getVariablesByName(headers, session, [
        "queue_form_recepcion_submited_web_app_table_id",
      ]);
    //Esto es para simular el tiempo de carga de la API nunca subir a producción
    //await new Promise((resolve) => setTimeout(resolve, 7000));
    const response =
      await createWebAppTableRegister<QueueFormReceptionWebAppTable>(
        headers,
        queue_form_recepcion_submited_web_app_table_id,
        body
      );
    return response;
  });
};

/**
 * Put updateQueueFormReception from the web app table.
 * @param headers Request headers.
 * @param session Session object.
 * @returns A Promise of AxiosUtilsResponse<QueueFormReceptionWebAppTable[]>.
 */
export const updateQueueFormReceptionHistory = (
  headers: any,
  session: Session,
  body: Partial<QueueFormReceptionWebAppTable>,
  id_registro: string | number
): Promise<AxiosUtilsResponse<WebAppTableUpdateResponse>> => {
  return handlePossibleAxiosErrors(async () => {
    const { queue_form_recepcion_submited_web_app_table_id } =
      await getVariablesByName(headers, session, [
        "queue_form_recepcion_submited_web_app_table_id",
      ]);

    const response =
      await updateWebAppTableRegister<QueueFormReceptionWebAppTable>(
        headers,
        queue_form_recepcion_submited_web_app_table_id,
        id_registro,
        { ...body }
      );

    return response;
  });
};

/**
 * Delete QueueFormReceptionHistory from the web app table.
 * @param headers Request headers.
 * @param session Session object.
 * @returns A Promise of AxiosUtilsResponse<QueueFormReceptionWebAppTable[]>.
 */
export const deleteQueueFormReceptionHistory = (
  headers: any,
  session: Session,
  id: string
): Promise<AxiosUtilsResponse<WebAppTableUpdateResponse>> => {
  return handlePossibleAxiosErrors(async () => {
    const { queue_form_recepcion_submited_web_app_table_id } =
      await getVariablesByName(headers, session, [
        "queue_form_recepcion_submited_web_app_table_id",
      ]);

    const response = await deleteWebAppTableRegister(
      headers,
      queue_form_recepcion_submited_web_app_table_id,
      Number(id)
    );

    return response;
  });
};
