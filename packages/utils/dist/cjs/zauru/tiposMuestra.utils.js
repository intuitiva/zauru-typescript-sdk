"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateTipoMuestra = exports.deleteTipoMuestra = exports.createTipoMuestra = exports.getTipoMuestras = void 0;
const common_1 = require("@zauru-sdk/common");
const services_1 = require("@zauru-sdk/services");
/**
 * Get tipoMuestras from the web app table.
 * @param headers Request headers.
 * @param session Session object.
 * @returns A Promise of AxiosUtilsResponse<WebAppRowGraphQL<TipoMuestra>[]>>.
 */
const getTipoMuestras = (headers, session) => {
    return (0, common_1.handlePossibleAxiosErrors)(async () => {
        const { tipo_muestra_web_app_table_id } = await (0, services_1.getVariablesByName)(headers, session, ["tipo_muestra_web_app_table_id"]);
        const response = await (0, services_1.getWebAppTableRegisters)(session, tipo_muestra_web_app_table_id);
        if (response.error) {
            throw new Error(`Ocurrió un error al consultar los tipos de muestra: ${response.userMsg}`);
        }
        const tipoMuestras = response.data ?? [];
        return tipoMuestras;
    });
};
exports.getTipoMuestras = getTipoMuestras;
/**
 * Create a tipoMuestra in the web app table.
 * @param headers Request headers.
 * @param session Session object.
 * @param body TipoMuestra data to be created.
 * @returns A Promise of AxiosUtilsResponse<WebAppTableUpdateResponse>.
 */
const createTipoMuestra = (headers, session, body) => {
    return (0, common_1.handlePossibleAxiosErrors)(async () => {
        const { tipo_muestra_web_app_table_id } = await (0, services_1.getVariablesByName)(headers, session, ["tipo_muestra_web_app_table_id"]);
        const response = await (0, services_1.createWebAppTableRegister)(headers, tipo_muestra_web_app_table_id, body);
        return response;
    });
};
exports.createTipoMuestra = createTipoMuestra;
/**
 * Delete a tipoMuestra from the web app table.
 * @param headers Request headers.
 * @param session Session object.
 * @param id ID of the tipoMuestra to be deleted.
 * @returns A Promise of AxiosUtilsResponse<WebAppTableUpdateResponse>.
 */
const deleteTipoMuestra = (headers, session, id) => {
    return (0, common_1.handlePossibleAxiosErrors)(async () => {
        const { tipo_muestra_web_app_table_id } = await (0, services_1.getVariablesByName)(headers, session, ["tipo_muestra_web_app_table_id"]);
        const response = await (0, services_1.deleteWebAppTableRegister)(headers, tipo_muestra_web_app_table_id, Number(id));
        return response;
    });
};
exports.deleteTipoMuestra = deleteTipoMuestra;
/**
 * Update a tipoMuestra in the web app table.
 * @param headers Request headers.
 * @param session Session object.
 * @param id ID of the tipoMuestra to be updated.
 * @param body Updated tipoMuestra data.
 * @returns A Promise of AxiosUtilsResponse<WebAppTableUpdateResponse>.
 */
const updateTipoMuestra = (headers, session, id, body) => {
    return (0, common_1.handlePossibleAxiosErrors)(async () => {
        const { tipo_muestra_web_app_table_id } = await (0, services_1.getVariablesByName)(headers, session, ["tipo_muestra_web_app_table_id"]);
        const response = await (0, services_1.updateWebAppTableRegister)(headers, tipo_muestra_web_app_table_id, Number(id), body);
        return response;
    });
};
exports.updateTipoMuestra = updateTipoMuestra;
