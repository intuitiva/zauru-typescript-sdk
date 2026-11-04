import { AxiosUtilsResponse, PaymentGraphQL } from "@zauru-sdk/types";
/**
 * createInvoice
 * @param headers
 * @param body
 * @returns
 */
export declare function createPayment(headers: any, body: Partial<PaymentGraphQL>): Promise<AxiosUtilsResponse<PaymentGraphQL>>;
export type PaymentDetailRest = {
    id: number;
    payment_id: number;
    invoice_id: number | null;
    credit_note_id?: number | null;
    amount: number | string;
    reference?: string | null;
    [key: string]: unknown;
};
export type PaymentRest = Omit<PaymentGraphQL, "payment_details"> & {
    amount: number | string;
    voided: boolean;
    memo?: string | null;
    payment_details: PaymentDetailRest[];
    [key: string]: unknown;
};
/**
 * getPayment
 * GET /sales/payments/:id.json (incluye payment_details con sus ids)
 * @param headers
 * @param id
 * @returns
 */
export declare function getPayment(headers: any, id: string | number): Promise<AxiosUtilsResponse<PaymentRest>>;
/**
 * voidPayment
 * DELETE /sales/payments/:id.json (Zauru anula el pago y devuelve el saldo a las facturas)
 * @param headers
 * @param id
 * @returns
 */
export declare function voidPayment(headers: any, id: string | number): Promise<AxiosUtilsResponse<boolean>>;
