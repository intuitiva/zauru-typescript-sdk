import type { Session } from "@remix-run/node";
import { AxiosUtilsResponse, WebAppRowGraphQL, WebAppTableCreateBody, WebAppTableGraphQL, WebAppTableUpdateResponse } from "@zauru-sdk/types";
/**
 * getWebAppRow
 * @param headers
 * @returns
 */
export declare function getWebAppRow<T>(session: Session, id: number): Promise<AxiosUtilsResponse<T>>;
/**
 * getWebAppTableRegisters Function for get all web app table registers
 * @param headers
 * @param webapp_table_id web app table id
 * @returns
 */
export declare function getWebAppTableRegisters<T>(session: Session, webapp_table_id: string): Promise<AxiosUtilsResponse<WebAppRowGraphQL<T>[]>>;
/**
 * deleteWebAppTableRegister Function for delete a web app table register
 * @param headers
 * @param id_web_app_table
 * @param id_register
 * @returns
 */
export declare function deleteWebAppTableRegister(headers: any, id_web_app_table: string, id_register: number): Promise<WebAppTableUpdateResponse>;
/**
 * createWebAppTableRegister function for create a new web app table register
 * @param headers
 * @param body
 * @param id_web_app_table
 * @returns
 */
export declare function createWebAppTableRegister<T>(headers: any, id_web_app_table: string, body: T, extraBody?: {
    temp_purchase_order_id: string;
}): Promise<WebAppTableUpdateResponse>;
/**
 * updateWebAppTableRegister Function for update a web app table register
 * @param headers
 * @param id_web_app_table
 * @param id_register
 * @returns
 */
export declare function updateWebAppTableRegister<T>(headers: any, id_web_app_table: string, id_register: number | string, body: Partial<T>): Promise<WebAppTableUpdateResponse>;
/**
 *
 * @param headers
 * @param body
 * @returns
 */
export declare function createWebAppTable(headers: any, body: WebAppTableCreateBody): Promise<AxiosUtilsResponse<WebAppTableGraphQL>>;
