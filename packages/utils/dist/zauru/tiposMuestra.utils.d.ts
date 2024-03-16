import type { Session } from "@remix-run/node";
import { WebAppRowGraphQL, TipoMuestra, AxiosUtilsResponse, WebAppTableUpdateResponse } from "@zauru-sdk/types";
/**
 * Get tipoMuestras from the web app table.
 * @param headers Request headers.
 * @param session Session object.
 * @returns A Promise of AxiosUtilsResponse<WebAppRowGraphQL<TipoMuestra>[]>>.
 */
export declare function getTipoMuestras(headers: any, session: Session): Promise<AxiosUtilsResponse<WebAppRowGraphQL<TipoMuestra>[]>>;
/**
 * Create a tipoMuestra in the web app table.
 * @param headers Request headers.
 * @param session Session object.
 * @param body TipoMuestra data to be created.
 * @returns A Promise of AxiosUtilsResponse<WebAppTableUpdateResponse>.
 */
export declare function createTipoMuestra(headers: any, session: Session, body: TipoMuestra): Promise<AxiosUtilsResponse<WebAppTableUpdateResponse>>;
/**
 * Delete a tipoMuestra from the web app table.
 * @param headers Request headers.
 * @param session Session object.
 * @param id ID of the tipoMuestra to be deleted.
 * @returns A Promise of AxiosUtilsResponse<WebAppTableUpdateResponse>.
 */
export declare function deleteTipoMuestra(headers: any, session: Session, id: string): Promise<AxiosUtilsResponse<WebAppTableUpdateResponse>>;
/**
 * Update a tipoMuestra in the web app table.
 * @param headers Request headers.
 * @param session Session object.
 * @param id ID of the tipoMuestra to be updated.
 * @param body Updated tipoMuestra data.
 * @returns A Promise of AxiosUtilsResponse<WebAppTableUpdateResponse>.
 */
export declare function updateTipoMuestra(headers: any, session: Session, id: string, body: Partial<TipoMuestra>): Promise<AxiosUtilsResponse<WebAppTableUpdateResponse>>;
