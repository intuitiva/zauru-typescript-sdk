import type { Session } from "@remix-run/node";
import { AxiosUtilsResponse, LoteWithPurchaseFormatedSchema, PurchaseOrderGraphQL, PurchasesDataTableListFormatedSchema, PurchasesListResponseSchema } from "@zauru-sdk/types";
/**
 * Obtiene el listado de ordenes de compra, formateado especialmente para armar la tabla de edición de porcentajes y tolerancia
 * @param headers
 * @param session
 * @returns
 */
export declare const getPurchasesDataTableListFormated: (headers: any, session: Session, params: {
    page: string | null;
    perPage: string | null;
    search: string | null;
    from_production_agency_id?: boolean;
}) => Promise<AxiosUtilsResponse<PurchasesListResponseSchema<LoteWithPurchaseFormatedSchema>>>;
/**
 * getPurchaseOrderDataTables Obtiene una orden de compra ya formateada con todos sus campos.
 * @param headers
 * @param tag_id
 * @param agency_id
 * @param search
 * @returns
 */
export declare const getPurchaseOrderDataTables: (headers: any, search: string, tag_id?: string, agency_id?: string) => Promise<PurchasesDataTableListFormatedSchema>;
/**
 * updatePurchaseItemPrice
 * @param headers
 * @param data
 * @param purchase_id
 */
export declare const updatePurchaseItemPrice: (headers: any, data: {
    purchase_order_details_attributes: Record<string, {
        unit_cost: number;
        item_id: number;
        id: number;
    }>;
}, purchase_id: number) => Promise<AxiosUtilsResponse<boolean>>;
/**
 * updateOchAndDis
 * @param headers
 * @param session
 * @returns
 */
export declare const updateOchAndDis: (headers: any, data: {
    discount?: number | string;
    other_charges?: number | string;
}, purchase_id: number) => Promise<AxiosUtilsResponse<boolean>>;
/**
 * Obtengo los id's de las órdenes de compra en un arreglo numérico
 * @param headers
 * @param session
 * @param extraParams
 * @returns
 */
export declare const getOrderIDS: (headers: any, session: Session, extraParams: {
    vendor?: string;
    vendor_category?: string;
    item?: string;
    desde?: string;
    hasta?: string;
}) => Promise<AxiosUtilsResponse<number[]>>;
/**
 * deleteOrder
 * @returns
 */
export declare const deletePurchaseOrderProcess: (headers: any, session: Session, id: string | number) => Promise<AxiosUtilsResponse<boolean>>;
/**
 * updatePurchaseOrderReception
 * @param headers
 * @param data
 * @param purchase_id
 * @returns
 */
export declare const updatePurchaseOrderReception: (headers: any, data: {
    payee_id?: string;
    purchase_order_details_attributes: Record<string, {
        item_id: number;
        id: number;
    }>;
}, purchase_id: number) => Promise<AxiosUtilsResponse<boolean>>;
export type TaskSchema = {
    timeStamp: number;
    iniciada: string;
    total_ordenes: number;
    completadas: number;
};
/**
 * Commitea una task iniciada para la pantalla de edición masiva de órdenes de compra
 * @param session
 * @param ordenes
 * @param timeStamp
 */
export declare const commitTask: (session: Session, ordenes: Array<number>, timeStamp: number) => Promise<void>;
/**
 * Comitea una task finalizada para la pantalla de edición de órdenes de compra masiva
 * @param session
 * @param timeStamp
 */
export declare const commitEndTask: (session: Session, timeStamp: number) => Promise<void>;
/**
 * Elimina de la sesión una task.
 * @param session
 * @param timeStamp
 */
export declare const deleteTask: (session: Session, timeStamp: number) => Promise<boolean>;
/**
 * createNewLabItemRequest
 * @param headers
 * @param session
 * @param body
 * @returns
 */
export declare const createNewLabItemRequest: (headers: any, session: Session, body: Partial<PurchaseOrderGraphQL> & {
    [key: string]: any;
}) => Promise<AxiosUtilsResponse<PurchaseOrderGraphQL>>;
