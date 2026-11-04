import { arrayToObject, handlePossibleAxiosErrors } from "@zauru-sdk/common";
import { httpZauru } from "./httpZauru.js";
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
        if (sendBody.tagging_payments)
            delete sendBody.tagging_payments;
        const response = await httpZauru.post(`/sales/payments.json`, { payment: sendBody }, { headers });
        return response.data;
    });
}
/**
 * getPayment
 * GET /sales/payments/:id.json (incluye payment_details con sus ids)
 * @param headers
 * @param id
 * @returns
 */
export async function getPayment(headers, id) {
    return handlePossibleAxiosErrors(async () => {
        const response = await httpZauru.get(`/sales/payments/${id}.json`, { headers });
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
export async function voidPayment(headers, id) {
    return handlePossibleAxiosErrors(async () => {
        await httpZauru.delete(`/sales/payments/${id}.json`, { headers });
        return true;
    });
}
