"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePaymentTerm = exports.createPaymentTerm = exports.getPaymentTermById = exports.getPaymentTerms = void 0;
const common_1 = require("@zauru-sdk/common");
const common_js_1 = require("../common.js");
const httpGraphQL_js_1 = __importDefault(require("./httpGraphQL.js"));
const graphql_1 = require("@zauru-sdk/graphql");
const httpZauru_js_1 = __importDefault(require("./httpZauru.js"));
/**
 * getPaymentTerms
 */
async function getPaymentTerms(session, config = { includeDiscounts: false }) {
    return (0, common_1.handlePossibleAxiosErrors)(async () => {
        const headers = await (0, common_js_1.getGraphQLAPIHeaders)(session);
        const response = await httpGraphQL_js_1.default.post("", {
            query: (0, graphql_1.getPaymentTermsStringQuery)({
                includeDiscounts: config.includeDiscounts,
            }),
        }, { headers });
        if (response.data.errors) {
            throw new Error(response.data.errors.map((x) => x.message).join(";"));
        }
        const registers = response?.data?.data?.payment_terms;
        return registers;
    });
}
exports.getPaymentTerms = getPaymentTerms;
/**
 * getPaymentTermById
 */
async function getPaymentTermById(session, id) {
    return (0, common_1.handlePossibleAxiosErrors)(async () => {
        const headers = await (0, common_js_1.getGraphQLAPIHeaders)(session);
        const response = await httpGraphQL_js_1.default.post("", {
            query: graphql_1.getPaymentTermByIdStringQuery,
            variables: { id },
        }, { headers });
        if (response.data.errors) {
            throw new Error(response.data.errors.map((x) => x.message).join(";"));
        }
        if (!response?.data?.data?.payment_terms[0]) {
            throw new Error("No se encontró ningún método de pago con este id: " + id);
        }
        const registers = response?.data?.data?.payment_terms[0] ?? [];
        return registers;
    });
}
exports.getPaymentTermById = getPaymentTermById;
/**
 * createPaymentTerm
 * @param headers
 */
async function createPaymentTerm(headers, payment_term) {
    return (0, common_1.handlePossibleAxiosErrors)(async () => {
        const response = await httpZauru_js_1.default.patch(`/sales/settings/payment_terms.json`, {
            payment_term,
        }, { headers });
        return response.data;
    });
}
exports.createPaymentTerm = createPaymentTerm;
/**
 * updatePaymentTerm
 * @param headers
 */
async function updatePaymentTerm(headers, payment_term) {
    return (0, common_1.handlePossibleAxiosErrors)(async () => {
        const response = await httpZauru_js_1.default.patch(`/sales/settings/payment_terms/${payment_term.id}.json`, {
            payment_term,
        }, { headers });
        return response.data;
    });
}
exports.updatePaymentTerm = updatePaymentTerm;
