import type { Session } from "@remix-run/node";
import { AxiosUtilsResponse, InvoiceGraphQL } from "@zauru-sdk/types";
/**
 * getInvoicesByAgencyId
 */
export declare function getInvoicesByAgencyId(session: Session, id: string | null, filters: {
    tag_id?: string;
}): Promise<AxiosUtilsResponse<InvoiceGraphQL[]>>;
/**
 * createInvoice
 * @param headers
 * @param body
 * @returns
 */
export declare function createInvoice(headers: any, body: Partial<InvoiceGraphQL>, sujetaAImpuestos?: boolean): Promise<AxiosUtilsResponse<InvoiceGraphQL>>;
/**
 * createInvoiceOrder
 * @param headers
 * @param body
 * @returns
 */
export declare function createInvoiceOrder(headers: any, body: Partial<InvoiceGraphQL>, esFactura?: boolean): Promise<AxiosUtilsResponse<InvoiceGraphQL>>;
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
