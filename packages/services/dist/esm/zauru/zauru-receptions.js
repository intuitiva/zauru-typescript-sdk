import { arrayToObject, getDatePickerCurrentDate, handlePossibleAxiosErrors, } from "@zauru-sdk/common";
import { httpZauru } from "./httpZauru.js";
export async function createNewReception(headers, body, purchase_order_id) {
    return handlePossibleAxiosErrors(async () => {
        const sendBody = {
            ...body,
            reception_details_attributes: arrayToObject(body.reception_details),
        };
        delete sendBody.reception_details;
        const response = await httpZauru.post(`/purchases/purchase_orders/${purchase_order_id}/receptions.json`, { reception: sendBody }, { headers });
        return response.data;
    });
}
/**
 * deleteReception
 * @param headers
 * @param id
 * @returns
 */
export async function deleteReception(headers, receptionId, poId) {
    return handlePossibleAxiosErrors(async () => {
        await httpZauru.get(`/purchases/receptions/${receptionId}/rebound.json?purchase_order_id=${poId}`, {
            headers,
        });
        return true;
    });
}
//TODO: PASARLO A UTILS
/**
 *
 * @param headers
 * @param poId
 * @returns
 */
export async function createNewLabPurchaseOrderReception(headers, session, body) {
    return handlePossibleAxiosErrors(async () => {
        const sendBody = {
            reception: {
                memo: "LABORATORIO - Recibido parcialmente desde WebApp",
                purchase_order_id: body.id,
                needs_transit: false,
                received_at: getDatePickerCurrentDate(),
                invoice_number: "",
                agency_id: session.get("agency_id"),
                entity_id: session.get("selectedEntity"),
                reception_details_attributes: arrayToObject(body?.purchase_order_details?.map((x) => {
                    const temp = {
                        item_id: x.item_id,
                        purchase_order_detail_id: x.id,
                    };
                    if (x.expire_date) {
                        temp.lot_delivered_quantity = [`${x.delivered_quantity}`];
                        temp.lot_name = [body.id_number];
                        temp.lot_expire = [x.expire_date];
                        temp.lot_description = [body.id_number];
                    }
                    else {
                        temp.quantity = x.delivered_quantity;
                    }
                    return temp;
                })),
            },
            purchase_order_id: body.id,
        };
        await httpZauru.post(`/purchases/purchase_orders/${body.id}/receptions.json`, sendBody, {
            headers,
        });
        return true;
    });
}
