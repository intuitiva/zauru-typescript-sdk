"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPrintTemplates = void 0;
const common_1 = require("@zauru-sdk/common");
const httpGraphQL_js_1 = __importDefault(require("./httpGraphQL.js"));
const common_js_1 = require("../common.js");
const graphql_1 = require("@zauru-sdk/graphql");
/**
 * getPayees
 * @param headers
 * @returns
 */
async function getPrintTemplates(session) {
    return (0, common_1.handlePossibleAxiosErrors)(async () => {
        const headers = await (0, common_js_1.getGraphQLAPIHeaders)(session);
        const response = await httpGraphQL_js_1.default.post(``, {
            query: graphql_1.getPrintTemplatesStringQuery,
        }, {
            headers,
        });
        return response.data?.data.print_templates;
    });
}
exports.getPrintTemplates = getPrintTemplates;
