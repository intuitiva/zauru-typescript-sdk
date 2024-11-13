import { handlePossibleAxiosErrors } from "@zauru-sdk/common";
import {
  AxiosUtilsResponse,
  ItemWithPrices,
  SuggestedPriceGraphQL,
} from "@zauru-sdk/types";
import { httpZauru } from "./httpZauru.js";
import { Session } from "@remix-run/node";
import { getGraphQLAPIHeaders } from "../common.js";
import { httpGraphQLAPI } from "./httpGraphQL.js";
import { getSuggestedPricesStringQuery } from "@zauru-sdk/graphql";

/**
 *
 * @param headers
 * @returns
 */
export const getSuggestedPricesExportJSON = async (
  headers: any
): Promise<AxiosUtilsResponse<ItemWithPrices[]>> => {
  return handlePossibleAxiosErrors(async () => {
    const response = await httpZauru.get<ItemWithPrices[]>(
      `/sales/suggested_prices/export.json`,
      {
        headers,
      }
    );

    return response.data;
  });
};

/**
 * getSuggestedPrices
 * @param session
 * @param id
 */
export async function getSuggestedPrices(
  session: Session,
  config: {
    notNullPriceList?: boolean;
    withItems?: boolean;
    withItemCategories?: boolean;
    onlyCurrent?: boolean;
  }
): Promise<AxiosUtilsResponse<SuggestedPriceGraphQL[]>> {
  return handlePossibleAxiosErrors(async () => {
    const {
      notNullPriceList = false,
      withItems = false,
      withItemCategories = false,
      onlyCurrent = true,
    } = config;
    const headers = await getGraphQLAPIHeaders(session);

    const response = await httpGraphQLAPI.post<{
      data: { suggested_prices: SuggestedPriceGraphQL[] };
      errors?: {
        message: string;
        extensions: { path: string; code: string };
      }[];
    }>(
      "",
      {
        query: getSuggestedPricesStringQuery({
          notNullPriceList,
          withItems,
          withItemCategories,
          onlyCurrent,
        }),
      },
      { headers }
    );

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
export async function createSuggestedPrice(
  headers: any,
  body: Partial<SuggestedPriceGraphQL>
): Promise<AxiosUtilsResponse<SuggestedPriceGraphQL>> {
  return handlePossibleAxiosErrors(async () => {
    const response = await httpZauru.post<SuggestedPriceGraphQL>(
      `/sales/suggested_prices.json`,
      { suggested_price: body },
      { headers }
    );
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
export async function deleteSuggestedPrice(
  headers: any,
  id: string | number
): Promise<AxiosUtilsResponse<boolean>> {
  return handlePossibleAxiosErrors(async () => {
    await httpZauru.delete<any>(`/sales/suggested_prices/${id}?destroy=true`, {
      headers,
    });
    return true;
  });
}
