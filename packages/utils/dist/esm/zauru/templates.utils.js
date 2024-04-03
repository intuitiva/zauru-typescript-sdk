import { handlePossibleAxiosErrors } from "@zauru-sdk/common";
import { createWebAppTableRegister, deleteWebAppTableRegister, getVariablesByName, getWebAppTableRegisters, updateWebAppTableRegister, } from "@zauru-sdk/services";
/**
 * Get templates from the web app table.
 * @param headers Request headers.
 * @param session Session object.
 * @returns A Promise of AxiosUtilsResponse<TemplateWebAppTable[]>.
 */
export const getTemplates = (headers, session) => {
    return handlePossibleAxiosErrors(async () => {
        const { templates_web_app_table_id } = await getVariablesByName(headers, session, ["templates_web_app_table_id"]);
        const response = await getWebAppTableRegisters(session, templates_web_app_table_id);
        if (response.error) {
            throw new Error(`Ocurrió un error al intentar obtener los templates: ${response.userMsg}`);
        }
        const templateRegisters = response.data ?? [];
        return templateRegisters;
    });
};
/**
 * Create a template in the web app table.
 * @param headers Request headers.
 * @param session Session object.
 * @param body Template data to be created.
 * @returns A Promise of AxiosUtilsResponse<WebAppTableUpdateResponse>.
 */
export const createTemplate = (headers, session, body) => {
    return handlePossibleAxiosErrors(async () => {
        const { templates_web_app_table_id } = await getVariablesByName(headers, session, ["templates_web_app_table_id"]);
        const response = await createWebAppTableRegister(headers, templates_web_app_table_id, body);
        return response;
    });
};
/**
 * Delete a template from the web app table.
 * @param headers Request headers.
 * @param session Session object.
 * @param id ID of the template to be deleted.
 * @returns A Promise of AxiosUtilsResponse<WebAppTableUpdateResponse>.
 */
export const deleteTemplate = (headers, session, id) => {
    return handlePossibleAxiosErrors(async () => {
        const { templates_web_app_table_id } = await getVariablesByName(headers, session, ["templates_web_app_table_id"]);
        const response = await deleteWebAppTableRegister(headers, templates_web_app_table_id, Number(id));
        return response;
    });
};
/**
 * Update a template in the web app table.
 * @param headers Request headers.
 * @param session Session object.
 * @param id ID of the template to be updated.
 * @param body Updated template data.
 * @returns A Promise of AxiosUtilsResponse<WebAppTableUpdateResponse>.
 */
export const updateTemplate = (headers, session, id, body) => {
    return handlePossibleAxiosErrors(async () => {
        const { templates_web_app_table_id } = await getVariablesByName(headers, session, ["templates_web_app_table_id"]);
        const response = await updateWebAppTableRegister(headers, templates_web_app_table_id, Number(id), body);
        return response;
    });
};
/**
 * Create a template history entry in the web app table.
 * @param headers Request headers.
 * @param session Session object.
 * @param body Template history data to be created.
 * @returns A Promise of AxiosUtilsResponse<WebAppTableUpdateResponse>.
 */
export const createTemplateHistory = (headers, session, body) => {
    return handlePossibleAxiosErrors(async () => {
        const { history_templates_web_app_table_id } = await getVariablesByName(headers, session, ["history_templates_web_app_table_id"]);
        const response = await createWebAppTableRegister(headers, history_templates_web_app_table_id, body);
        return response;
    });
};
/**
 * Get template history entries from the web app table.
 * @param headers Request headers.
 * @param session Session object.
 * @returns A Promise of AxiosUtilsResponse<TemplateHistoryWebAppTable[]>.
 */
export const getTemplatesHistory = (headers, session) => {
    return handlePossibleAxiosErrors(async () => {
        const { history_templates_web_app_table_id } = await getVariablesByName(headers, session, ["history_templates_web_app_table_id"]);
        const response = await getWebAppTableRegisters(session, history_templates_web_app_table_id);
        if (response.error) {
            throw new Error(`Ocurrió un error al intentar obtener los history templates: ${response.userMsg}`);
        }
        const templateRegisters = response.data ?? [];
        return templateRegisters;
    });
};
