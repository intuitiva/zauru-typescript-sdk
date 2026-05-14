import { handlePossibleAxiosErrors } from "@zauru-sdk/common";
import { createWebAppTableRegister, getVariablesByName, getWebAppTableRegisters, updateWebAppTableRegister, } from "@zauru-sdk/services";
/**
 * Get getConsolidatedHistories from the web app table.
 * @param headers Request headers.
 * @param session Session object.
 * @returns A Promise of AxiosUtilsResponse<ConsolidatedHistory[]>.
 */
export const getConsolidatedHistories = (headers, session) => {
    return handlePossibleAxiosErrors(async () => {
        const { purchase_order_consolidates_web_app_table_id } = await getVariablesByName(headers, session, [
            "purchase_order_consolidates_web_app_table_id",
        ]);
        const response = await getWebAppTableRegisters(session, purchase_order_consolidates_web_app_table_id);
        if (response.error) {
            throw new Error(`Ocurrió un error al consultar el historial de consolidados: ${response.userMsg}`);
        }
        const history = response?.data ?? [];
        return history;
    });
};
/**
 * Create a template in the web app table.
 * @param headers Request headers.
 * @param session Session object.
 * @param body ConsolidatedHistory data to be created.
 * @returns A Promise of AxiosUtilsResponse<ConsolidatedHistory>.
 */
export const createConsolidatedHistory = (headers, session, body) => {
    return handlePossibleAxiosErrors(async () => {
        const { purchase_order_consolidates_web_app_table_id } = await getVariablesByName(headers, session, [
            "purchase_order_consolidates_web_app_table_id",
        ]);
        const response = await createWebAppTableRegister(headers, purchase_order_consolidates_web_app_table_id, body);
        return response;
    });
};
/**
 * Put updateConsolidatedHistory from the web app table.
 * @param headers Request headers.
 * @param session Session object.
 * @returns A Promise of AxiosUtilsResponse<ConsolidatedHistory[]>.
 */
export const updateConsolidatedHistory = (headers, session, body, id_registro) => {
    return handlePossibleAxiosErrors(async () => {
        const { purchase_order_consolidates_web_app_table_id } = await getVariablesByName(headers, session, [
            "purchase_order_consolidates_web_app_table_id",
        ]);
        const response = await updateWebAppTableRegister(headers, purchase_order_consolidates_web_app_table_id, id_registro, { ...body });
        return response;
    });
};
