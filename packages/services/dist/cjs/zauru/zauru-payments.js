"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPayment = void 0;
const common_1 = require("@zauru-sdk/common");
const httpZauru_js_1 = __importDefault(require("./httpZauru.js"));
/**
 * createInvoice
 * @param headers
 * @param body
 * @returns
 */
async function createPayment(headers, body) {
    return (0, common_1.handlePossibleAxiosErrors)(async () => {
        const sendBody = {
            ...body,
            payment_details_attributes: (0, common_1.arrayToObject)(body.payment_details),
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
        const response = await httpZauru_js_1.default.post(`/sales/payments.json`, { payment: sendBody }, { headers });
        return response.data;
    });
}
exports.createPayment = createPayment;
