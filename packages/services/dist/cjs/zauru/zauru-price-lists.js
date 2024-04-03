"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePriceList = exports.deletePriceList = exports.createPriceList = void 0;
const common_1 = require("@zauru-sdk/common");
const httpZauru_js_1 = __importDefault(require("./httpZauru.js"));
/**
 * createPriceList
 * @param session
 * @param headers
 * @returns
 */
async function createPriceList(headers, body) {
    return (0, common_1.handlePossibleAxiosErrors)(async () => {
        const response = await httpZauru_js_1.default.post("/sales/settings/price_lists", { price_list: body }, { headers });
        return response.data;
    });
}
exports.createPriceList = createPriceList;
/**
 * deletePriceList
 * @param headers
 * @param id
 * @returns
 */
async function deletePriceList(headers, id) {
    return (0, common_1.handlePossibleAxiosErrors)(async () => {
        await httpZauru_js_1.default.delete(`/sales/settings/price_lists/${id}?destroy=true`, {
            headers,
        });
        return true;
    });
}
exports.deletePriceList = deletePriceList;
/**
 * updatePriceList
 * @param session
 * @param headers
 * @returns
 */
async function updatePriceList(headers, body) {
    return (0, common_1.handlePossibleAxiosErrors)(async () => {
        await httpZauru_js_1.default.patch(`/sales/settings/price_lists/${body.id}`, { price_list: body }, { headers });
        return true;
    });
}
exports.updatePriceList = updatePriceList;
