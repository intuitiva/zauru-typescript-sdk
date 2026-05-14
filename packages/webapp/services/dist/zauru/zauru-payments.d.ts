import { AxiosUtilsResponse, PaymentGraphQL } from "@zauru-sdk/types";
/**
 * createInvoice
 * @param headers
 * @param body
 * @returns
 */
export declare function createPayment(headers: any, body: Partial<PaymentGraphQL>): Promise<AxiosUtilsResponse<PaymentGraphQL>>;
