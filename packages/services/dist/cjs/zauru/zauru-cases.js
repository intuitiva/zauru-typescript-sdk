"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCasesByResponsibleId = void 0;
const common_1 = require("@zauru-sdk/common");
const common_js_1 = require("../common.js");
const httpGraphQL_js_1 = __importDefault(require("./httpGraphQL.js"));
const graphql_1 = require("@zauru-sdk/graphql");
/**
 * getCasesByResponsibleId
 */
async function getCasesByResponsibleId(session, responsible_id, wheres = []) {
    return (0, common_1.handlePossibleAxiosErrors)(async () => {
        const headers = await (0, common_js_1.getGraphQLAPIHeaders)(session);
        const response = await httpGraphQL_js_1.default.post("", {
            query: (0, graphql_1.getCasesByResponsibleIdStringQuery)(Number(responsible_id), wheres),
        }, { headers });
        if (response.data.errors) {
            throw new Error(response.data.errors.map((x) => x.message).join(";"));
        }
        const registers = response?.data?.data?.cases;
        return registers;
    });
}
exports.getCasesByResponsibleId = getCasesByResponsibleId;
