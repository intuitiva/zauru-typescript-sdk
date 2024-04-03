"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateSpecialItem = exports.deleteSpecialItem = exports.createSpecialItem = exports.getSpecialItems = void 0;
const common_1 = require("@zauru-sdk/common");
const services_1 = require("@zauru-sdk/services");
/**
 * Get specialItems from the web app table.
 * @param headers Request headers.
 * @param session Session object.
 * @returns A Promise of AxiosUtilsResponse<WebAppRowGraphQL<SpecialItem>[]>>.
 */
const getSpecialItems = (headers, session) => {
    return (0, common_1.handlePossibleAxiosErrors)(async () => {
        const { special_product_web_app_table_id } = await (0, services_1.getVariablesByName)(headers, session, ["special_product_web_app_table_id"]);
        const response = await (0, services_1.getWebAppTableRegisters)(session, special_product_web_app_table_id);
        if (response.error) {
            throw new Error(`Ocurrió un error al consultar los items especiales: ${response.userMsg}`);
        }
        const specialItems = response.data ?? [];
        return specialItems;
    });
};
exports.getSpecialItems = getSpecialItems;
/**
 * Create a specialItem in the web app table.
 * @param headers Request headers.
 * @param session Session object.
 * @param body SpecialItem data to be created.
 * @returns A Promise of AxiosUtilsResponse<WebAppTableUpdateResponse>.
 */
const createSpecialItem = (headers, session, body) => {
    return (0, common_1.handlePossibleAxiosErrors)(async () => {
        const { special_product_web_app_table_id } = await (0, services_1.getVariablesByName)(headers, session, ["special_product_web_app_table_id"]);
        const response = await (0, services_1.createWebAppTableRegister)(headers, special_product_web_app_table_id, body);
        return response;
    });
};
exports.createSpecialItem = createSpecialItem;
/**
 * Delete a specialItem from the web app table.
 * @param headers Request headers.
 * @param session Session object.
 * @param id ID of the specialItem to be deleted.
 * @returns A Promise of AxiosUtilsResponse<WebAppTableUpdateResponse>.
 */
const deleteSpecialItem = (headers, session, id) => {
    return (0, common_1.handlePossibleAxiosErrors)(async () => {
        const { special_product_web_app_table_id } = await (0, services_1.getVariablesByName)(headers, session, ["special_product_web_app_table_id"]);
        const response = await (0, services_1.deleteWebAppTableRegister)(headers, special_product_web_app_table_id, Number(id));
        return response;
    });
};
exports.deleteSpecialItem = deleteSpecialItem;
/**
 * Update a specialItem in the web app table.
 * @param headers Request headers.
 * @param session Session object.
 * @param id ID of the specialItem to be updated.
 * @param body Updated specialItem data.
 * @returns A Promise of AxiosUtilsResponse<WebAppTableUpdateResponse>.
 */
const updateSpecialItem = (headers, session, id, body) => {
    return (0, common_1.handlePossibleAxiosErrors)(async () => {
        const { special_product_web_app_table_id } = await (0, services_1.getVariablesByName)(headers, session, ["special_product_web_app_table_id"]);
        const response = await (0, services_1.updateWebAppTableRegister)(headers, special_product_web_app_table_id, Number(id), body);
        return response;
    });
};
exports.updateSpecialItem = updateSpecialItem;
