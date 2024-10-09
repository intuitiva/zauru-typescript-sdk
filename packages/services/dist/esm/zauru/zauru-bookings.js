import { arrayToObject, handlePossibleAxiosErrors } from "@zauru-sdk/common";
import httpZauru from "./httpZauru.js";
import { getGraphQLAPIHeaders } from "../common.js";
import httpGraphQLAPI from "./httpGraphQL.js";
import { getShipmentsStringQuery } from "@zauru-sdk/graphql";
/**
 * insertBookings
 * @param headers
 * @param body
 * @returns
 */
export const insertBookings = async (headers, body, temp_purchase_order_id) => {
    return handlePossibleAxiosErrors(async () => {
        const sendBody = {
            shipment: {
                ...body,
                movements_attributes: arrayToObject(body.movements),
            },
        };
        delete sendBody.shipment.movements;
        if (temp_purchase_order_id) {
            sendBody[`temp_purchase_order_id`] = `${temp_purchase_order_id}`;
        }
        console.log("REALIZANDO ENVIO, ENVIANDO: ", JSON.stringify(sendBody));
        const response = await httpZauru.post(`/inventories/bookings.json`, sendBody, {
            headers,
        });
        return response.data;
    });
};
/**
 * getDeliveryByBooking
 * @param headers
 * @param shipment_id
 * @returns
 */
export const getDeliveryByBooking = async (headers, shipment_id) => {
    return handlePossibleAxiosErrors(async () => {
        if (!shipment_id) {
            throw new Error("No hay un shipment_id, en getDeliveryByBooking");
        }
        const response = await httpZauru.get(`/inventories/bookings/${shipment_id}/deliver.json`, {
            headers,
            data: {
                id: shipment_id,
            },
        });
        return response.data;
    });
};
/**
 * getBookings
 * @param headers
 * @returns
 */
export const getBookings = async (session, wheres = []) => {
    return handlePossibleAxiosErrors(async () => {
        const headers = await getGraphQLAPIHeaders(session);
        const response = await httpGraphQLAPI.post("", {
            query: getShipmentsStringQuery([...wheres, "delivered: {_eq: false}"]),
        }, { headers });
        if (response.data.errors) {
            throw new Error(response.data.errors.map((x) => x.message).join(";"));
        }
        const registers = response?.data?.data?.shipments;
        return registers;
    });
};
/**
 * getBookings
 * @param headers
 * @returns
 */
export const getBooking = async (headers, booking_id) => {
    return handlePossibleAxiosErrors(async () => {
        const response = await httpZauru.get(`/inventories/bookings/${booking_id}.json`, {
            headers,
        });
        return response.data;
    });
};
