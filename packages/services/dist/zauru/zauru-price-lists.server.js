import { handlePossibleAxiosErrors } from "@zauru-sdk/common";
import httpZauru from "./httpZauru.server.js";
/**
 * createPriceList
 * @param session
 * @param headers
 * @returns
 */
export async function createPriceList(headers, body) {
    return handlePossibleAxiosErrors(async () => {
        const response = await httpZauru.post("/sales/settings/price_lists", { price_list: body }, { headers });
        return response.data;
    });
}
/**
 * deletePriceList
 * @param headers
 * @param id
 * @returns
 */
export async function deletePriceList(headers, id) {
    return handlePossibleAxiosErrors(async () => {
        await httpZauru.delete(`/sales/settings/price_lists/${id}?destroy=true`, {
            headers,
        });
        return true;
    });
}
/**
 * updatePriceList
 * @param session
 * @param headers
 * @returns
 */
export async function updatePriceList(headers, body) {
    return handlePossibleAxiosErrors(async () => {
        await httpZauru.patch(`/sales/settings/price_lists/${body.id}`, { price_list: body }, { headers });
        return true;
    });
}
