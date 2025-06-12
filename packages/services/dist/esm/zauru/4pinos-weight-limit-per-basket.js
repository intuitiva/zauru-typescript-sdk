import { handlePossibleAxiosErrors } from "@zauru-sdk/common";
import { getVariablesByName } from "../common.js";
import { createWebAppTableRegister, deleteWebAppTableRegister, getWebAppTableRegisters, updateWebAppTableRegister, } from "./zauru-web-app-tables.js";
export async function get4pinosWeightLimitPerBasket(headers, session) {
    return handlePossibleAxiosErrors(async () => {
        const { peso_maximo_por_canasta_webapp_table_id } = await getVariablesByName(headers, session, [
            "peso_maximo_por_cesta_webapp_table_id",
        ]);
        const response = await getWebAppTableRegisters(session, peso_maximo_por_canasta_webapp_table_id);
        if (response.error || !response.data) {
            throw new Error(response.userMsg);
        }
        return response?.data;
    });
}
export async function delete4pinosWeightLimitPerBasket(headers, session, id) {
    return handlePossibleAxiosErrors(async () => {
        const { peso_maximo_por_canasta_webapp_table_id } = await getVariablesByName(headers, session, [
            "peso_maximo_por_canasta_webapp_table_id",
        ]);
        const response = await deleteWebAppTableRegister(headers, peso_maximo_por_canasta_webapp_table_id, id);
        return response;
    });
}
export async function create4pinosWeightLimitPerBasket(headers, session, body) {
    return handlePossibleAxiosErrors(async () => {
        const { peso_maximo_por_canasta_webapp_table_id } = await getVariablesByName(headers, session, [
            "peso_maximo_por_canasta_webapp_table_id",
        ]);
        const response = await createWebAppTableRegister(headers, peso_maximo_por_canasta_webapp_table_id, body, { temp_purchase_order_id: `${body.purchase_order_id}` });
        return response;
    });
}
export async function update4pinosWeightLimitPerBasket(headers, session, id, body) {
    return handlePossibleAxiosErrors(async () => {
        const { peso_maximo_por_canasta_webapp_table_id } = await getVariablesByName(headers, session, [
            "peso_maximo_por_canasta_webapp_table_id",
        ]);
        const response = await updateWebAppTableRegister(headers, peso_maximo_por_canasta_webapp_table_id, id, body);
        return response;
    });
}
