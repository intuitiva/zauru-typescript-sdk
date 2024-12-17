import type { Session } from "@remix-run/node";
import { AxiosUtilsResponse, PurchaseOrderGraphQL, ReceptionDetailsGraphQL, ReceptionGraphQL } from "@zauru-sdk/types";
/**
 * createNewReception
 * @param headers
 * @param body
 * @param purchase_order_id
 * @returns
 */
export declare function createNewReception(headers: any, body: Partial<ReceptionGraphQL> & {
    reception_details?: Partial<ReceptionDetailsGraphQL>[];
}, purchase_order_id: number | string): Promise<AxiosUtilsResponse<any>>;
/**
 * deleteReception
 * @param headers
 * @param id
 * @returns
 */
export declare function deleteReception(headers: any, receptionId: string | number, poId: string | number): Promise<AxiosUtilsResponse<boolean>>;
/**
 *
 * @param headers
 * @param poId
 * @returns
 */
export declare function createNewLabPurchaseOrderReception(headers: any, session: Session, body: Partial<PurchaseOrderGraphQL>): Promise<AxiosUtilsResponse<boolean>>;
