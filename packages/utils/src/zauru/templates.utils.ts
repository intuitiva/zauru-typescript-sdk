import type { Session } from "@remix-run/node";
import { handlePossibleAxiosErrors } from "@zauru-sdk/common";
import {
  createWebAppTableRegister,
  deleteWebAppTableRegister,
  getVariablesByName,
  getWebAppTableRegisters,
  updateWebAppTableRegister,
} from "@zauru-sdk/services";
import {
  AxiosUtilsResponse,
  WebAppRowGraphQL,
  Template,
  WebAppTableUpdateResponse,
  HistoryTemplate,
} from "@zauru-sdk/types";

/**
 * Get templates from the web app table.
 * @param headers Request headers.
 * @param session Session object.
 * @returns A Promise of AxiosUtilsResponse<TemplateWebAppTable[]>.
 */
export const getTemplates = (
  headers: any,
  session: Session
): Promise<AxiosUtilsResponse<WebAppRowGraphQL<Template>[]>> => {
  return handlePossibleAxiosErrors(async () => {
    const { templates_web_app_table_id } = await getVariablesByName(
      headers,
      session,
      ["templates_web_app_table_id"]
    );

    const response = await getWebAppTableRegisters<Template>(
      session,
      templates_web_app_table_id
    );

    if (response.error) {
      throw new Error(
        `Ocurrió un error al intentar obtener los templates: ${response.userMsg}`
      );
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
export const createTemplate = (
  headers: any,
  session: Session,
  body: Template
): Promise<AxiosUtilsResponse<WebAppTableUpdateResponse>> => {
  return handlePossibleAxiosErrors(async () => {
    const { templates_web_app_table_id } = await getVariablesByName(
      headers,
      session,
      ["templates_web_app_table_id"]
    );
    const response = await createWebAppTableRegister<Template>(
      headers,
      templates_web_app_table_id,
      body
    );
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
export const deleteTemplate = (
  headers: any,
  session: Session,
  id: string
): Promise<AxiosUtilsResponse<WebAppTableUpdateResponse>> => {
  return handlePossibleAxiosErrors(async () => {
    const { templates_web_app_table_id } = await getVariablesByName(
      headers,
      session,
      ["templates_web_app_table_id"]
    );

    const response = await deleteWebAppTableRegister(
      headers,
      templates_web_app_table_id,
      Number(id)
    );
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
export const updateTemplate = (
  headers: any,
  session: Session,
  id: string,
  body: Partial<Template>
): Promise<AxiosUtilsResponse<WebAppTableUpdateResponse>> => {
  return handlePossibleAxiosErrors(async () => {
    const { templates_web_app_table_id } = await getVariablesByName(
      headers,
      session,
      ["templates_web_app_table_id"]
    );

    const response = await updateWebAppTableRegister(
      headers,
      templates_web_app_table_id,
      Number(id),
      body
    );

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
export const createTemplateHistory = (
  headers: any,
  session: Session,
  body: Partial<HistoryTemplate>
): Promise<AxiosUtilsResponse<WebAppTableUpdateResponse>> => {
  return handlePossibleAxiosErrors(async () => {
    const { history_templates_web_app_table_id } = await getVariablesByName(
      headers,
      session,
      ["history_templates_web_app_table_id"]
    );

    const response = await createWebAppTableRegister<Partial<HistoryTemplate>>(
      headers,
      history_templates_web_app_table_id,
      body
    );

    return response;
  });
};

/**
 * Get template history entries from the web app table.
 * @param headers Request headers.
 * @param session Session object.
 * @returns A Promise of AxiosUtilsResponse<TemplateHistoryWebAppTable[]>.
 */
export const getTemplatesHistory = (
  headers: any,
  session: Session
): Promise<AxiosUtilsResponse<WebAppRowGraphQL<HistoryTemplate>[]>> => {
  return handlePossibleAxiosErrors(async () => {
    const { history_templates_web_app_table_id } = await getVariablesByName(
      headers,
      session,
      ["history_templates_web_app_table_id"]
    );
    const response = await getWebAppTableRegisters<HistoryTemplate>(
      session,
      history_templates_web_app_table_id
    );

    if (response.error) {
      throw new Error(
        `Ocurrió un error al intentar obtener los history templates: ${response.userMsg}`
      );
    }

    const templateRegisters = response.data ?? [];

    return templateRegisters;
  });
};
