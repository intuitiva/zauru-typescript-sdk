"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteQueueFormReceptionHistory = exports.updateQueueFormReceptionHistory = exports.createQueueFormReceptionHistory = exports.getQueueFormReceptionHistoryByID = exports.getQueueFormReceptionHistories = exports.ESTADOS_COLA_RECEPCIONES = void 0;
const common_1 = require("@zauru-sdk/common");
const services_1 = require("@zauru-sdk/services");
exports.ESTADOS_COLA_RECEPCIONES = {
    INICIADO: "Iniciado",
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
const getQueueFormReceptionHistories = (headers, session) => {
    return (0, common_1.handlePossibleAxiosErrors)(async () => {
        const { queue_form_recepcion_submited_web_app_table_id } = await (0, services_1.getVariablesByName)(headers, session, [
            "queue_form_recepcion_submited_web_app_table_id",
        ]);
        const response = await (0, services_1.getWebAppTableRegisters)(session, queue_form_recepcion_submited_web_app_table_id);
        if (response.error) {
            throw new Error(`Ocurrió un error al consultar el historial de colas: ${response.userMsg}`);
        }
        const history = response?.data ?? [];
        return history;
    });
};
exports.getQueueFormReceptionHistories = getQueueFormReceptionHistories;
/**
 * Get getQueueFormReceptionHistories from the web app table.
 * @param headers Request headers.
 * @param session Session object.
 * @returns A Promise of AxiosUtilsResponse<QueueFormReceptionWebAppTable[]>.
 */
const getQueueFormReceptionHistoryByID = (session, id) => {
    return (0, common_1.handlePossibleAxiosErrors)(async () => {
        const response = await (0, services_1.getWebAppRow)(session, Number(id));
        if (response.error) {
            throw new Error(`Ocurrió un error al consultar el historial de colas: ${response.userMsg}`);
        }
        const history = response?.data ?? null;
        return history;
    });
};
exports.getQueueFormReceptionHistoryByID = getQueueFormReceptionHistoryByID;
/**
 * Create a template in the web app table.
 * @param headers Request headers.
 * @param session Session object.
 * @param body QueueFormReceptionWebAppTable data to be created.
 * @returns A Promise of AxiosUtilsResponse<QueueFormReceptionWebAppTable>.
 */
const createQueueFormReceptionHistory = (headers, session, body) => {
    return (0, common_1.handlePossibleAxiosErrors)(async () => {
        const { queue_form_recepcion_submited_web_app_table_id } = await (0, services_1.getVariablesByName)(headers, session, [
            "queue_form_recepcion_submited_web_app_table_id",
        ]);
        //Esto es para simular el tiempo de carga de la API nunca subir a producción
        //await new Promise((resolve) => setTimeout(resolve, 7000));
        //throw new Error("Error al crear el historial de colas");
        const response = await (0, services_1.createWebAppTableRegister)(headers, queue_form_recepcion_submited_web_app_table_id, body);
        return response;
    });
};
exports.createQueueFormReceptionHistory = createQueueFormReceptionHistory;
/**
 * Put updateQueueFormReception from the web app table.
 * @param headers Request headers.
 * @param session Session object.
 * @returns A Promise of AxiosUtilsResponse<QueueFormReceptionWebAppTable[]>.
 */
const updateQueueFormReceptionHistory = (headers, session, body, id_registro) => {
    return (0, common_1.handlePossibleAxiosErrors)(async () => {
        const { queue_form_recepcion_submited_web_app_table_id } = await (0, services_1.getVariablesByName)(headers, session, [
            "queue_form_recepcion_submited_web_app_table_id",
        ]);
        const response = await (0, services_1.updateWebAppTableRegister)(headers, queue_form_recepcion_submited_web_app_table_id, id_registro, { ...body });
        return response;
    });
};
exports.updateQueueFormReceptionHistory = updateQueueFormReceptionHistory;
/**
 * Delete QueueFormReceptionHistory from the web app table.
 * @param headers Request headers.
 * @param session Session object.
 * @returns A Promise of AxiosUtilsResponse<QueueFormReceptionWebAppTable[]>.
 */
const deleteQueueFormReceptionHistory = (headers, session, id) => {
    return (0, common_1.handlePossibleAxiosErrors)(async () => {
        const { queue_form_recepcion_submited_web_app_table_id } = await (0, services_1.getVariablesByName)(headers, session, [
            "queue_form_recepcion_submited_web_app_table_id",
        ]);
        const response = await (0, services_1.deleteWebAppTableRegister)(headers, queue_form_recepcion_submited_web_app_table_id, Number(id));
        return response;
    });
};
exports.deleteQueueFormReceptionHistory = deleteQueueFormReceptionHistory;
