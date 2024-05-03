import type { Session } from "@remix-run/node";
import { AxiosUtilsResponse, BasketSchema } from "@zauru-sdk/types";
/**
 * Obtiene el listado de ordenes de compra, formateado especialmente para armar la tabla de edición de porcentajes de rechazo
 * @param headers
 * @param session
 * @returns
 */
export declare const getLotesFormated: (headers: any, session: Session) => Promise<import("@zauru-sdk/types").LoteSchema[]>;
/**
 * procesarLote
 * @param headers
 * @param session
 * @param data
 * @param byPercent
 */
export declare const procesarLote: (headers: any, session: Session, data: any, poId: number | string) => Promise<AxiosUtilsResponse<any>>;
/**
 * Obtiene toda la información de lote, con las canastas y razones de rechazo
 * @param headers
 * @param session
 * @returns
 */
export declare const getLoteDescription: (headers: any, session: Session, lote_id: number) => Promise<{
    lote: import("@zauru-sdk/types").LoteDescription;
    purchase_order: import("@zauru-sdk/types").PurchasesDataTableListFormatedSchema;
    purchase: (import("@zauru-sdk/types").PurchaseOrderGraphQL & {
        baskets_memo: BasketSchema[];
        baskets_memo_quantity: number;
    }) | undefined;
}>;
