"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveRechazoCanastas = exports.formatearMotivoDeRechazo = void 0;
const common_1 = require("@zauru-sdk/common");
const services_1 = require("@zauru-sdk/services");
const formatearMotivoDeRechazo = (entity) => {
    return { id: entity.id, name: entity.data.Nombre };
};
exports.formatearMotivoDeRechazo = formatearMotivoDeRechazo;
/**
 * Post saveBitacoraPOMassive from the web app table.
 * @param headers Request headers.
 * @param session Session object.
 * @returns A Promise of AxiosUtilsResponse<WebAppRowGraphQL<BitacoraPOMassive>[]>.
 */
const saveRechazoCanastas = (headers, session, body) => {
    return (0, common_1.handlePossibleAxiosErrors)(async () => {
        const { recepciones_rejections_webapp_table_id } = await (0, services_1.getVariablesByName)(headers, session, ["recepciones_rejections_webapp_table_id"]);
        const response = await (0, services_1.createWebAppTableRegister)(headers, recepciones_rejections_webapp_table_id, { ...body });
        return response;
    });
};
exports.saveRechazoCanastas = saveRechazoCanastas;
