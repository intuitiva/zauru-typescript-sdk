"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEmployeesByCurrentAgency = exports.getEmployeesByLabAgency = void 0;
const common_1 = require("@zauru-sdk/common");
const services_1 = require("@zauru-sdk/services");
/**
 *
 * @param headers
 * @param session
 * @returns
 */
const getEmployeesByLabAgency = async (headers, session) => {
    return (0, common_1.handlePossibleAxiosErrors)(async () => {
        const { lab_agency_id } = await (0, services_1.getVariablesByName)(headers, session, [
            "lab_agency_id",
        ]);
        const response = await (0, services_1.getEmployeesByAgencyId)(session, lab_agency_id);
        if (response.error) {
            const msg = `Ocurrió un error al consultar los empleados por agencia de laboratorio: ${response.userMsg}`;
            console.error(msg);
            throw new Error(msg);
        }
        return response?.data ?? [];
    });
};
exports.getEmployeesByLabAgency = getEmployeesByLabAgency;
/**
 *
 * @param headers
 * @param session
 * @returns
 */
const getEmployeesByCurrentAgency = async (session) => {
    return (0, common_1.handlePossibleAxiosErrors)(async () => {
        const response = await (0, services_1.getEmployeesByAgencyId)(session, session.get("agency_id"));
        if (response.error) {
            const msg = `Ocurrió un error al consultar los empleados por la agencia actual: ${response.userMsg}`;
            console.error(msg);
            throw new Error(msg);
        }
        return response?.data ?? [];
    });
};
exports.getEmployeesByCurrentAgency = getEmployeesByCurrentAgency;
