"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDeliveriesDataTableFormated = void 0;
const common_1 = require("@zauru-sdk/common");
const services_1 = require("@zauru-sdk/services");
/**
 * getDeliveriesFormated
 * @param headers
 * @param session
 */
const getDeliveriesDataTableFormated = async (headers, session) => {
    const body = {
        order: {
            "0": {
                column: "0",
                dir: "desc",
            },
        },
        start: 0,
        length: 40,
        search: {
            value: "",
            regex: false,
        },
        agency: session.get("agency_id"),
    };
    const response = await (0, services_1.getDeliveriesDataTables)(headers, body);
    if (response.error) {
        return { ...response, data: [] };
    }
    const deliveries = response.data?.data?.map((x) => formatHTMLDeliveryList(x)) ?? [];
    return { ...response, data: deliveries };
};
exports.getDeliveriesDataTableFormated = getDeliveriesDataTableFormated;
/**
 * formatHTMLDeliveryList
 * @param delivery
 * @returns
 */
const formatHTMLDeliveryList = (delivery) => {
    return {
        zid: (0, common_1.extractValueBetweenTags)(delivery.zid, "a"),
        referencia: (0, common_1.extractValueBetweenTags)(delivery.ref, "a"),
        fechaEntrega: delivery.pd,
        fechaEntregaEstimada: delivery.dt,
        destino: delivery.at,
        origen: delivery.af,
        deliveryId: delivery.DT_RowId.replace("inventories-delivery-", ""),
    };
};
