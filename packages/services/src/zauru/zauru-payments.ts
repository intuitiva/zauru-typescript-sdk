import { arrayToObject, handlePossibleAxiosErrors } from "@zauru-sdk/common";
import { AxiosUtilsResponse, PaymentGraphQL } from "@zauru-sdk/types";
import httpZauru from "./httpZauru.js";

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
