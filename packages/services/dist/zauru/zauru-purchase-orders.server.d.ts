import type { Session } from "@remix-run/node";
import { AxiosUtilsResponse, BasketSchema, CreateNewPurchaseOrderBody, DataTablesFilterBody, HTMLPurchasesListSchema, NewPurchaseOrderResponse, PurchaseOrderGraphQL, PurchasesListResponseSchema, UpdatePurchaseOrderBody } from "@zauru-sdk/types";
/**
 * markAsReceivePurchaseOrder
 * Esta función sólo se utiliza cuando se van a marcar como recibida toda la órden de compra, se recibe todo lo que se envío
 * si se quiere recibir parcialmente, utilizar el endpoint de /receptions
 * @param headers
 * @param body
 * @returns
 */
export declare function markAsReceivePurchaseOrder(headers: any, body: Partial<PurchaseOrderGraphQL> & {
    fechaVencimiento?: string;
}): Promise<AxiosUtilsResponse<boolean>>;
/**
 * markAsReceivePartialPurchaseOrder
 * @param headers
 * @param body
 * @returns
 */
export declare function markAsReceivePartialPurchaseOrder(headers: any, session: Session, body: Partial<PurchaseOrderGraphQL> & {
    fechaVencimiento?: string;
}): Promise<AxiosUtilsResponse<boolean>>;
/**
 *
 * @param headers
 * @param body
 * @returns
 */
export declare function createNewPurchaseOrder(headers: any, body: Partial<PurchaseOrderGraphQL>): Promise<AxiosUtilsResponse<PurchaseOrderGraphQL>>;
/**
 *
 * @param headers
 * @param body
 * @returns
 */
export declare function createNewAuthorizedPurchaseOrder(headers: any, body: CreateNewPurchaseOrderBody, withReceive?: boolean): Promise<AxiosUtilsResponse<PurchaseOrderGraphQL>>;
/**
 * receiveLotPurchaseOrder
 * @param headers
 * @param body
 * @returns
 */
export declare function receiveLotPurchaseOrder(headers: any, body: PurchaseOrderGraphQL & {
    fechaVencimiento: string;
}): Promise<AxiosUtilsResponse<boolean>>;
/**
 * receivePurchaseOrder
 * @param headers
 * @param body
 * @returns
 */
export declare function receivePurchaseOrder(headers: any, body: PurchaseOrderGraphQL): Promise<AxiosUtilsResponse<boolean>>;
/**
 *
 * @param headers
 * @returns
 */
export declare function getNewPurchaseOrderInfo(headers: any): Promise<AxiosUtilsResponse<NewPurchaseOrderResponse>>;
/**
 * getPurchasesListDataTables Function for get all zauru orden-compras
 * @param headers
 * @returns
 */
export declare function getPurchasesListDataTables(headers: any, body: DataTablesFilterBody): Promise<AxiosUtilsResponse<PurchasesListResponseSchema<HTMLPurchasesListSchema>>>;
/**
 * getPurchasesList Function for get all zauru orden-compras
 * @param headers
 * @param params
 * @returns
 */
export declare function getPurchasesList(headers: any, session: Session, params?: {
    fechaInicio?: string;
    fechaFin?: string;
    item?: string | number;
    payeeCategory?: string | number;
    agency_id?: string | number;
}, config?: {
    fromProduction?: boolean;
}): Promise<AxiosUtilsResponse<PurchaseOrderGraphQL[]>>;
/**
 * getPurchase Function for get an especific purchase order
 * @param headers
 * @returns
 */
export declare function getPurchase(headers: any, purchase_order_id: number | string): Promise<AxiosUtilsResponse<PurchaseOrderGraphQL & {
    baskets_memo: BasketSchema[];
    baskets_memo_quantity: number;
}>>;
/**
 * enablePurchase Enable a purchase order
 * @param headers
 * @param purchase_order_id
 * @param reception_id
 * @returns
 */
export declare function enablePurchase(headers: any, purchase_order_id: number, reception_id: number): Promise<AxiosUtilsResponse<any>>;
/**
 * updatePurchaseOrder
 * @param headers
 * @param body
 * @param purchase_order_id
 * @returns
 */
export declare function updatePurchaseOrder(headers: any, body: UpdatePurchaseOrderBody, purchase_order_id: number): Promise<AxiosUtilsResponse<any>>;
/**
 * updatePurchaseOrder
 * @param headers
 * @param body
 * @param purchase_order_id
 * @returns
 */
export declare function updateReceivedPurchaseOrder(headers: any, body: UpdatePurchaseOrderBody, purchase_order_id: number): Promise<AxiosUtilsResponse<any>>;
/**
 * getLast100Receptions
 * @param headers
 * @returns
 */
export declare function getLast100Receptions(session: Session, agency_id?: number | string): Promise<AxiosUtilsResponse<PurchaseOrderGraphQL[]>>;
/**
 * getPurchaseOrder
 * @param headers
 * @returns
 */
export declare function getPurchaseOrder(session: Session, poId: string | number, config?: {
    withLotStocksToMyAgency: boolean;
}): Promise<AxiosUtilsResponse<PurchaseOrderGraphQL>>;
/**
 * getPurchaseOrder
 * @param headers
 * @returns
 */
export declare function getGraphQLPurchaseOrderBetweenDates(session: Session, dates: {
    startDate: string;
    endDate: string;
}, config?: {
    agencyFilter: boolean;
    agencyId?: number;
    useProductionAgencyId?: boolean;
    consolidateIdFilter?: boolean;
    lotItemIdExclusion?: number;
    poDetailTagId?: number;
    withShipmentToMyAgency?: boolean;
    withLotStocksToMyAgency?: boolean;
    itemId?: number | string;
    payeeCategoryId?: number | string;
}): Promise<AxiosUtilsResponse<PurchaseOrderGraphQL[]>>;
/**
 * deletePurchaseOrder
 * @param headers
 * @param id
 * @returns
 */
export declare function deletePurchaseOrder(headers: any, id: string | number): Promise<AxiosUtilsResponse<boolean>>;
/**
 * getPurchaseOrderByIdNumber
 * @param session
 * @param idNumber
 * @returns
 */
export declare function getPurchasesOrderByIdNumber(session: Session, id_number: string): Promise<AxiosUtilsResponse<PurchaseOrderGraphQL[]>>;
