"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createNewLotPurchaseOrderReception = exports.createNewPurchaseOrderReception = exports.deleteReception = exports.createNewReception = void 0;
const common_1 = require("@zauru-sdk/common");
const httpZauru_js_1 = __importDefault(require("./httpZauru.js"));
/**
 * createNewReception
 * @param headers
 * @param body
 * @param purchase_order_id
 * @returns
 */
async function createNewReception(headers, body, purchase_order_id) {
    return (0, common_1.handlePossibleAxiosErrors)(async () => {
        const response = await (0, httpZauru_js_1.default)(`/purchases/purchase_orders/${purchase_order_id}/receptions.json`, { method: "POST", headers, data: body });
        return response.data;
    });
}
exports.createNewReception = createNewReception;
/**
 * deleteReception
 * @param headers
 * @param id
 * @returns
 */
async function deleteReception(headers, receptionId, poId) {
    return (0, common_1.handlePossibleAxiosErrors)(async () => {
        await httpZauru_js_1.default.get(`/purchases/receptions/${receptionId}/rebound.json?purchase_order_id=${poId}`, {
            headers,
        });
        return true;
    });
}
exports.deleteReception = deleteReception;
/**
 *
 * @param headers
 * @param poId
 * @returns
 */
async function createNewPurchaseOrderReception(headers, session, body) {
    return (0, common_1.handlePossibleAxiosErrors)(async () => {
        const sendBody = {
            reception: {
                memo: "LABORATORIO - Recibido parcialmente desde WebApp",
                purchase_order_id: body.id,
                needs_transit: false,
                agency_id: session.get("agency_id"),
                entity_id: session.get("selectedEntity"),
                received_at: (0, common_1.getDatePickerCurrentDate)(),
                invoice_number: "",
                reception_details_attributes: (0, common_1.arrayToObject)(body?.purchase_order_details?.map((x) => {
                    return {
                        item_id: x.item_id,
                        purchase_order_detail_id: x.id,
                        quantity: x.delivered_quantity,
                    };
                })),
            },
            purchase_order_id: body.id,
        };
        await httpZauru_js_1.default.post(`/purchases/purchase_orders/${body.id}/receptions.json`, sendBody, {
            headers,
        });
        return true;
    });
}
exports.createNewPurchaseOrderReception = createNewPurchaseOrderReception;
/**
 *
 * @param headers
 * @param poId
 * @returns
 */
async function createNewLotPurchaseOrderReception(headers, session, body) {
    return (0, common_1.handlePossibleAxiosErrors)(async () => {
        const sendBody = {
            memo: "LABORATORIO - Recibido parcialmente desde WebApp",
            purchase_order_id: body.id,
            needs_transit: false,
            received_at: (0, common_1.getDatePickerCurrentDate)(),
            invoice_number: "",
            agency_id: session.get("agency_id"),
            entity_id: session.get("selectedEntity"),
            reception_details_attributes: (0, common_1.arrayToObject)(body?.purchase_order_details?.map((x) => {
                return {
                    item_id: x.item_id,
                    purchase_order_detail_id: x.id,
                    lot_delivered_quantity: [x.delivered_quantity],
                    lot_name: [body.id_number],
                    lot_expire: [body.fechaVencimiento],
                };
            })),
        };
        await httpZauru_js_1.default.post(`/purchases/purchase_orders/${body.id}/receptions.json`, { reception: sendBody, purchase_order_id: body.id }, {
            headers,
        });
        return true;
    });
}
exports.createNewLotPurchaseOrderReception = createNewLotPurchaseOrderReception;
