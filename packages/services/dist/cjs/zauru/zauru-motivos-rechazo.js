"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveMotivosDeRechazoByPurchase = exports.updateMotivosRechazo = exports.createMotivoRechazo = exports.deleteMotivosRechazo = exports.getMotivosRechazo = void 0;
const common_1 = require("@zauru-sdk/common");
const common_js_1 = require("../common.js");
const zauru_web_app_tables_js_1 = require("./zauru-web-app-tables.js");
async function getMotivosRechazo(headers, session) {
    return (0, common_1.handlePossibleAxiosErrors)(async () => {
        const { recepciones_rejection_types_webapp_table_id } = await (0, common_js_1.getVariablesByName)(headers, session, [
            "recepciones_rejection_types_webapp_table_id",
        ]);
        const response = await (0, zauru_web_app_tables_js_1.getWebAppTableRegisters)(session, recepciones_rejection_types_webapp_table_id);
        if (response.error || !response.data) {
            throw new Error(response.userMsg);
        }
        return response?.data;
    });
}
exports.getMotivosRechazo = getMotivosRechazo;
async function deleteMotivosRechazo(headers, session, id) {
    return (0, common_1.handlePossibleAxiosErrors)(async () => {
        const { recepciones_rejection_types_webapp_table_id } = await (0, common_js_1.getVariablesByName)(headers, session, [
            "recepciones_rejection_types_webapp_table_id",
        ]);
        const response = await (0, zauru_web_app_tables_js_1.deleteWebAppTableRegister)(headers, recepciones_rejection_types_webapp_table_id, id);
        return response;
    });
}
exports.deleteMotivosRechazo = deleteMotivosRechazo;
async function createMotivoRechazo(headers, session, body) {
    return (0, common_1.handlePossibleAxiosErrors)(async () => {
        const { recepciones_rejection_types_webapp_table_id } = await (0, common_js_1.getVariablesByName)(headers, session, [
            "recepciones_rejection_types_webapp_table_id",
        ]);
        const response = await (0, zauru_web_app_tables_js_1.createWebAppTableRegister)(headers, recepciones_rejection_types_webapp_table_id, body);
        return response;
    });
}
exports.createMotivoRechazo = createMotivoRechazo;
async function updateMotivosRechazo(headers, session, id, body) {
    return (0, common_1.handlePossibleAxiosErrors)(async () => {
        const { recepciones_rejection_types_webapp_table_id } = await (0, common_js_1.getVariablesByName)(headers, session, [
            "recepciones_rejection_types_webapp_table_id",
        ]);
        const response = await (0, zauru_web_app_tables_js_1.updateWebAppTableRegister)(headers, recepciones_rejection_types_webapp_table_id, id, body);
        return response;
    });
}
exports.updateMotivosRechazo = updateMotivosRechazo;
async function saveMotivosDeRechazoByPurchase(headers, session, body, extraBody) {
    return (0, common_1.handlePossibleAxiosErrors)(async () => {
        const { qc_rejections_webapp_table_id } = await (0, common_js_1.getVariablesByName)(headers, session, ["qc_rejections_webapp_table_id"]);
        const response = await (0, zauru_web_app_tables_js_1.createWebAppTableRegister)(headers, qc_rejections_webapp_table_id, body, extraBody);
        return response.data;
    });
}
exports.saveMotivosDeRechazoByPurchase = saveMotivosDeRechazoByPurchase;
