import { handlePossibleAxiosErrors } from "@zauru-sdk/common";
import { createWebAppTableRegister, deleteWebAppTableRegister, getVariablesByName, getWebAppTableRegisters, updateWebAppTableRegister, } from "@zauru-sdk/services";
/**
 * Get specialItems from the web app table.
 * @param headers Request headers.
 * @param session Session object.
 * @returns A Promise of AxiosUtilsResponse<WebAppRowGraphQL<SpecialItem>[]>>.
 */
export const getSpecialItems = (headers, session) => {
    return handlePossibleAxiosErrors(async () => {
        const { special_product_web_app_table_id } = await getVariablesByName(headers, session, ["special_product_web_app_table_id"]);
        const response = await getWebAppTableRegisters(session, special_product_web_app_table_id);
        if (response.error) {
            throw new Error(`Ocurrió un error al consultar los items especiales: ${response.userMsg}`);
        }
        const specialItems = response.data ?? [];
        return specialItems;
    });
};
/**
 * Create a specialItem in the web app table.
 * @param headers Request headers.
 * @param session Session object.
 * @param body SpecialItem data to be created.
 * @returns A Promise of AxiosUtilsResponse<WebAppTableUpdateResponse>.
 */
export const createSpecialItem = (headers, session, body) => {
    return handlePossibleAxiosErrors(async () => {
        const { special_product_web_app_table_id } = await getVariablesByName(headers, session, ["special_product_web_app_table_id"]);
        const response = await createWebAppTableRegister(headers, special_product_web_app_table_id, body);
        return response;
    });
};
/**
 * Delete a specialItem from the web app table.
 * @param headers Request headers.
 * @param session Session object.
 * @param id ID of the specialItem to be deleted.
 * @returns A Promise of AxiosUtilsResponse<WebAppTableUpdateResponse>.
 */
export const deleteSpecialItem = (headers, session, id) => {
    return handlePossibleAxiosErrors(async () => {
        const { special_product_web_app_table_id } = await getVariablesByName(headers, session, ["special_product_web_app_table_id"]);
        const response = await deleteWebAppTableRegister(headers, special_product_web_app_table_id, Number(id));
        return response;
    });
};
/**
 * Update a specialItem in the web app table.
 * @param headers Request headers.
 * @param session Session object.
 * @param id ID of the specialItem to be updated.
 * @param body Updated specialItem data.
 * @returns A Promise of AxiosUtilsResponse<WebAppTableUpdateResponse>.
 */
export const updateSpecialItem = (headers, session, id, body) => {
    return handlePossibleAxiosErrors(async () => {
        const { special_product_web_app_table_id } = await getVariablesByName(headers, session, ["special_product_web_app_table_id"]);
        const response = await updateWebAppTableRegister(headers, special_product_web_app_table_id, Number(id), body);
        return response;
    });
};
