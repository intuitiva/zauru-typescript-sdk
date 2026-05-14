import type { Session } from "@remix-run/node";
import { AxiosUtilsResponse, SpecialItem, WebAppRowGraphQL, WebAppTableUpdateResponse } from "@zauru-sdk/types";
/**
 * Get specialItems from the web app table.
 * @param headers Request headers.
 * @param session Session object.
 * @returns A Promise of AxiosUtilsResponse<WebAppRowGraphQL<SpecialItem>[]>>.
 */
export declare const getSpecialItems: (headers: any, session: Session) => Promise<AxiosUtilsResponse<WebAppRowGraphQL<SpecialItem>[]>>;
/**
 * Create a specialItem in the web app table.
 * @param headers Request headers.
 * @param session Session object.
 * @param body SpecialItem data to be created.
 * @returns A Promise of AxiosUtilsResponse<WebAppTableUpdateResponse>.
 */
export declare const createSpecialItem: (headers: any, session: Session, body: SpecialItem) => Promise<AxiosUtilsResponse<WebAppTableUpdateResponse>>;
/**
 * Delete a specialItem from the web app table.
 * @param headers Request headers.
 * @param session Session object.
 * @param id ID of the specialItem to be deleted.
 * @returns A Promise of AxiosUtilsResponse<WebAppTableUpdateResponse>.
 */
export declare const deleteSpecialItem: (headers: any, session: Session, id: string) => Promise<AxiosUtilsResponse<WebAppTableUpdateResponse>>;
/**
 * Update a specialItem in the web app table.
 * @param headers Request headers.
 * @param session Session object.
 * @param id ID of the specialItem to be updated.
 * @param body Updated specialItem data.
 * @returns A Promise of AxiosUtilsResponse<WebAppTableUpdateResponse>.
 */
export declare const updateSpecialItem: (headers: any, session: Session, id: string, body: Partial<SpecialItem>) => Promise<AxiosUtilsResponse<WebAppTableUpdateResponse>>;
