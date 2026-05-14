import { handlePossibleAxiosErrors } from "@zauru-sdk/common";
import { getVariablesByName } from "../common.js";
import { createWebAppTableRegister, deleteWebAppTableRegister, getWebAppTableRegisters, updateWebAppTableRegister, } from "./zauru-web-app-tables.js";
export async function getCCPorcentajesDeRechazo(headers, session) {
    return handlePossibleAxiosErrors(async () => {
        const { cc_porcentajes_rechazo_en_planta } = await getVariablesByName(headers, session, ["cc_porcentajes_rechazo_en_planta"]);
        const response = await getWebAppTableRegisters(session, cc_porcentajes_rechazo_en_planta);
        if (response.error || !response.data) {
            throw new Error(response.userMsg);
        }
        return response?.data;
    });
}
export async function deleteCCPorcentajesDeRechazo(headers, session, id) {
    return handlePossibleAxiosErrors(async () => {
        const { cc_porcentajes_rechazo_en_planta } = await getVariablesByName(headers, session, ["cc_porcentajes_rechazo_en_planta"]);
        const response = await deleteWebAppTableRegister(headers, cc_porcentajes_rechazo_en_planta, id);
        return response;
    });
}
export async function createCCPorcentajesDeRechazo(headers, session, body) {
    return handlePossibleAxiosErrors(async () => {
        const { cc_porcentajes_rechazo_en_planta } = await getVariablesByName(headers, session, ["cc_porcentajes_rechazo_en_planta"]);
        const response = await createWebAppTableRegister(headers, cc_porcentajes_rechazo_en_planta, body);
        return response;
    });
}
export async function updateCCPorcentajesDeRechazo(headers, session, id, body) {
    return handlePossibleAxiosErrors(async () => {
        const { cc_porcentajes_rechazo_en_planta } = await getVariablesByName(headers, session, ["cc_porcentajes_rechazo_en_planta"]);
        const response = await updateWebAppTableRegister(headers, cc_porcentajes_rechazo_en_planta, id, body);
        return response;
    });
}
