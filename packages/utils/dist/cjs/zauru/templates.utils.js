"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTemplatesHistory = exports.createTemplateHistory = exports.updateTemplate = exports.deleteTemplate = exports.createTemplate = exports.getTemplates = void 0;
const common_1 = require("@zauru-sdk/common");
const services_1 = require("@zauru-sdk/services");
/**
 * Get templates from the web app table.
 * @param headers Request headers.
 * @param session Session object.
 * @returns A Promise of AxiosUtilsResponse<TemplateWebAppTable[]>.
 */
const getTemplates = (headers, session) => {
    return (0, common_1.handlePossibleAxiosErrors)(async () => {
        const { templates_web_app_table_id } = await (0, services_1.getVariablesByName)(headers, session, ["templates_web_app_table_id"]);
        const response = await (0, services_1.getWebAppTableRegisters)(session, templates_web_app_table_id);
        if (response.error) {
            throw new Error(`Ocurrió un error al intentar obtener los templates: ${response.userMsg}`);
        }
        const templateRegisters = response.data ?? [];
        return templateRegisters;
    });
};
exports.getTemplates = getTemplates;
/**
 * Create a template in the web app table.
 * @param headers Request headers.
 * @param session Session object.
 * @param body Template data to be created.
 * @returns A Promise of AxiosUtilsResponse<WebAppTableUpdateResponse>.
 */
const createTemplate = (headers, session, body) => {
    return (0, common_1.handlePossibleAxiosErrors)(async () => {
        const { templates_web_app_table_id } = await (0, services_1.getVariablesByName)(headers, session, ["templates_web_app_table_id"]);
        const response = await (0, services_1.createWebAppTableRegister)(headers, templates_web_app_table_id, body);
        return response;
    });
};
exports.createTemplate = createTemplate;
/**
 * Delete a template from the web app table.
 * @param headers Request headers.
 * @param session Session object.
 * @param id ID of the template to be deleted.
 * @returns A Promise of AxiosUtilsResponse<WebAppTableUpdateResponse>.
 */
const deleteTemplate = (headers, session, id) => {
    return (0, common_1.handlePossibleAxiosErrors)(async () => {
        const { templates_web_app_table_id } = await (0, services_1.getVariablesByName)(headers, session, ["templates_web_app_table_id"]);
        const response = await (0, services_1.deleteWebAppTableRegister)(headers, templates_web_app_table_id, Number(id));
        return response;
    });
};
exports.deleteTemplate = deleteTemplate;
/**
 * Update a template in the web app table.
 * @param headers Request headers.
 * @param session Session object.
 * @param id ID of the template to be updated.
 * @param body Updated template data.
 * @returns A Promise of AxiosUtilsResponse<WebAppTableUpdateResponse>.
 */
const updateTemplate = (headers, session, id, body) => {
    return (0, common_1.handlePossibleAxiosErrors)(async () => {
        const { templates_web_app_table_id } = await (0, services_1.getVariablesByName)(headers, session, ["templates_web_app_table_id"]);
        const response = await (0, services_1.updateWebAppTableRegister)(headers, templates_web_app_table_id, Number(id), body);
        return response;
    });
};
exports.updateTemplate = updateTemplate;
/**
 * Create a template history entry in the web app table.
 * @param headers Request headers.
 * @param session Session object.
 * @param body Template history data to be created.
 * @returns A Promise of AxiosUtilsResponse<WebAppTableUpdateResponse>.
 */
const createTemplateHistory = (headers, session, body) => {
    return (0, common_1.handlePossibleAxiosErrors)(async () => {
        const { history_templates_web_app_table_id } = await (0, services_1.getVariablesByName)(headers, session, ["history_templates_web_app_table_id"]);
        const response = await (0, services_1.createWebAppTableRegister)(headers, history_templates_web_app_table_id, body);
        return response;
    });
};
exports.createTemplateHistory = createTemplateHistory;
/**
 * Get template history entries from the web app table.
 * @param headers Request headers.
 * @param session Session object.
 * @returns A Promise of AxiosUtilsResponse<TemplateHistoryWebAppTable[]>.
 */
const getTemplatesHistory = (headers, session) => {
    return (0, common_1.handlePossibleAxiosErrors)(async () => {
        const { history_templates_web_app_table_id } = await (0, services_1.getVariablesByName)(headers, session, ["history_templates_web_app_table_id"]);
        const response = await (0, services_1.getWebAppTableRegisters)(session, history_templates_web_app_table_id);
        if (response.error) {
            throw new Error(`Ocurrió un error al intentar obtener los history templates: ${response.userMsg}`);
        }
        const templateRegisters = response.data ?? [];
        return templateRegisters;
    });
};
exports.getTemplatesHistory = getTemplatesHistory;
