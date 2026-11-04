import { getPaymentByIdStringQuery } from "@zauru-sdk/graphql";
import { arrayToObject, handlePossibleAxiosErrors } from "@zauru-sdk/common";
import { getGraphQLAPIHeaders } from "../common.js";
import { httpGraphQLAPI } from "./httpGraphQL.js";
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
 * GraphQL `payments` + `payment_details` by id.
 * @param session
 * @param id
 * @returns
 */
export async function getPayment(session, id) {
    return handlePossibleAxiosErrors(async () => {
        const headers = await getGraphQLAPIHeaders(session);
        const response = await httpGraphQLAPI.post("", { query: getPaymentByIdStringQuery(Number(id)) }, { headers });
        if (response.data.errors) {
            throw new Error(response.data.errors.map((x) => x.message).join(";"));
        }
        const payment = response.data.data?.payments?.[0];
        if (!payment) {
            throw new Error("No se encontró ningún pago con este id: " + id);
        }
        return payment;
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
