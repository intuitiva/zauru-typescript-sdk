import { handlePossibleAxiosErrors } from "@zauru-sdk/common";
import { getGraphQLAPIHeaders } from "../common.js";
import httpGraphQLAPI from "./httpGraphQL.js";
import { getLast100ShipmentsStringQuery } from "@zauru-sdk/graphql";
import httpZauru from "./httpZauru.js";
/**
 * getShipments
 */
export async function getShipments(session, config) {
    return handlePossibleAxiosErrors(async () => {
        const headers = await getGraphQLAPIHeaders(session);
        const query = getLast100ShipmentsStringQuery({
            agency_to_id: Number(config.agency_to_id),
            suffix: config.suffix,
            id_number: config.id_number,
            id_number_not_null: config.id_number_not_null,
            id_number_not_empty: config.id_number_not_empty,
        });
        console.log("query", query);
        const response = await httpGraphQLAPI.post("", {
            query,
        }, { headers });
        if (response.data.errors) {
            throw new Error(response.data.errors.map((x) => x.message).join(";"));
        }
        const registers = response?.data?.data?.shipments;
        return registers;
    });
}
/**
 * receiveShipment_booking
 * @param headers
 * @param id
 * @returns
 */
export async function receiveShipment_booking(headers, id) {
    return handlePossibleAxiosErrors(async () => {
        const response = await httpZauru.get(`/inventories/bookings/${id}/deliver.json`, { headers });
        if (!response.data) {
            throw new Error("Sin respuesta de: /inventories/bookings/id/deliver.json");
        }
        return true;
    });
}
/**
 * deleteShipment_booking
 * @param headers
 * @param id
 * @returns
 */
export async function deleteShipment_booking(headers, id) {
    return handlePossibleAxiosErrors(async () => {
        await httpZauru.delete(`/inventories/bookings/${id}.json`, {
            headers,
        });
        return true;
    });
}
