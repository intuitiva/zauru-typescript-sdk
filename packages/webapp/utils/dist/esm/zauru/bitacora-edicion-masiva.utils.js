import { handlePossibleAxiosErrors } from "@zauru-sdk/common";
import { createWebAppTableRegister, getVariablesByName, getWebAppTableRegisters, updateWebAppTableRegister, } from "@zauru-sdk/services";
/**
 * Get saveBitacoraPOMassive from the web app table.
 * @param headers Request headers.
 * @param session Session object.
 * @returns A Promise of AxiosUtilsResponse<WebAppRowGraphQL<BitacoraPOMassive>[]>.
 */
export const saveBitacoraPOMassive = (headers, session, body) => {
    return handlePossibleAxiosErrors(async () => {
        const { bitacora_ediciones_masivas_web_app_table_id } = await getVariablesByName(headers, session, [
            "bitacora_ediciones_masivas_web_app_table_id",
        ]);
        const response = await createWebAppTableRegister(headers, bitacora_ediciones_masivas_web_app_table_id, { ...body, modificadoPor: session.get("name") });
        return response;
    });
};
/**
 * Get getBitacorasPOMassive from the web app table.
 * @param headers Request headers.
 * @param session Session object.
 * @returns A Promise of AxiosUtilsResponse<WebAppRowGraphQL<BitacoraPOMassive>[]>.
 */
export const getBitacorasPOMassive = (headers, session) => {
    return handlePossibleAxiosErrors(async () => {
        const { bitacora_ediciones_masivas_web_app_table_id } = await getVariablesByName(headers, session, [
            "bitacora_ediciones_masivas_web_app_table_id",
        ]);
        const response = await getWebAppTableRegisters(session, bitacora_ediciones_masivas_web_app_table_id, 1000);
        if (response.error || !response.data) {
            throw new Error(response.userMsg);
        }
        return response.data;
    });
};
/**
 * Put updateBitacorasPOMassive from the web app table.
 * @param headers Request headers.
 * @param session Session object.
 * @returns A Promise of AxiosUtilsResponse<BitacorasPOMassiveWebAppTable[]>.
 */
export const updateBitacorasPOMassive = (headers, session, body, id_registro) => {
    return handlePossibleAxiosErrors(async () => {
        const { bitacora_ediciones_masivas_web_app_table_id } = await getVariablesByName(headers, session, [
            "bitacora_ediciones_masivas_web_app_table_id",
        ]);
        const response = await updateWebAppTableRegister(headers, bitacora_ediciones_masivas_web_app_table_id, id_registro, { ...body, modificadoPor: session.get("name") });
        return response;
    });
};
