"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteDelivery = exports.getDeliveriesDataTables = exports.getDelivery = void 0;
const common_1 = require("@zauru-sdk/common");
const httpZauru_js_1 = __importDefault(require("./httpZauru.js"));
/**
 * getDelivery
 * @param headers
 * @param body
 * @returns
 */
async function getDelivery(headers, idDelivery) {
    return (0, common_1.handlePossibleAxiosErrors)(async () => {
        const response = await httpZauru_js_1.default.get(`/inventories/deliveries/${idDelivery}.json`, {
            headers,
        });
        return response.data;
    });
}
exports.getDelivery = getDelivery;
/**
 * GET DELIVERIES DATA TABLES
 * @param headers
 * @param body
 * @returns
 */
async function getDeliveriesDataTables(headers, body) {
    return (0, common_1.handlePossibleAxiosErrors)(async () => {
        const response = await httpZauru_js_1.default.post(`/inventories/deliveries/datatables.json`, body, {
            headers,
        });
        return response.data;
    });
}
exports.getDeliveriesDataTables = getDeliveriesDataTables;
/**
 * deleteDelivery
 * @param headers
 * @param id
 * @returns
 */
async function deleteDelivery(headers, id) {
    return (0, common_1.handlePossibleAxiosErrors)(async () => {
        await httpZauru_js_1.default.delete(`/inventories/deliveries/${id}.json?destroy=true`, {
            headers,
        });
        return true;
    });
}
exports.deleteDelivery = deleteDelivery;
