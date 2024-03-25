import { handlePossibleAxiosErrors } from "@zauru-sdk/common";
import { getVariablesByName } from "../common.server.js";
import { createWebAppTableRegister, deleteWebAppTableRegister, getWebAppTableRegisters, } from "./zauru-web-app-tables.server.js";
export async function getMotivosRechazo(headers, session) {
    return handlePossibleAxiosErrors(async () => {
        const { recepciones_rejection_types_webapp_table_id } = await getVariablesByName(headers, session, [
            "recepciones_rejection_types_webapp_table_id",
        ]);
        const response = await getWebAppTableRegisters(session, recepciones_rejection_types_webapp_table_id);
        if (response.error || !response.data) {
            throw new Error(response.userMsg);
        }
        return response?.data;
    });
}
export async function deleteMotivosRechazo(headers, session, id) {
    return handlePossibleAxiosErrors(async () => {
        const { recepciones_rejection_types_webapp_table_id } = await getVariablesByName(headers, session, [
            "recepciones_rejection_types_webapp_table_id",
        ]);
        const response = await deleteWebAppTableRegister(headers, recepciones_rejection_types_webapp_table_id, id);
        return response;
    });
}
export async function createMotivoRechazo(headers, session, body) {
    return handlePossibleAxiosErrors(async () => {
        const { recepciones_rejection_types_webapp_table_id } = await getVariablesByName(headers, session, [
            "recepciones_rejection_types_webapp_table_id",
        ]);
        const response = await createWebAppTableRegister(headers, recepciones_rejection_types_webapp_table_id, body);
        return response;
    });
}
export async function updateMotivosRechazo(headers, session, id) {
    return handlePossibleAxiosErrors(async () => {
        const { recepciones_rejection_types_webapp_table_id } = await getVariablesByName(headers, session, [
            "recepciones_rejection_types_webapp_table_id",
        ]);
        const response = await deleteWebAppTableRegister(headers, recepciones_rejection_types_webapp_table_id, id);
        return response;
    });
}
export async function saveMotivosDeRechazoByPurchase(headers, session, body, extraBody) {
    return handlePossibleAxiosErrors(async () => {
        const { qc_rejections_webapp_table_id } = await getVariablesByName(headers, session, ["qc_rejections_webapp_table_id"]);
        const response = await createWebAppTableRegister(headers, qc_rejections_webapp_table_id, body, extraBody);
        return response.data;
    });
}
