import { handlePossibleAxiosErrors } from "@zauru-sdk/common";
import { createWebAppTableRegister, deleteWebAppTableRegister, getVariablesByName, getWebAppTableRegisters, updateWebAppTableRegister, } from "@zauru-sdk/services";
/**
 * Get tipoMuestras from the web app table.
 * @param headers Request headers.
 * @param session Session object.
 * @returns A Promise of AxiosUtilsResponse<WebAppRowGraphQL<TipoMuestra>[]>>.
 */
export async function getTipoMuestras(headers, session) {
    return handlePossibleAxiosErrors(async () => {
        const { tipo_muestra_web_app_table_id } = await getVariablesByName(headers, session, ["tipo_muestra_web_app_table_id"]);
        const response = await getWebAppTableRegisters(session, tipo_muestra_web_app_table_id);
        if (response.error) {
            throw new Error(`Ocurrió un error al consultar los tipos de muestra: ${response.userMsg}`);
        }
        const tipoMuestras = response.data ?? [];
        return tipoMuestras;
    });
}
/**
 * Create a tipoMuestra in the web app table.
 * @param headers Request headers.
 * @param session Session object.
 * @param body TipoMuestra data to be created.
 * @returns A Promise of AxiosUtilsResponse<WebAppTableUpdateResponse>.
 */
export async function createTipoMuestra(headers, session, body) {
    return handlePossibleAxiosErrors(async () => {
        const { tipo_muestra_web_app_table_id } = await getVariablesByName(headers, session, ["tipo_muestra_web_app_table_id"]);
        const response = await createWebAppTableRegister(headers, tipo_muestra_web_app_table_id, body);
        return response;
    });
}
/**
 * Delete a tipoMuestra from the web app table.
 * @param headers Request headers.
 * @param session Session object.
 * @param id ID of the tipoMuestra to be deleted.
 * @returns A Promise of AxiosUtilsResponse<WebAppTableUpdateResponse>.
 */
export async function deleteTipoMuestra(headers, session, id) {
    return handlePossibleAxiosErrors(async () => {
        const { tipo_muestra_web_app_table_id } = await getVariablesByName(headers, session, ["tipo_muestra_web_app_table_id"]);
        const response = await deleteWebAppTableRegister(headers, tipo_muestra_web_app_table_id, Number(id));
        return response;
    });
}
/**
 * Update a tipoMuestra in the web app table.
 * @param headers Request headers.
 * @param session Session object.
 * @param id ID of the tipoMuestra to be updated.
 * @param body Updated tipoMuestra data.
 * @returns A Promise of AxiosUtilsResponse<WebAppTableUpdateResponse>.
 */
export async function updateTipoMuestra(headers, session, id, body) {
    return handlePossibleAxiosErrors(async () => {
        const { tipo_muestra_web_app_table_id } = await getVariablesByName(headers, session, ["tipo_muestra_web_app_table_id"]);
        const response = await updateWebAppTableRegister(headers, tipo_muestra_web_app_table_id, Number(id), body);
        return response;
    });
}
