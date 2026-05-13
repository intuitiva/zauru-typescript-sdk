import type { Session } from "@remix-run/node";
import { AxiosUtilsResponse, PaymentMethodGraphQL } from "@zauru-sdk/webapp-types";
/**
 * getPaymentTerms
 */
/**
 * getPaymentTerms
 */
export declare function getPaymentMethods(session: Session, config?: {
    onlyActives: boolean;
}): Promise<AxiosUtilsResponse<PaymentMethodGraphQL[]>>;
