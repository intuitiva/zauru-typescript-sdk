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
export declare const markAsReceivePurchaseOrder: (headers: any, body: Partial<PurchaseOrderGraphQL> & {
    fechaVencimiento?: string;
}) => Promise<AxiosUtilsResponse<boolean>>;
/**
 *
 * @param headers
 * @param body
 * @returns
 */
export declare const createNewPurchaseOrder: (headers: any, body: Partial<PurchaseOrderGraphQL>) => Promise<AxiosUtilsResponse<PurchaseOrderGraphQL>>;
/**
 *
 * @param headers
 * @param body
 * @returns
 */
export declare const createNewAuthorizedPurchaseOrder: (headers: any, body: CreateNewPurchaseOrderBody, withReceive?: boolean) => Promise<AxiosUtilsResponse<PurchaseOrderGraphQL>>;
/**
 * receiveLotPurchaseOrder
 * @param headers
 * @param body
 * @returns
 */
export declare const receiveLotPurchaseOrder: (headers: any, body: PurchaseOrderGraphQL & {
    fechaVencimiento: string;
}) => Promise<AxiosUtilsResponse<boolean>>;
/**
 * receivePurchaseOrder
 * @param headers
 * @param body
 * @returns
 */
export declare const receivePurchaseOrder: (headers: any, body: PurchaseOrderGraphQL) => Promise<AxiosUtilsResponse<boolean>>;
/**
 *
 * @param headers
 * @returns
 */
export declare const getNewPurchaseOrderInfo: (headers: any) => Promise<AxiosUtilsResponse<NewPurchaseOrderResponse>>;
/**
 * getPurchasesListDataTables Function for get all zauru orden-compras
 * @param headers
 * @returns
 */
export declare const getPurchasesListDataTables: (headers: any, body: DataTablesFilterBody) => Promise<AxiosUtilsResponse<PurchasesListResponseSchema<HTMLPurchasesListSchema>>>;
/**
 * getPurchasesList Function for get all zauru orden-compras
 * @param headers
 * @param params
 * @returns
 */
export declare const getPurchasesList: (headers: any, session: Session, params?: {
    fechaInicio?: string;
    fechaFin?: string;
    item?: string | number;
    payeeCategory?: string | number;
    agency_id?: string | number;
}, config?: {
    fromProduction?: boolean;
}) => Promise<AxiosUtilsResponse<PurchaseOrderGraphQL[]>>;
/**
 * getPurchase Function for get an especific purchase order
 * @param headers
 * @returns
 */
export declare const getPurchase: (headers: any, purchase_order_id: number | string) => Promise<AxiosUtilsResponse<PurchaseOrderGraphQL & {
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
export declare const enablePurchase: (headers: any, purchase_order_id: number, reception_id: number) => Promise<AxiosUtilsResponse<any>>;
/**
 * updatePurchaseOrder
 * @param headers
 * @param body
 * @param purchase_order_id
 * @returns
 */
export declare const updatePurchaseOrder: (headers: any, body: UpdatePurchaseOrderBody, purchase_order_id: number) => Promise<AxiosUtilsResponse<any>>;
/**
 * updatePurchaseOrder
 * @param headers
 * @param body
 * @param purchase_order_id
 * @returns
 */
export declare const updateReceivedPurchaseOrder: (headers: any, body: UpdatePurchaseOrderBody, purchase_order_id: number) => Promise<AxiosUtilsResponse<any>>;
/**
 * getLast100Receptions
 * @param headers
 * @returns
 */
export declare const getLast100Receptions: (session: Session, agency_id?: number | string) => Promise<AxiosUtilsResponse<PurchaseOrderGraphQL[]>>;
/**
 * getPurchaseOrder
 * @param headers
 * @returns
 */
export declare const getPurchaseOrder: (session: Session, poId: string | number, config?: {
    withLotStocksToMyAgency: boolean;
}) => Promise<AxiosUtilsResponse<PurchaseOrderGraphQL>>;
/**
 * getPurchaseOrder
 * @param headers
 * @returns
 */
export declare const getGraphQLPurchaseOrderBetweenDates: (session: Session, dates: {
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
    betweenIssueDate?: boolean;
}) => Promise<AxiosUtilsResponse<PurchaseOrderGraphQL[]>>;
/**
 * deletePurchaseOrder
 * @param headers
 * @param id
 * @returns
 */
export declare const deletePurchaseOrder: (headers: any, id: string | number) => Promise<AxiosUtilsResponse<boolean>>;
/**
 * getPurchaseOrderByIdNumber
 * @param session
 * @param idNumber
 * @returns
 */
export declare const getPurchasesOrderByIdNumber: (session: Session, id_number: string) => Promise<AxiosUtilsResponse<PurchaseOrderGraphQL[]>>;
