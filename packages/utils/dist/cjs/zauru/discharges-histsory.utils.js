"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateDischargeHistory = exports.createDischargeHistory = exports.getDischargeHistories = void 0;
const common_1 = require("@zauru-sdk/common");
const services_1 = require("@zauru-sdk/services");
/**
 * Get getDischargeHistories from the web app table.
 * @param headers Request headers.
 * @param session Session object.
 * @returns A Promise of AxiosUtilsResponse<DischargeHistory[]>.
 */
const getDischargeHistories = (headers, session) => {
    return (0, common_1.handlePossibleAxiosErrors)(async () => {
        const { discharge_history_web_app_table_id } = await (0, services_1.getVariablesByName)(headers, session, ["discharge_history_web_app_table_id"]);
        const response = await (0, services_1.getWebAppTableRegisters)(session, discharge_history_web_app_table_id);
        if (response.error) {
            throw new Error(`Ocurrió un error al consultar el historial de discharges: ${response.userMsg}`);
        }
        const history = response?.data ?? [];
        return history;
    });
};
exports.getDischargeHistories = getDischargeHistories;
/**
 * Create a template in the web app table.
 * @param headers Request headers.
 * @param session Session object.
 * @param body DischargeHistory data to be created.
 * @returns A Promise of AxiosUtilsResponse<DischargeHistory>.
 */
const createDischargeHistory = (headers, session, body) => {
    return (0, common_1.handlePossibleAxiosErrors)(async () => {
        const { discharge_history_web_app_table_id } = await (0, services_1.getVariablesByName)(headers, session, ["discharge_history_web_app_table_id"]);
        const response = await (0, services_1.createWebAppTableRegister)(headers, discharge_history_web_app_table_id, body);
        return response;
    });
};
exports.createDischargeHistory = createDischargeHistory;
/**
 * Put updateDischargeHistory from the web app table.
 * @param headers Request headers.
 * @param session Session object.
 * @returns A Promise of AxiosUtilsResponse<DischargeHistory[]>.
 */
const updateDischargeHistory = (headers, session, body, id_registro) => {
    return (0, common_1.handlePossibleAxiosErrors)(async () => {
        const { discharge_history_web_app_table_id } = await (0, services_1.getVariablesByName)(headers, session, ["discharge_history_web_app_table_id"]);
        const response = await (0, services_1.updateWebAppTableRegister)(headers, discharge_history_web_app_table_id, id_registro, { ...body });
        return response;
    });
};
exports.updateDischargeHistory = updateDischargeHistory;
