import type { Session } from "@remix-run/node";
import { SpecialItem, WebAppRowGraphQL, RowDataType, AxiosUtilsResponse, PurchaseOrderCosto, BitacoraCostosItems, WebAppTableUpdateResponse } from "@zauru-sdk/types";
/**
 *
 * @param headers
 * @param session
 * @param configuration
 * @param specialItems
 */
export declare const guardarConfiguracionProductosEspeciales: (headers: any, session: Session, configuration: (RowDataType & SpecialItem)[], specialItems?: WebAppRowGraphQL<SpecialItem>[]) => Promise<AxiosUtilsResponse<boolean>>;
/**
 *
 * @returns
 */
export declare const obtenerSemanaAnterior: () => {
    fechaInicio: string;
    fechaFin: string;
    label: string;
    getDay: (dayIndex: number) => string;
};
/**
 * updateOneItemPrice
 * @param headers
 * @param session
 * @param body
 * @returns
 */
export declare function updateOneItemPrice(headers: any, session: Session, body: {
    fechaInicio: string;
    fechaFin: string;
    item: number;
    price: number;
}): Promise<AxiosUtilsResponse<any>>;
/**
 * changePricesInit
 * @param headers
 * @param session
 * @param specialItems
 * @param body
 * @returns
 */
export declare function changePricesInit(headers: any, session: Session, specialItems: WebAppRowGraphQL<SpecialItem>[], body: BitacoraCostosItems): Promise<AxiosUtilsResponse<WebAppTableUpdateResponse>>;
/**
 * changePrice
 * @param headers
 * @param session
 * @param body
 * @returns
 */
export declare function changePrice(headers: any, costo: PurchaseOrderCosto): Promise<PurchaseOrderCosto>;
/**
 * changePrices
 * @param headers
 * @param session
 * @param body
 * @returns
 */
export declare function changePrices(headers: any, session: Session, bitacora: BitacoraCostosItems, id_bitacora: string): Promise<AxiosUtilsResponse<any>>;
/**
 * corregirCostos
 * @param headers
 * @param session
 * @param costos
 * @returns
 */
export declare function corregirCostos(headers: any, session: Session, costos: PurchaseOrderCosto[], costosEspeciales: PurchaseOrderCosto[]): Promise<AxiosUtilsResponse<WebAppTableUpdateResponse>>;
/**
 * Get saveBitacoraCostos from the web app table.
 * @param headers Request headers.
 * @param session Session object.
 * @returns A Promise of AxiosUtilsResponse<WebAppRowGraphQL<BitacoraCostosItems>[]>.
 */
export declare function saveBitacoraCostos(headers: any, session: Session, body: BitacoraCostosItems): Promise<AxiosUtilsResponse<WebAppTableUpdateResponse>>;
/**
 * Put updateBitacoraCostos from the web app table.
 * @param headers Request headers.
 * @param session Session object.
 * @returns A Promise of AxiosUtilsResponse<WebAppRowGraphQL<BitacoraCostosItems>[]>.
 */
export declare function updateBitacoraCostos(headers: any, session: Session, body: BitacoraCostosItems, id_registro: string | number): Promise<AxiosUtilsResponse<WebAppTableUpdateResponse>>;
/**
 * Get getCostosBitacora from the web app table.
 * @param headers Request headers.
 * @param session Session object.
 * @returns A Promise of AxiosUtilsResponse<WebAppRowGraphQL<BitacoraCostosItems>[]>.
 */
export declare function getCostosBitacora(headers: any, session: Session): Promise<AxiosUtilsResponse<WebAppRowGraphQL<BitacoraCostosItems>[]>>;
