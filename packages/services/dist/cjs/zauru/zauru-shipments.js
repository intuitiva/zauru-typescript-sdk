"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteShipment_booking = exports.receiveShipment_booking = exports.getShipmentsByToAgencyLast100Id_booking = void 0;
const common_1 = require("@zauru-sdk/common");
const common_js_1 = require("../common.js");
const httpGraphQL_js_1 = __importDefault(require("./httpGraphQL.js"));
const graphql_1 = require("@zauru-sdk/graphql");
const httpZauru_js_1 = __importDefault(require("./httpZauru.js"));
/**
 * getShipmentsByToAgencyLast100Id_booking
 */
async function getShipmentsByToAgencyLast100Id_booking(session, agency_to_id) {
    return (0, common_1.handlePossibleAxiosErrors)(async () => {
        const headers = await (0, common_js_1.getGraphQLAPIHeaders)(session);
        const response = await httpGraphQL_js_1.default.post("", {
            query: graphql_1.getShipmentsByToAgencyLast100StringQuery,
            variables: {
                agency_to_id,
            },
        }, { headers });
        if (response.data.errors) {
            throw new Error(response.data.errors.map((x) => x.message).join(";"));
        }
        const registers = response?.data?.data?.shipments;
        return registers;
    });
}
exports.getShipmentsByToAgencyLast100Id_booking = getShipmentsByToAgencyLast100Id_booking;
/**
 * receiveShipment_booking
 * @param headers
 * @param id
 * @returns
 */
async function receiveShipment_booking(headers, id) {
    return (0, common_1.handlePossibleAxiosErrors)(async () => {
        const response = await httpZauru_js_1.default.get(`/inventories/bookings/${id}/deliver.json`, { headers });
        if (!response.data) {
            throw new Error("Sin respuesta de: /inventories/bookings/id/deliver.json");
        }
        return true;
    });
}
exports.receiveShipment_booking = receiveShipment_booking;
/**
 * deleteShipment_booking
 * @param headers
 * @param id
 * @returns
 */
async function deleteShipment_booking(headers, id) {
    return (0, common_1.handlePossibleAxiosErrors)(async () => {
        await httpZauru_js_1.default.delete(`/inventories/bookings/${id}.json`, {
            headers,
        });
        return true;
    });
}
exports.deleteShipment_booking = deleteShipment_booking;
