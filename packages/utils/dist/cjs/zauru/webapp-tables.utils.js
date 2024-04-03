"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getReceptionTypes = void 0;
const common_1 = require("@zauru-sdk/common");
const services_1 = require("@zauru-sdk/services");
/**
 * Get template history entries from the web app table.
 * @param headers Request headers.
 * @param session Session object.
 * @returns A Promise of AxiosUtilsResponse<ReceptionType[]>.
 */
const getReceptionTypes = (headers, session) => {
    return (0, common_1.handlePossibleAxiosErrors)(async () => {
        const { recepciones_receptions_type_table_id } = await (0, services_1.getVariablesByName)(headers, session, ["recepciones_receptions_type_table_id"]);
        const response = await (0, services_1.getWebAppTableRegisters)(session, recepciones_receptions_type_table_id);
        const receptionTypes = response?.data ?? [];
        return receptionTypes;
    });
};
exports.getReceptionTypes = getReceptionTypes;
