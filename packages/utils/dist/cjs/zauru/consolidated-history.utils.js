"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateConsolidatedHistory = exports.createConsolidatedHistory = exports.getConsolidatedHistories = void 0;
const common_1 = require("@zauru-sdk/common");
const services_1 = require("@zauru-sdk/services");
/**
 * Get getConsolidatedHistories from the web app table.
 * @param headers Request headers.
 * @param session Session object.
 * @returns A Promise of AxiosUtilsResponse<ConsolidatedHistory[]>.
 */
const getConsolidatedHistories = (headers, session) => {
    return (0, common_1.handlePossibleAxiosErrors)(async () => {
        const { purchase_order_consolidates_web_app_table_id } = await (0, services_1.getVariablesByName)(headers, session, [
            "purchase_order_consolidates_web_app_table_id",
        ]);
        const response = await (0, services_1.getWebAppTableRegisters)(session, purchase_order_consolidates_web_app_table_id);
        if (response.error) {
            throw new Error(`Ocurrió un error al consultar el historial de consolidados: ${response.userMsg}`);
        }
        const history = response?.data ?? [];
        return history;
    });
};
exports.getConsolidatedHistories = getConsolidatedHistories;
/**
 * Create a template in the web app table.
 * @param headers Request headers.
 * @param session Session object.
 * @param body ConsolidatedHistory data to be created.
 * @returns A Promise of AxiosUtilsResponse<ConsolidatedHistory>.
 */
const createConsolidatedHistory = (headers, session, body) => {
    return (0, common_1.handlePossibleAxiosErrors)(async () => {
        const { purchase_order_consolidates_web_app_table_id } = await (0, services_1.getVariablesByName)(headers, session, [
            "purchase_order_consolidates_web_app_table_id",
        ]);
        const response = await (0, services_1.createWebAppTableRegister)(headers, purchase_order_consolidates_web_app_table_id, body);
        return response;
    });
};
exports.createConsolidatedHistory = createConsolidatedHistory;
/**
 * Put updateConsolidatedHistory from the web app table.
 * @param headers Request headers.
 * @param session Session object.
 * @returns A Promise of AxiosUtilsResponse<ConsolidatedHistory[]>.
 */
const updateConsolidatedHistory = (headers, session, body, id_registro) => {
    return (0, common_1.handlePossibleAxiosErrors)(async () => {
        const { purchase_order_consolidates_web_app_table_id } = await (0, services_1.getVariablesByName)(headers, session, [
            "purchase_order_consolidates_web_app_table_id",
        ]);
        const response = await (0, services_1.updateWebAppTableRegister)(headers, purchase_order_consolidates_web_app_table_id, id_registro, { ...body });
        return response;
    });
};
exports.updateConsolidatedHistory = updateConsolidatedHistory;
