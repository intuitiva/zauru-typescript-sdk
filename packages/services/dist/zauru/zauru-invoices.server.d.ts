import type { Session } from "@remix-run/node";
import { AxiosUtilsResponse, InvoiceGraphQL } from "@zauru-sdk/types";
/**
 * getInvoicesByAgencyId
 */
export declare function getInvoicesByAgencyId(session: Session, id: string | null): Promise<AxiosUtilsResponse<InvoiceGraphQL[]>>;
/**
 * createInvoiceOrder
 * @param headers
 * @param body
 * @returns
 */
export declare function createInvoiceOrder(headers: any, body: Partial<InvoiceGraphQL>): Promise<AxiosUtilsResponse<InvoiceGraphQL>>;
/**
 * updateInvoiceOrder
 * @param headers
 * @param body
 * @returns
 */
export declare function updateInvoiceOrder(headers: any, body: Partial<InvoiceGraphQL>): Promise<AxiosUtilsResponse<InvoiceGraphQL>>;
/**
 * deleteInvoice
 * @param headers
 * @param body
 */
export declare function deleteInvoiceOrder(headers: any, id: string | number): Promise<AxiosUtilsResponse<boolean>>;
