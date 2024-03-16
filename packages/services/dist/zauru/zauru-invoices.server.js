import { arrayToObject, handlePossibleAxiosErrors } from "@zauru-sdk/common";
import { getGraphQLAPIHeaders } from "~/common.server.js";
import httpGraphQLAPI from "./httpGraphQL.server.js";
import { getInvoicesByAgencyIdStringQuery } from "@zauru-sdk/graphql";
import httpZauru from "./httpZauru.server.js";
/**
 * getInvoicesByAgencyId
 */
export async function getInvoicesByAgencyId(session, id) {
    return handlePossibleAxiosErrors(async () => {
        const headers = await getGraphQLAPIHeaders(session);
        const response = await httpGraphQLAPI.post("", {
            query: getInvoicesByAgencyIdStringQuery,
            variables: {
                id,
            },
        }, { headers });
        if (response.data.errors) {
            throw new Error(response.data.errors.map((x) => x.message).join(";"));
        }
        // Filtrar los registros para obtener sólo los de la versión más alta.
        const registers = response?.data?.data?.invoices.map((x) => {
            const groupedByVersion = x.submission_invoices?.reduce((acc, record) => {
                const zid = record.settings_form_submission?.zid;
                if (!acc[zid]) {
                    acc[zid] = record;
                }
                return acc;
            }, {});
            x.submission_invoices = Object.values(groupedByVersion)?.reverse() ?? [];
            return x;
        });
        return registers;
    });
}
/**
 * createInvoiceOrder
 * @param headers
 * @param body
 * @returns
 */
export async function createInvoiceOrder(headers, body) {
    return handlePossibleAxiosErrors(async () => {
        const sendBody = {
            ...body,
            issued: false, // Esto lo hace una órden y no una factura
            invoice_details_attributes: arrayToObject(body.invoice_details),
            tag_ids: body.tagging_invoices?.map((x) => x.tag_id) ?? [],
        };
        if (sendBody.deleted_invoice_details)
            delete sendBody.deleted_invoice_details;
        if (sendBody.__rvfInternalFormId)
            delete sendBody.__rvfInternalFormId;
        if (sendBody.invoice_details)
            delete sendBody.invoice_details;
        const response = await httpZauru.post(`/sales/orders.json`, { invoice: sendBody }, { headers });
        return response.data;
    });
}
/**
 * updateInvoiceOrder
 * @param headers
 * @param body
 * @returns
 */
export async function updateInvoiceOrder(headers, body) {
    return handlePossibleAxiosErrors(async () => {
        const sendBody = {
            ...body,
            invoice_details_attributes: arrayToObject(body.invoice_details),
        };
        if (sendBody.deleted_invoice_details)
            delete sendBody.deleted_invoice_details;
        if (sendBody.__rvfInternalFormId)
            delete sendBody.__rvfInternalFormId;
        if (sendBody.invoice_details)
            delete sendBody.invoice_details;
        const response = await httpZauru.patch(`/sales/orders/${body.id}.json`, { invoice: sendBody }, { headers });
        return response.data;
    });
}
/**
 * deleteInvoice
 * @param headers
 * @param body
 */
export async function deleteInvoiceOrder(headers, id) {
    return handlePossibleAxiosErrors(async () => {
        await httpZauru.get(`/sales/orders/${id}/void`, {
            headers,
        });
        return true;
    });
}
