import { handlePossibleAxiosErrors } from "@zauru-sdk/common";
import httpZauru from "./httpZauru.js";
/**
 * getDelivery
 * @param headers
 * @param body
 * @returns
 */
export async function getDelivery(headers, idDelivery) {
    return handlePossibleAxiosErrors(async () => {
        const response = await httpZauru.get(`/inventories/deliveries/${idDelivery}.json`, {
            headers,
        });
        return response.data;
    });
}
/**
 * GET DELIVERIES DATA TABLES
 * @param headers
 * @param body
 * @returns
 */
export async function getDeliveriesDataTables(headers, body) {
    return handlePossibleAxiosErrors(async () => {
        const response = await httpZauru.post(`/inventories/deliveries/datatables.json`, body, {
            headers,
        });
        return response.data;
    });
}
/**
 * deleteDelivery
 * @param headers
 * @param id
 * @returns
 */
export async function deleteDelivery(headers, id) {
    return handlePossibleAxiosErrors(async () => {
        await httpZauru.delete(`/inventories/deliveries/${id}.json?destroy=true`, {
            headers,
        });
        return true;
    });
}
