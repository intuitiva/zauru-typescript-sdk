import type { Session } from "@remix-run/node";
import { AxiosUtilsResponse, DeepPartial, PurchaseOrderGraphQL, ReceptionGraphQL } from "@zauru-sdk/types";
/**
 * createNewReception
 * @param headers
 * @param body
 * @param purchase_order_id
 * @returns
 */
export declare function createNewReception(headers: any, body: DeepPartial<ReceptionGraphQL>, purchase_order_id: number | string): Promise<AxiosUtilsResponse<any>>;
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
