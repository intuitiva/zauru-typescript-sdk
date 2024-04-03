"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMyCases = void 0;
const common_1 = require("@zauru-sdk/common");
const services_1 = require("@zauru-sdk/services");
/**
 *
 * @param headers
 * @param session
 * @returns
 */
const getMyCases = async (session, wheres = []) => {
    return (0, common_1.handlePossibleAxiosErrors)(async () => {
        const response = await (0, services_1.getCasesByResponsibleId)(session, session.get("employee_id"), wheres);
        if (response.error) {
            throw new Error(`Ocurrió un error al consultar los casos asignados a este usuario: ${response.userMsg}`);
        }
        return response?.data ?? [];
    });
};
exports.getMyCases = getMyCases;
