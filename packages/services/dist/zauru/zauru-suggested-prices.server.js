import { handlePossibleAxiosErrors } from "@zauru-sdk/common";
import httpZauru from "./httpZauru.server.js";
import { getGraphQLAPIHeaders } from "~/common.server.js";
import httpGraphQLAPI from "./httpGraphQL.server.js";
import { getSuggestedPricesStringQuery } from "@zauru-sdk/graphql";
/**
 *
 * @param headers
 * @returns
 */
export const getSuggestedPricesExportJSON = async (headers) => {
    return handlePossibleAxiosErrors(async () => {
        const response = await httpZauru.get(`/sales/suggested_prices/export.json`, {
            headers,
        });
        return response.data;
    });
};
/**
 * getSuggestedPrices
 * @param session
 * @param id
 */
export async function getSuggestedPrices(session, config) {
    return handlePossibleAxiosErrors(async () => {
        const { notNullPriceList = false, withItems = false, withItemCategories = false, onlyCurrent = false, } = config;
        const headers = await getGraphQLAPIHeaders(session);
        const response = await httpGraphQLAPI.post("", {
            query: getSuggestedPricesStringQuery({
                notNullPriceList,
                withItems,
                withItemCategories,
                onlyCurrent,
            }),
        }, { headers });
        if (response.data.errors) {
            throw new Error(response.data.errors.map((x) => x.message).join(";"));
        }
        return response?.data?.data?.suggested_prices ?? [];
    });
}
/**
 * createSuggestedPrice
 * @param headers
 * @param body
 */
export async function createSuggestedPrice(headers, body) {
    return handlePossibleAxiosErrors(async () => {
        const response = await httpZauru.post(`/sales/suggested_prices.json`, { suggested_price: body }, { headers });
        return response.data;
    });
}
//No existe actualizar
// /**
//  * updateSuggestedPrice
//  * @param headers
//  * @param body
//  */
// export async function updateSuggestedPrice(
//   headers: any,
//   body: Partial<SuggestedPriceGraphQL>
// ): Promise<AxiosUtilsResponse<SuggestedPriceGraphQL>> {
//   return handlePossibleAxiosErrors(async () => {
//     const response = await httpZauru.patch<SuggestedPriceGraphQL>(
//       `/sales/suggested_prices.json`,
//       { suggested_price: body },
//       { headers }
//     );
//     return response.data;
//   });
// }
/**
 * deleteSuggestedPrice
 * @param headers
 * @param body
 */
export async function deleteSuggestedPrice(headers, id) {
    return handlePossibleAxiosErrors(async () => {
        await httpZauru.delete(`/sales/suggested_prices/${id}?destroy=true`, {
            headers,
        });
        return true;
    });
}
