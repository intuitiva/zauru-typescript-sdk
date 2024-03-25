import { getVariablesByName } from "../common.server.js";
import { createWebAppTableRegister, deleteWebAppTableRegister, getWebAppTableRegisters, } from "./zauru-web-app-tables.server.js";
export async function getLoteRecord(headers, session) {
    const { lote_record_webapp_table_id: webapp_table_id } = await getVariablesByName(headers, session, ["lote_record_webapp_table_id"]);
    const response = await getWebAppTableRegisters(session, webapp_table_id);
    if (response.error) {
        throw new Error(`Error al obtener el lote: ${response.userMsg}`);
    }
    const lotes = response.data ?? [];
    return lotes;
}
export async function deleteLoteRecord(headers, session, id) {
    const { lote_record_webapp_table_id: webapp_table_id } = await getVariablesByName(headers, session, ["lote_record_webapp_table_id"]);
    const response = await deleteWebAppTableRegister(headers, webapp_table_id, id);
    return response.data;
}
export async function createLoteRecord(headers, session, body) {
    const { lote_record_webapp_table_id: webapp_table_id } = await getVariablesByName(headers, session, ["lote_record_webapp_table_id"]);
    const response = await createWebAppTableRegister(headers, webapp_table_id, body);
    return response.data;
}
export async function updateLoteRecord(headers, session, id) {
    const { lote_record_webapp_table_id: webapp_table_id } = await getVariablesByName(headers, session, ["lote_record_webapp_table_id"]);
    const response = await deleteWebAppTableRegister(headers, webapp_table_id, id);
    return response.data;
}
