import { arrayToObject, handlePossibleAxiosErrors } from "@zauru-sdk/common";
import httpZauru from "./httpZauru.js";
/**
 * createInvoice
 * @param headers
 * @param body
 * @returns
 */
export async function createPayment(headers, body) {
    return handlePossibleAxiosErrors(async () => {
        const sendBody = {
            ...body,
            payment_details_attributes: arrayToObject(body.payment_details),
            tag_ids: ["", ...(body.tagging_payments?.map((x) => x.tag_id) ?? [])],
        };
        if (sendBody.deleted_payment_details)
            delete sendBody.deleted_payment_details;
        if (sendBody.__rvfInternalFormId)
            delete sendBody.__rvfInternalFormId;
        if (sendBody.payment_details)
            delete sendBody.payment_details;
        if (sendBody.tagging_payment)
            delete sendBody.tagging_payment;
        const response = await httpZauru.post(`/sales/payments.json`, { payment: sendBody }, { headers });
        return response.data;
    });
}
