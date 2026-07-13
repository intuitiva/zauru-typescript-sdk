import { arrayToObject, handlePossibleAxiosErrors } from "@zauru-sdk/common";
import { getProductionWorkOrderStringQuery } from "@zauru-sdk/graphql";
import { getGraphQLAPIHeaders } from "../common.js";
import { httpGraphQLAPI } from "./httpGraphQL.js";
import { httpZauru } from "./httpZauru.js";
/**
 * getProductionWorkOrder
 * @param session
 * @param config
 * @returns
 */
export async function getProductionWorkOrder(session, config) {
    return handlePossibleAxiosErrors(async () => {
        const headers = await getGraphQLAPIHeaders(session);
        const response = await httpGraphQLAPI.post("", {
            query: getProductionWorkOrderStringQuery({
                id: config.id,
                closed: config.closed ?? false,
                voided: config.voided ?? false,
            }),
        }, { headers });
        if (response.data.errors) {
            throw new Error(response.data.errors.map((x) => x.message).join(";"));
        }
        const workOrder = response.data.data.production_work_orders[0];
        if (!workOrder) {
            throw new Error("Production work order not found");
        }
        return workOrder;
    });
}
/**
 * getOpenWorkOrdersDataTables
 * @param headers
 * @param body
 * @returns
 */
export const getOpenWorkOrdersDataTables = (headers, body) => {
    return handlePossibleAxiosErrors(async () => {
        const response = await httpZauru.post(`/production/open_work_orders/datatables.json`, body, { headers });
        return response.data;
    });
};
/**
 * buildCloseOpenWorkOrderBody
 * @param details
 * @param options
 * @returns
 */
export const buildCloseOpenWorkOrderBody = (details, options) => {
    const defaultDeliveredToBooked = options?.defaultDeliveredToBooked ?? true;
    const work_order_details_attributes = details.map((detail) => {
        const deliveredQuantity = defaultDeliveredToBooked
            ? (detail.delivered_quantity ?? detail.booked_quantity)
            : detail.delivered_quantity;
        return {
            id: detail.id,
            item_id: detail.item_id,
            bundle_id: detail.bundle_id,
            cost_center_id: detail.cost_center_id,
            lot_id: detail.lot_id,
            serial_id: detail.serial_id,
            booked_quantity: detail.booked_quantity,
            delivered_quantity: deliveredQuantity === null || deliveredQuantity === undefined
                ? undefined
                : deliveredQuantity,
            reference: detail.reference,
        };
    });
    return {
        production_work_order: {
            work_order_details_attributes,
        },
    };
};
/**
 * closeOpenWorkOrder
 * @param headers
 * @param id
 * @param body
 * @returns
 */
export const closeOpenWorkOrder = (headers, id, body) => {
    return handlePossibleAxiosErrors(async () => {
        const sendBody = body ?? { production_work_order: {} };
        const normalizedBody = sendBody.production_work_order
            ?.work_order_details_attributes
            ? {
                production_work_order: {
                    work_order_details_attributes: arrayToObject(sendBody.production_work_order.work_order_details_attributes),
                },
            }
            : sendBody;
        const response = await httpZauru.patch(`/production/open_work_orders/${id}/update_close`, normalizedBody, { headers });
        return response.data;
    });
};
/**
 * closeOpenWorkOrderWithBookedQuantities
 * @param headers
 * @param session
 * @param id
 * @returns
 */
export const closeOpenWorkOrderWithBookedQuantities = async (headers, session, id) => {
    const workOrderResult = await getProductionWorkOrder(session, {
        id,
        closed: false,
        voided: false,
    });
    if (workOrderResult.error) {
        return workOrderResult;
    }
    const details = workOrderResult.data?.production_work_order_details ?? [];
    if (details.length === 0) {
        return closeOpenWorkOrder(headers, id);
    }
    const body = buildCloseOpenWorkOrderBody(details, {
        defaultDeliveredToBooked: true,
    });
    return closeOpenWorkOrder(headers, id, body);
};
