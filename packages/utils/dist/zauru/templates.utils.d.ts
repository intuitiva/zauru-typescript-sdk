import type { Session } from "@remix-run/node";
import { AxiosUtilsResponse, WebAppRowGraphQL, Template, WebAppTableUpdateResponse, HistoryTemplate } from "@zauru-sdk/types";
/**
 * Get templates from the web app table.
 * @param headers Request headers.
 * @param session Session object.
 * @returns A Promise of AxiosUtilsResponse<TemplateWebAppTable[]>.
 */
export declare function getTemplates(headers: any, session: Session): Promise<AxiosUtilsResponse<WebAppRowGraphQL<Template>[]>>;
/**
 * Create a template in the web app table.
 * @param headers Request headers.
 * @param session Session object.
 * @param body Template data to be created.
 * @returns A Promise of AxiosUtilsResponse<WebAppTableUpdateResponse>.
 */
export declare function createTemplate(headers: any, session: Session, body: Template): Promise<AxiosUtilsResponse<WebAppTableUpdateResponse>>;
/**
 * Delete a template from the web app table.
 * @param headers Request headers.
 * @param session Session object.
 * @param id ID of the template to be deleted.
 * @returns A Promise of AxiosUtilsResponse<WebAppTableUpdateResponse>.
 */
export declare function deleteTemplate(headers: any, session: Session, id: string): Promise<AxiosUtilsResponse<WebAppTableUpdateResponse>>;
/**
 * Update a template in the web app table.
 * @param headers Request headers.
 * @param session Session object.
 * @param id ID of the template to be updated.
 * @param body Updated template data.
 * @returns A Promise of AxiosUtilsResponse<WebAppTableUpdateResponse>.
 */
export declare function updateTemplate(headers: any, session: Session, id: string, body: Partial<Template>): Promise<AxiosUtilsResponse<WebAppTableUpdateResponse>>;
/**
 * Create a template history entry in the web app table.
 * @param headers Request headers.
 * @param session Session object.
 * @param body Template history data to be created.
 * @returns A Promise of AxiosUtilsResponse<WebAppTableUpdateResponse>.
 */
export declare function createTemplateHistory(headers: any, session: Session, body: Partial<HistoryTemplate>): Promise<AxiosUtilsResponse<WebAppTableUpdateResponse>>;
/**
 * Get template history entries from the web app table.
 * @param headers Request headers.
 * @param session Session object.
 * @returns A Promise of AxiosUtilsResponse<TemplateHistoryWebAppTable[]>.
 */
export declare function getTemplatesHistory(headers: any, session: Session): Promise<AxiosUtilsResponse<WebAppRowGraphQL<HistoryTemplate>[]>>;
