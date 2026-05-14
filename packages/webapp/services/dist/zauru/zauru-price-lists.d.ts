import { AxiosUtilsResponse, CreatePriceListBody, PriceListGraphQL } from "@zauru-sdk/types";
/**
 * createPriceList
 * @param session
 * @param headers
 * @returns
 */
export declare function createPriceList(headers: any, body: CreatePriceListBody): Promise<AxiosUtilsResponse<PriceListGraphQL>>;
/**
 * deletePriceList
 * @param headers
 * @param id
 * @returns
 */
export declare function deletePriceList(headers: any, id: string | number): Promise<AxiosUtilsResponse<boolean>>;
/**
 * updatePriceList
 * @param session
 * @param headers
 * @returns
 */
export declare function updatePriceList(headers: any, body: Partial<PriceListGraphQL>): Promise<AxiosUtilsResponse<boolean>>;
