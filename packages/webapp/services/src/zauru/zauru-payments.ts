import { arrayToObject, handlePossibleAxiosErrors } from "@zauru-sdk/common";
import { AxiosUtilsResponse, PaymentGraphQL } from "@zauru-sdk/types";
import { httpZauru } from "./httpZauru.js";

/**
 * createInvoice
 * @param headers
 * @param body
 * @returns
 */
export async function createPayment(
  headers: any,
  body: Partial<PaymentGraphQL>
): Promise<AxiosUtilsResponse<PaymentGraphQL>> {
  return handlePossibleAxiosErrors(async () => {
    const sendBody = {
      ...body,
      payment_details_attributes: arrayToObject(body.payment_details),
      tag_ids: ["", ...(body.tagging_payments?.map((x) => x.tag_id) ?? [])],
    } as any;

    if (sendBody.deleted_payment_details)
      delete sendBody.deleted_payment_details;
    if (sendBody.__rvfInternalFormId) delete sendBody.__rvfInternalFormId;
    if (sendBody.payment_details) delete sendBody.payment_details;
    if (sendBody.tagging_payments) delete sendBody.tagging_payments;

    const response = await httpZauru.post<PaymentGraphQL>(
      `/sales/payments.json`,
      { payment: sendBody },
      { headers }
    );

    return response.data;
  });
}

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
export async function getPayment(
  headers: any,
  id: string | number
): Promise<AxiosUtilsResponse<PaymentRest>> {
  return handlePossibleAxiosErrors(async () => {
    const response = await httpZauru.get<PaymentRest>(
      `/sales/payments/${id}.json`,
      { headers }
    );
    return response.data;
  });
}

/**
 * voidPayment
 * DELETE /sales/payments/:id.json (Zauru anula el pago y devuelve el saldo a las facturas)
 * @param headers
 * @param id
 * @returns
 */
export async function voidPayment(
  headers: any,
  id: string | number
): Promise<AxiosUtilsResponse<boolean>> {
  return handlePossibleAxiosErrors(async () => {
    await httpZauru.delete<any>(`/sales/payments/${id}.json`, { headers });
    return true;
  });
}
