"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateLoteRecord = exports.createLoteRecord = exports.deleteLoteRecord = exports.getLoteRecord = void 0;
const common_js_1 = require("../common.js");
const zauru_web_app_tables_js_1 = require("./zauru-web-app-tables.js");
async function getLoteRecord(headers, session) {
    const { lote_record_webapp_table_id: webapp_table_id } = await (0, common_js_1.getVariablesByName)(headers, session, ["lote_record_webapp_table_id"]);
    const response = await (0, zauru_web_app_tables_js_1.getWebAppTableRegisters)(session, webapp_table_id);
    if (response.error) {
        throw new Error(`Error al obtener el lote: ${response.userMsg}`);
    }
    const lotes = response.data ?? [];
    return lotes;
}
exports.getLoteRecord = getLoteRecord;
async function deleteLoteRecord(headers, session, id) {
    const { lote_record_webapp_table_id: webapp_table_id } = await (0, common_js_1.getVariablesByName)(headers, session, ["lote_record_webapp_table_id"]);
    const response = await (0, zauru_web_app_tables_js_1.deleteWebAppTableRegister)(headers, webapp_table_id, id);
    return response.data;
}
exports.deleteLoteRecord = deleteLoteRecord;
async function createLoteRecord(headers, session, body) {
    const { lote_record_webapp_table_id: webapp_table_id } = await (0, common_js_1.getVariablesByName)(headers, session, ["lote_record_webapp_table_id"]);
    const response = await (0, zauru_web_app_tables_js_1.createWebAppTableRegister)(headers, webapp_table_id, body);
    return response.data;
}
exports.createLoteRecord = createLoteRecord;
async function updateLoteRecord(headers, session, id) {
    const { lote_record_webapp_table_id: webapp_table_id } = await (0, common_js_1.getVariablesByName)(headers, session, ["lote_record_webapp_table_id"]);
    const response = await (0, zauru_web_app_tables_js_1.deleteWebAppTableRegister)(headers, webapp_table_id, id);
    return response.data;
}
exports.updateLoteRecord = updateLoteRecord;
