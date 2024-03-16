import type { Session } from "@remix-run/node";
import { AxiosUtilsResponse, WebAppTableUpdateResponse, BitacoraPOMassive, WebAppRowGraphQL } from "@zauru-sdk/types";
/**
 * Get saveBitacoraPOMassive from the web app table.
 * @param headers Request headers.
 * @param session Session object.
 * @returns A Promise of AxiosUtilsResponse<WebAppRowGraphQL<BitacoraPOMassive>[]>.
 */
export declare function saveBitacoraPOMassive(headers: any, session: Session, body: BitacoraPOMassive): Promise<AxiosUtilsResponse<WebAppTableUpdateResponse>>;
/**
 * Get getBitacorasPOMassive from the web app table.
 * @param headers Request headers.
 * @param session Session object.
 * @returns A Promise of AxiosUtilsResponse<WebAppRowGraphQL<BitacoraPOMassive>[]>.
 */
export declare function getBitacorasPOMassive(headers: any, session: Session): Promise<AxiosUtilsResponse<WebAppRowGraphQL<BitacoraPOMassive>[]>>;
/**
 * Put updateBitacorasPOMassive from the web app table.
 * @param headers Request headers.
 * @param session Session object.
 * @returns A Promise of AxiosUtilsResponse<BitacorasPOMassiveWebAppTable[]>.
 */
export declare function updateBitacorasPOMassive(headers: any, session: Session, body: BitacoraPOMassive, id_registro: string | number): Promise<AxiosUtilsResponse<WebAppTableUpdateResponse>>;
