import { handlePossibleAxiosErrors } from "@zauru-sdk/common";
import {
  AxiosUtilsResponse,
  CreatePriceListBody,
  PriceListGraphQL,
} from "@zauru-sdk/types";
import httpZauru from "./httpZauru.js";

/**
 * createPriceList
 * @param session
 * @param headers
 * @returns
 */
export async function createPriceList(
  headers: any,
  body: CreatePriceListBody
): Promise<AxiosUtilsResponse<PriceListGraphQL>> {
  return handlePossibleAxiosErrors(async () => {
    const response = await httpZauru.post<any>(
      "/sales/settings/price_lists",
      { price_list: body },
      { headers }
    );
    return response.data;
  });
}

/**
 * deletePriceList
 * @param headers
 * @param id
 * @returns
 */
export async function deletePriceList(
  headers: any,
  id: string | number
): Promise<AxiosUtilsResponse<boolean>> {
  return handlePossibleAxiosErrors(async () => {
    await httpZauru.delete<any>(
      `/sales/settings/price_lists/${id}?destroy=true`,
      {
        headers,
      }
    );
    return true;
  });
}

/**
 * updatePriceList
 * @param session
 * @param headers
 * @returns
 */
export async function updatePriceList(
  headers: any,
  body: Partial<PriceListGraphQL>
): Promise<AxiosUtilsResponse<boolean>> {
  return handlePossibleAxiosErrors(async () => {
    await httpZauru.patch<any>(
      `/sales/settings/price_lists/${body.id}`,
      { price_list: body },
      { headers }
    );
    return true;
  });
}
