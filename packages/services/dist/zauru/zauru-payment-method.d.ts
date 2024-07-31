import type { Session } from "@remix-run/node";
import { AxiosUtilsResponse, PaymentTermGraphQL } from "@zauru-sdk/types";
/**
 * getPaymentTerms
 */
export declare function getPaymentMethods(session: Session, config?: {
    onlyActives: boolean;
}): Promise<AxiosUtilsResponse<PaymentTermGraphQL[]>>;
