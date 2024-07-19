"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteInvoiceOrder = exports.updateInvoiceOrder = exports.createInvoiceOrder = exports.createInvoice = exports.getInvoicesByAgencyId = void 0;
const common_1 = require("@zauru-sdk/common");
const common_js_1 = require("../common.js");
const httpGraphQL_js_1 = __importDefault(require("./httpGraphQL.js"));
const graphql_1 = require("@zauru-sdk/graphql");
const httpZauru_js_1 = __importDefault(require("./httpZauru.js"));
/**
 * getInvoicesByAgencyId
 */
async function getInvoicesByAgencyId(session, id) {
    return (0, common_1.handlePossibleAxiosErrors)(async () => {
        const headers = await (0, common_js_1.getGraphQLAPIHeaders)(session);
        const response = await httpGraphQL_js_1.default.post("", {
            query: graphql_1.getInvoicesByAgencyIdStringQuery,
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
exports.getInvoicesByAgencyId = getInvoicesByAgencyId;
/**
 * createInvoice
 * @param headers
 * @param body
 * @returns
 */
async function createInvoice(headers, body) {
    return (0, common_1.handlePossibleAxiosErrors)(async () => {
        const sendBody = {
            ...body,
            invoice_details_attributes: (0, common_1.arrayToObject)(body.invoice_details),
            tag_ids: ["", ...(body.tagging_invoices?.map((x) => x.tag_id) ?? [])],
        };
        if (sendBody.deleted_invoice_details)
            delete sendBody.deleted_invoice_details;
        if (sendBody.__rvfInternalFormId)
            delete sendBody.__rvfInternalFormId;
        if (sendBody.invoice_details)
            delete sendBody.invoice_details;
        if (sendBody.tagging_invoices)
            delete sendBody.tagging_invoices;
        console.log("ENVIANDO: ", JSON.stringify(sendBody));
        const response = await httpZauru_js_1.default.post(`/sales/unpaid_invoices.json`, { invoice: sendBody }, { headers });
        return response.data;
    });
}
exports.createInvoice = createInvoice;
/**
 * createInvoiceOrder
 * @param headers
 * @param body
 * @returns
 */
async function createInvoiceOrder(headers, body, esFactura = false) {
    return (0, common_1.handlePossibleAxiosErrors)(async () => {
        const sendBody = {
            ...body,
            issued: esFactura, //(false) - Esto lo hace una órden y no una factura
            invoice_details_attributes: (0, common_1.arrayToObject)(body.invoice_details),
            tag_ids: ["", ...(body.tagging_invoices?.map((x) => x.tag_id) ?? [])],
            taxable: esFactura ? 1 : 0,
        };
        if (sendBody.deleted_invoice_details)
            delete sendBody.deleted_invoice_details;
        if (sendBody.__rvfInternalFormId)
            delete sendBody.__rvfInternalFormId;
        if (sendBody.invoice_details)
            delete sendBody.invoice_details;
        if (sendBody.tagging_invoices)
            delete sendBody.tagging_invoices;
        const response = await httpZauru_js_1.default.post(`/sales/orders.json`, { invoice: sendBody }, { headers });
        return response.data;
    });
}
exports.createInvoiceOrder = createInvoiceOrder;
/**
 * updateInvoiceOrder
 * @param headers
 * @param body
 * @returns
 */
async function updateInvoiceOrder(headers, body) {
    return (0, common_1.handlePossibleAxiosErrors)(async () => {
        const sendBody = {
            ...body,
            invoice_details_attributes: (0, common_1.arrayToObject)(body.invoice_details),
        };
        if (sendBody.deleted_invoice_details)
            delete sendBody.deleted_invoice_details;
        if (sendBody.__rvfInternalFormId)
            delete sendBody.__rvfInternalFormId;
        if (sendBody.invoice_details)
            delete sendBody.invoice_details;
        const response = await httpZauru_js_1.default.patch(`/sales/orders/${body.id}.json`, { invoice: sendBody }, { headers });
        return response.data;
    });
}
exports.updateInvoiceOrder = updateInvoiceOrder;
/**
 * deleteInvoice
 * @param headers
 * @param body
 */
async function deleteInvoiceOrder(headers, id) {
    return (0, common_1.handlePossibleAxiosErrors)(async () => {
        await httpZauru_js_1.default.get(`/sales/orders/${id}/void`, {
            headers,
        });
        return true;
    });
}
exports.deleteInvoiceOrder = deleteInvoiceOrder;
