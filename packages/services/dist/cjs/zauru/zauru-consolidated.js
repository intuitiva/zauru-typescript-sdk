"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getConsolidatesBetweenDates = exports.getConsolidatedPDFResult = exports.generateConsolidatePDF = exports.createConsolidated = void 0;
const common_1 = require("@zauru-sdk/common");
const httpZauru_js_1 = __importDefault(require("./httpZauru.js"));
const common_js_1 = require("../common.js");
const httpGraphQL_js_1 = __importDefault(require("./httpGraphQL.js"));
const graphql_1 = require("@zauru-sdk/graphql");
/**
 *
 * @param headers
 * @returns
 */
const createConsolidated = async (headers, body) => {
    return (0, common_1.handlePossibleAxiosErrors)(async () => {
        const response = await httpZauru_js_1.default.post(`/purchases/consolidates/create_for_special_invoice.json`, body, {
            headers,
        });
        return response.data;
    });
};
exports.createConsolidated = createConsolidated;
/**
 * generateConsolidatePDF
 * @param headers
 * @param body
 */
const generateConsolidatePDF = async (headers, session, body) => {
    return (0, common_1.handlePossibleAxiosErrors)(async () => {
        const { consolidated_template_id } = await (0, common_js_1.getVariablesByName)(headers, session, ["consolidated_template_id"]);
        body.print_template = consolidated_template_id;
        const response = await httpZauru_js_1.default.post("/purchases/consolidates/gen_print_all.json", body, { headers });
        return response.data;
    });
};
exports.generateConsolidatePDF = generateConsolidatePDF;
/**
 * getConsolidatedPDFResult
 * @param headers
 * @param zid
 * @returns
 */
const getConsolidatedPDFResult = async (headers, zid) => {
    return (0, common_1.handlePossibleAxiosErrors)(async () => {
        const response = await httpZauru_js_1.default.get("purchases/consolidates/check_print_all", {
            headers,
            params: { zid },
        });
        return response.data;
    });
};
exports.getConsolidatedPDFResult = getConsolidatedPDFResult;
/**
 *
 * @param session
 * @param dates
 * @returns
 */
const getConsolidatesBetweenDates = async (session, dates) => {
    return (0, common_1.handlePossibleAxiosErrors)(async () => {
        const headers = await (0, common_js_1.getGraphQLAPIHeaders)(session);
        const response = await httpGraphQL_js_1.default.post("", {
            query: graphql_1.getConsolidatesBetweenDatesStringQuery,
            variables: {
                startDate: (0, common_1.formatDateToUTC)(dates.startDate),
                endDate: (0, common_1.formatDateToUTC)(dates.endDate),
            },
        }, { headers });
        if (response.data.errors) {
            throw new Error(response.data.errors.map((x) => x.message).join(";"));
        }
        if (!response?.data?.data.consolidates) {
            return [];
        }
        return response.data?.data.consolidates;
    });
};
exports.getConsolidatesBetweenDates = getConsolidatesBetweenDates;
