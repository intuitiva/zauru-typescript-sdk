import type { Session } from "@remix-run/node";
import { AxiosUtilsResponse, PaymentTermGraphQL } from "@zauru-sdk/types";
/**
 * getPaymentTerms
 */
export declare function getPaymentTerms(session: Session, config?: {
    includeAllowedDiscounts: boolean;
    includeAllowedPaymentTerms: boolean;
    onlyActives: boolean;
}): Promise<AxiosUtilsResponse<PaymentTermGraphQL[]>>;
/**
 * getPaymentTermById
 */
export declare function getPaymentTermById(session: Session, id: string | number): Promise<AxiosUtilsResponse<PaymentTermGraphQL>>;
/**
 * createPaymentTerm
 * @param headers
 */
export declare function createPaymentTerm(headers: any, payment_term: PaymentTermGraphQL): Promise<AxiosUtilsResponse<PaymentTermGraphQL>>;
/**
 * updatePaymentTerm
 * @param headers
 */
export declare function updatePaymentTerm(headers: any, payment_term: Partial<PaymentTermGraphQL> & any): Promise<AxiosUtilsResponse<PaymentTermGraphQL>>;
