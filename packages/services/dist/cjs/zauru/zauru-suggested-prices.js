"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteSuggestedPrice = exports.createSuggestedPrice = exports.getSuggestedPrices = exports.getSuggestedPricesExportJSON = void 0;
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
const getSuggestedPricesExportJSON = async (headers) => {
    return (0, common_1.handlePossibleAxiosErrors)(async () => {
        const response = await httpZauru_js_1.default.get(`/sales/suggested_prices/export.json`, {
            headers,
        });
        return response.data;
    });
};
exports.getSuggestedPricesExportJSON = getSuggestedPricesExportJSON;
/**
 * getSuggestedPrices
 * @param session
 * @param id
 */
async function getSuggestedPrices(session, config) {
    return (0, common_1.handlePossibleAxiosErrors)(async () => {
        const { notNullPriceList = false, withItems = false, withItemCategories = false, onlyCurrent = false, } = config;
        const headers = await (0, common_js_1.getGraphQLAPIHeaders)(session);
        const response = await httpGraphQL_js_1.default.post("", {
            query: (0, graphql_1.getSuggestedPricesStringQuery)({
                notNullPriceList,
                withItems,
                withItemCategories,
                onlyCurrent,
            }),
        }, { headers });
        if (response.data.errors) {
            throw new Error(response.data.errors.map((x) => x.message).join(";"));
        }
        return response?.data?.data?.suggested_prices ?? [];
    });
}
exports.getSuggestedPrices = getSuggestedPrices;
/**
 * createSuggestedPrice
 * @param headers
 * @param body
 */
async function createSuggestedPrice(headers, body) {
    return (0, common_1.handlePossibleAxiosErrors)(async () => {
        const response = await httpZauru_js_1.default.post(`/sales/suggested_prices.json`, { suggested_price: body }, { headers });
        return response.data;
    });
}
exports.createSuggestedPrice = createSuggestedPrice;
//No existe actualizar
// /**
//  * updateSuggestedPrice
//  * @param headers
//  * @param body
//  */
// export async function updateSuggestedPrice(
//   headers: any,
//   body: Partial<SuggestedPriceGraphQL>
// ): Promise<AxiosUtilsResponse<SuggestedPriceGraphQL>> {
//   return handlePossibleAxiosErrors(async () => {
//     const response = await httpZauru.patch<SuggestedPriceGraphQL>(
//       `/sales/suggested_prices.json`,
//       { suggested_price: body },
//       { headers }
//     );
//     return response.data;
//   });
// }
/**
 * deleteSuggestedPrice
 * @param headers
 * @param body
 */
async function deleteSuggestedPrice(headers, id) {
    return (0, common_1.handlePossibleAxiosErrors)(async () => {
        await httpZauru_js_1.default.delete(`/sales/suggested_prices/${id}?destroy=true`, {
            headers,
        });
        return true;
    });
}
exports.deleteSuggestedPrice = deleteSuggestedPrice;
