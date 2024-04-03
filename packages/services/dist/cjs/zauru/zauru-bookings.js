"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBooking = exports.getBookings = exports.getDeliveryByBooking = exports.insertBookings = void 0;
const common_1 = require("@zauru-sdk/common");
const httpZauru_js_1 = __importDefault(require("./httpZauru.js"));
const common_js_1 = require("../common.js");
const httpGraphQL_js_1 = __importDefault(require("./httpGraphQL.js"));
const graphql_1 = require("@zauru-sdk/graphql");
/**
 * insertBookings
 * @param headers
 * @param body
 * @returns
 */
const insertBookings = async (headers, body, temp_purchase_order_id) => {
    return (0, common_1.handlePossibleAxiosErrors)(async () => {
        const sendBody = {
            shipment: {
                ...body,
                movements_attributes: (0, common_1.arrayToObject)(body.movements),
            },
        };
        delete sendBody.shipment.movements;
        if (temp_purchase_order_id) {
            sendBody[`temp_purchase_order_id`] = `${temp_purchase_order_id}`;
        }
        const response = await httpZauru_js_1.default.post(`/inventories/bookings.json`, sendBody, {
            headers,
        });
        return response.data;
    });
};
exports.insertBookings = insertBookings;
/**
 * getDeliveryByBooking
 * @param headers
 * @param shipment_id
 * @returns
 */
const getDeliveryByBooking = async (headers, shipment_id) => {
    return (0, common_1.handlePossibleAxiosErrors)(async () => {
        if (!shipment_id) {
            throw new Error("No hay un shipment_id, en getDeliveryByBooking");
        }
        const response = await httpZauru_js_1.default.get(`/inventories/bookings/${shipment_id}/deliver.json`, {
            headers,
            data: {
                id: shipment_id,
            },
        });
        return response.data;
    });
};
exports.getDeliveryByBooking = getDeliveryByBooking;
/**
 * getBookings
 * @param headers
 * @returns
 */
const getBookings = async (session, wheres = []) => {
    return (0, common_1.handlePossibleAxiosErrors)(async () => {
        const headers = await (0, common_js_1.getGraphQLAPIHeaders)(session);
        const response = await httpGraphQL_js_1.default.post("", {
            query: (0, graphql_1.getShipmentsStringQuery)([...wheres, "delivered: {_eq: false}"]),
        }, { headers });
        if (response.data.errors) {
            throw new Error(response.data.errors.map((x) => x.message).join(";"));
        }
        const registers = response?.data?.data?.shipments;
        return registers;
    });
};
exports.getBookings = getBookings;
/**
 * getBookings
 * @param headers
 * @returns
 */
const getBooking = async (headers, booking_id) => {
    return (0, common_1.handlePossibleAxiosErrors)(async () => {
        const response = await httpZauru_js_1.default.get(`/inventories/bookings/${booking_id}.json`, {
            headers,
        });
        return response.data;
    });
};
exports.getBooking = getBooking;
