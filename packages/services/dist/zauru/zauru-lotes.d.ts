import type { Session } from "@remix-run/node";
import { AxiosUtilsResponse, ItemAssociatedLots, LotGraphQL, LotStockGraphQL, LoteDescription, LoteProcesadoSchema, LoteSchema, LoteWithPurchaseFormatedSchema, ObjectKeyString, PurchasesDataTableListFormatedSchema, UpdateLoteBody } from "@zauru-sdk/types";
/**
 * getBasketsLots
 * @param headers
 * @param session
 * @returns
 */
export declare const getBasketsLots: (headers: any, session: Session) => Promise<AxiosUtilsResponse<ItemAssociatedLots>>;
/**
 *
 * @param headers
 * @param lot_id
 * @param lot_name
 * @returns
 */
export declare const retenerLote: (headers: any, session: Session, lot_id: string, lot_name: string) => Promise<{
    Nombre: string;
}>;
/**
 *
 * @param headers
 * @param lot_id
 * @param lot_name
 * @returns
 */
export declare const liberarLote: (headers: any, session: Session, lot_id: string, lot_name: string) => Promise<{
    Nombre: string;
}>;
/**
 * getLote Function for get all details of the current lote
 * @param headers
 * @param agency_id
 * @returns
 */
export declare function getLote(headers: any, lot_id: number | string, agency_id?: string): Promise<LoteDescription>;
/**
 * getLoteByName
 * @param headers
 * @param lot_name
 * @returns
 */
export declare function getLoteByName(session: Session, lot_name: string): Promise<AxiosUtilsResponse<LotGraphQL>>;
/**
 * getMyAgencyLotStocks
 * @param session
 * @returns
 */
export declare function getMyAgencyLotStocks(session: Session): Promise<AxiosUtilsResponse<LotStockGraphQL[]>>;
/**
 * getLote Function for get all details of the current lote
 * @param headers
 * @param agency_id
 * @returns
 */
export declare function updateLote(headers: any, lot_id: number, updatedData: UpdateLoteBody): Promise<any>;
/**
 * getLotesExportJSON Function for get all zauru lotes by id_agencia
 * @param headers
 * @param agency_id
 * @returns
 */
export declare function getLotesExportJSON(headers: any, agency_id: string, desde?: string, hasta?: string): Promise<LoteSchema[]>;
/**
 *
 * @param headers
 * @param agency_id
 * @param baskets
 * @param basket_id
 * @returns
 */
export declare function getLotesFiltered(headers: any, agency_id: string, baskets?: boolean, basket_id?: number): Promise<LoteSchema[]>;
/**
 *
 * @param headers
 * @param agency_id
 * @param basket_id
 * @param orders
 * @param desde
 * @param hasta
 * @returns
 */
export declare function getLotesWithPurchaseFormated(headers: any, agency_id: string, basket_id: number, orders: ObjectKeyString<PurchasesDataTableListFormatedSchema>, desde?: string, hasta?: string): Promise<AxiosUtilsResponse<LoteWithPurchaseFormatedSchema[]>>;
export declare function getLotesProcesados(headers: any, agency_id: string): Promise<LoteProcesadoSchema[]>;
/**
 *
 * @param headers
 * @param lot_id
 * @returns
 */
export declare const inactivarLote: (headers: any, lot_id: string | number) => Promise<AxiosUtilsResponse<boolean>>;
