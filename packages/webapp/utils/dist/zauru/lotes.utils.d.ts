import type { Session } from "@remix-run/node";
/**
 * Obtiene el listado de ordenes de compra, formateado especialmente para armar la tabla de edición de porcentajes de rechazo
 * @param headers
 * @param session
 * @returns
 */
export declare const getLotesFormated: (headers: any, session: Session) => Promise<import("@zauru-sdk/webapp-types").LoteSchema[]>;
/**
 * Obtiene toda la información de lote, con las canastas y razones de rechazo
 * @param headers
 * @param session
 * @returns
 */
export declare const getLoteDescription: (headers: any, session: Session, lote_id: number) => Promise<{
    lote: import("@zauru-sdk/webapp-types").LoteDescription;
    purchase_order: import("@zauru-sdk/webapp-types").PurchasesDataTableListFormatedSchema;
    purchase: (import("@zauru-sdk/webapp-types").PurchaseOrderGraphQL & {
        baskets_memo: import("@zauru-sdk/webapp-types").BasketSchema[];
        baskets_memo_quantity: number;
    }) | undefined;
}>;
