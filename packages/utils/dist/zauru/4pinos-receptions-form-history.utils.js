import { handlePossibleAxiosErrors } from "@zauru-sdk/common";
import { createWebAppTableRegister, deleteWebAppTableRegister, getVariablesByName, getWebAppTableRegisters, updateWebAppTableRegister, } from "@zauru-sdk/services";
export const ESTADOS_COLA_RECEPCIONES = {
    EN_PROCESO: "En proceso",
    ERROR: "Con error",
    REINTENTANDO: "Reintentando",
    OFFLINE: "Registro local",
};
/**
 * Get getQueueFormReceptionHistories from the web app table.
 * @param headers Request headers.
 * @param session Session object.
 * @returns A Promise of AxiosUtilsResponse<QueueFormReceptionWebAppTable[]>.
 */
export const getQueueFormReceptionHistories = (headers, session) => {
    return handlePossibleAxiosErrors(async () => {
        const { queue_form_recepcion_submited_web_app_table_id } = await getVariablesByName(headers, session, [
            "queue_form_recepcion_submited_web_app_table_id",
        ]);
        const response = await getWebAppTableRegisters(session, queue_form_recepcion_submited_web_app_table_id);
        if (response.error) {
            throw new Error(`Ocurrió un error al consultar el historial de colas: ${response.userMsg}`);
        }
        const history = response?.data ?? [];
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
export const createQueueFormReceptionHistory = (headers, session, body) => {
    return handlePossibleAxiosErrors(async () => {
        const { queue_form_recepcion_submited_web_app_table_id } = await getVariablesByName(headers, session, [
            "queue_form_recepcion_submited_web_app_table_id",
        ]);
        const response = await createWebAppTableRegister(headers, queue_form_recepcion_submited_web_app_table_id, body);
        return response;
    });
};
/**
 * Put updateQueueFormReception from the web app table.
 * @param headers Request headers.
 * @param session Session object.
 * @returns A Promise of AxiosUtilsResponse<QueueFormReceptionWebAppTable[]>.
 */
export const updateQueueFormReceptionHistory = (headers, session, body, id_registro) => {
    return handlePossibleAxiosErrors(async () => {
        const { queue_form_recepcion_submited_web_app_table_id } = await getVariablesByName(headers, session, [
            "queue_form_recepcion_submited_web_app_table_id",
        ]);
        const response = await updateWebAppTableRegister(headers, queue_form_recepcion_submited_web_app_table_id, id_registro, { ...body });
        return response;
    });
};
/**
 * Delete QueueFormReceptionHistory from the web app table.
 * @param headers Request headers.
 * @param session Session object.
 * @returns A Promise of AxiosUtilsResponse<QueueFormReceptionWebAppTable[]>.
 */
export const deleteQueueFormReceptionHistory = (headers, session, id) => {
    return handlePossibleAxiosErrors(async () => {
        const { queue_form_recepcion_submited_web_app_table_id } = await getVariablesByName(headers, session, [
            "queue_form_recepcion_submited_web_app_table_id",
        ]);
        const response = await deleteWebAppTableRegister(headers, queue_form_recepcion_submited_web_app_table_id, Number(id));
        return response;
    });
};
