import type { Session } from "@remix-run/node";
import type { GetWebAppRowsByTableIdOptions } from "@zauru-sdk/graphql";
import { AxiosUtilsResponse, WebAppTableUpdateResponse, BitacoraPOMassive, WebAppRowGraphQL } from "@zauru-sdk/types";
/**
 * Get saveBitacoraPOMassive from the web app table.
 * @param headers Request headers.
 * @param session Session object.
 * @returns A Promise of AxiosUtilsResponse<WebAppTableUpdateResponse>.
 */
export declare const saveBitacoraPOMassive: (headers: any, session: Session, body: BitacoraPOMassive) => Promise<AxiosUtilsResponse<WebAppTableUpdateResponse>>;
/**
 * Get getBitacorasPOMassive from the web app table.
 * @param headers Request headers.
 * @param session Session object.
 * @param options Optional JSON `data` filters, `createdAt` range and row limit. Defaults to the last 1000 rows.
 * @returns A Promise of AxiosUtilsResponse<WebAppRowGraphQL<BitacoraPOMassive>[]>.
 */
export declare const getBitacorasPOMassive: (headers: any, session: Session, options?: GetWebAppRowsByTableIdOptions) => Promise<AxiosUtilsResponse<WebAppRowGraphQL<BitacoraPOMassive>[]>>;
/**
 * Put updateBitacorasPOMassive from the web app table.
 * @param headers Request headers.
 * @param session Session object.
 * @returns A Promise of AxiosUtilsResponse<BitacorasPOMassiveWebAppTable[]>.
 */
export declare const updateBitacorasPOMassive: (headers: any, session: Session, body: BitacoraPOMassive, id_registro: string | number) => Promise<AxiosUtilsResponse<WebAppTableUpdateResponse>>;
