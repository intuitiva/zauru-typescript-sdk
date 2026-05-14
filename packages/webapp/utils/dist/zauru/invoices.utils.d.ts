import type { Session } from "@remix-run/node";
import { AxiosUtilsResponse, InvoiceDetailsGraphQL, InvoiceGraphQL } from "@zauru-sdk/types";
/**
 *
 * @param headers
 * @param session
 * @returns
 */
export declare const getInvoicesByLabAgency: (headers: any, session: Session) => Promise<AxiosUtilsResponse<InvoiceGraphQL[]>>;
/**
 * createNewLabInvoiceOrder
 * @param headers
 * @param session
 * @returns
 */
export declare const createNewLabInvoiceOrder: (headers: any, session: Session, body: Partial<InvoiceGraphQL>) => Promise<AxiosUtilsResponse<boolean>>;
/**
 * makeInvoiceDetailsWithPrice
 * @param invoice_details
 * @returns
 */
export declare const makeInvoiceDetailsWithPrice: (invoice_details: any[], deleted_invoice_details?: any[]) => InvoiceDetailsGraphQL[];
