import { handlePossibleAxiosErrors } from "@zauru-sdk/common";
import { getGraphQLAPIHeaders } from "../common.server.js";
import httpGraphQLAPI from "./httpGraphQL.server.js";
import { getShipmentsByToAgencyLast100StringQuery } from "@zauru-sdk/graphql";
import httpZauru from "./httpZauru.server.js";
/**
 * getShipmentsByToAgencyLast100Id_booking
 */
export async function getShipmentsByToAgencyLast100Id_booking(session, agency_to_id) {
    return handlePossibleAxiosErrors(async () => {
        const headers = await getGraphQLAPIHeaders(session);
        const response = await httpGraphQLAPI.post("", {
            query: getShipmentsByToAgencyLast100StringQuery,
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
