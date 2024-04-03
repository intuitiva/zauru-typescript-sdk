"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateBitacorasPOMassive = exports.getBitacorasPOMassive = exports.saveBitacoraPOMassive = void 0;
const common_1 = require("@zauru-sdk/common");
const services_1 = require("@zauru-sdk/services");
/**
 * Get saveBitacoraPOMassive from the web app table.
 * @param headers Request headers.
 * @param session Session object.
 * @returns A Promise of AxiosUtilsResponse<WebAppRowGraphQL<BitacoraPOMassive>[]>.
 */
const saveBitacoraPOMassive = (headers, session, body) => {
    return (0, common_1.handlePossibleAxiosErrors)(async () => {
        const { bitacora_ediciones_masivas_web_app_table_id } = await (0, services_1.getVariablesByName)(headers, session, [
            "bitacora_ediciones_masivas_web_app_table_id",
        ]);
        const response = await (0, services_1.createWebAppTableRegister)(headers, bitacora_ediciones_masivas_web_app_table_id, { ...body, modificadoPor: session.get("name") });
        return response;
    });
};
exports.saveBitacoraPOMassive = saveBitacoraPOMassive;
/**
 * Get getBitacorasPOMassive from the web app table.
 * @param headers Request headers.
 * @param session Session object.
 * @returns A Promise of AxiosUtilsResponse<WebAppRowGraphQL<BitacoraPOMassive>[]>.
 */
const getBitacorasPOMassive = (headers, session) => {
    return (0, common_1.handlePossibleAxiosErrors)(async () => {
        const { bitacora_ediciones_masivas_web_app_table_id } = await (0, services_1.getVariablesByName)(headers, session, [
            "bitacora_ediciones_masivas_web_app_table_id",
        ]);
        const response = await (0, services_1.getWebAppTableRegisters)(session, bitacora_ediciones_masivas_web_app_table_id);
        if (response.error || !response.data) {
            throw new Error(response.userMsg);
        }
        return response.data;
    });
};
exports.getBitacorasPOMassive = getBitacorasPOMassive;
/**
 * Put updateBitacorasPOMassive from the web app table.
 * @param headers Request headers.
 * @param session Session object.
 * @returns A Promise of AxiosUtilsResponse<BitacorasPOMassiveWebAppTable[]>.
 */
const updateBitacorasPOMassive = (headers, session, body, id_registro) => {
    return (0, common_1.handlePossibleAxiosErrors)(async () => {
        const { bitacora_ediciones_masivas_web_app_table_id } = await (0, services_1.getVariablesByName)(headers, session, [
            "bitacora_ediciones_masivas_web_app_table_id",
        ]);
        const response = await (0, services_1.updateWebAppTableRegister)(headers, bitacora_ediciones_masivas_web_app_table_id, id_registro, { ...body, modificadoPor: session.get("name") });
        return response;
    });
};
exports.updateBitacorasPOMassive = updateBitacorasPOMassive;
