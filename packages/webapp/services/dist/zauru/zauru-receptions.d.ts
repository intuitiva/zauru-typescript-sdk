import type { Session } from "@remix-run/node";
import { AxiosUtilsResponse, PurchaseOrderGraphQL, ReceptionDetailsGraphQL, ReceptionGraphQL } from "@zauru-sdk/types";
/**
 * createNewReception
 * @param headers
 * @param body
 * @param purchase_order_id
 * @returns
 */
export type CreateNewPurchaseOrderReceptionType = Omit<Partial<ReceptionGraphQL>, "reception_details"> & {
    reception_details?: Partial<ReceptionDetailsGraphQL>[];
};
export declare function createNewReception(headers: any, body: CreateNewPurchaseOrderReceptionType, purchase_order_id: number | string): Promise<AxiosUtilsResponse<any>>;
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
