import { extractValueBetweenTags } from "@zauru-sdk/common";
import { getDeliveriesDataTables } from "@zauru-sdk/services";
/**
 * getDeliveriesFormated
 * @param headers
 * @param session
 */
export const getDeliveriesDataTableFormated = async (headers, session) => {
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
    const response = await getDeliveriesDataTables(headers, body);
    if (response.error) {
        return { ...response, data: [] };
    }
    const deliveries = response.data?.data?.map((x) => formatHTMLDeliveryList(x)) ?? [];
    return { ...response, data: deliveries };
};
/**
 * formatHTMLDeliveryList
 * @param delivery
 * @returns
 */
const formatHTMLDeliveryList = (delivery) => {
    return {
        zid: extractValueBetweenTags(delivery.zid, "a"),
        referencia: extractValueBetweenTags(delivery.ref, "a"),
        fechaEntrega: delivery.pd,
        fechaEntregaEstimada: delivery.dt,
        destino: delivery.at,
        origen: delivery.af,
        deliveryId: delivery.DT_RowId.replace("inventories-delivery-", ""),
    };
};
