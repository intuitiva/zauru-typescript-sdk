import { handlePossibleAxiosErrors } from "@zauru-sdk/common";
import { createWebAppTableRegister, deleteWebAppTableRegister, getVariablesByName, getWebAppRow, getWebAppTableRegisters, updateWebAppTableRegister, } from "@zauru-sdk/services";
/**
 * Get getQueueShipmentsFormHistories from the web app table.
 * @param headers Request headers.
 * @param session Session object.
 * @returns A Promise of AxiosUtilsResponse<QueueShipmentsForm[]>.
 */
export const getQueueShipmentsFormHistories = (headers, session) => {
    return handlePossibleAxiosErrors(async () => {
        const { queue_form_shipment_submited_web_app_table_id } = await getVariablesByName(headers, session, [
            "queue_form_shipment_submited_web_app_table_id",
        ]);
        const response = await getWebAppTableRegisters(session, queue_form_shipment_submited_web_app_table_id);
        if (response.error) {
            throw new Error(`Ocurrió un error al consultar el historial de envíos: ${response.userMsg}`);
        }
        const history = response?.data ?? [];
        return history;
    });
};
/**
 * Get getQueueShipmentsFormHistories from the web app table.
 * @param headers Request headers.
 * @param session Session object.
 * @returns A Promise of AxiosUtilsResponse<QueueShipmentsForm[]>.
 */
export const getQueueShipmentsFormHistoryByID = (session, id) => {
    return handlePossibleAxiosErrors(async () => {
        const response = await getWebAppRow(session, Number(id));
        if (response.error) {
            throw new Error(`Ocurrió un error al consultar el historial de colas: ${response.userMsg}`);
        }
        const history = response?.data ?? null;
        return history;
    });
};
/**
 * Create a template in the web app table.
 * @param headers Request headers.
 * @param session Session object.
 * @param body QueueShipmentsForm data to be created.
 * @returns A Promise of AxiosUtilsResponse<QueueShipmentsForm>.
 */
export const createQueueShipmentsFormHistory = (headers, session, body) => {
    return handlePossibleAxiosErrors(async () => {
        const { queue_form_shipment_submited_web_app_table_id } = await getVariablesByName(headers, session, [
            "queue_form_shipment_submited_web_app_table_id",
        ]);
        //Esto es para simular el tiempo de carga de la API nunca subir a producción
        //await new Promise((resolve) => setTimeout(resolve, 7000));
        //throw new Error("Error al crear el historial de colas");
        const response = await createWebAppTableRegister(headers, queue_form_shipment_submited_web_app_table_id, body);
        return response;
    });
};
/**
 * Put updateQueueShipmentsForm from the web app table.
 * @param headers Request headers.
 * @param session Session object.
 * @returns A Promise of AxiosUtilsResponse<QueueShipmentsForm[]>.
 */
export const updateQueueShipmentsFormHistory = (headers, session, body, id_registro) => {
    return handlePossibleAxiosErrors(async () => {
        const { queue_form_shipment_submited_web_app_table_id } = await getVariablesByName(headers, session, [
            "queue_form_shipment_submited_web_app_table_id",
        ]);
        const response = await updateWebAppTableRegister(headers, queue_form_shipment_submited_web_app_table_id, id_registro, { ...body });
        return response;
    });
};
/**
 * Delete QueueShipmentsFormHistory from the web app table.
 * @param headers Request headers.
 * @param session Session object.
 * @returns A Promise of AxiosUtilsResponse<QueueShipmentsForm[]>.
 */
export const deleteQueueShipmentsFormHistory = (headers, session, id) => {
    return handlePossibleAxiosErrors(async () => {
        const { queue_form_shipment_submited_web_app_table_id } = await getVariablesByName(headers, session, [
            "queue_form_shipment_submited_web_app_table_id",
        ]);
        const response = await deleteWebAppTableRegister(headers, queue_form_shipment_submited_web_app_table_id, Number(id));
        return response;
    });
};
