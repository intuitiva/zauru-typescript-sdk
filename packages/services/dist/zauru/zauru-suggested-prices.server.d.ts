import { AxiosUtilsResponse, ItemWithPrices, SuggestedPriceGraphQL } from "@zauru-sdk/types";
import { Session } from "@remix-run/node";
/**
 *
 * @param headers
 * @returns
 */
export declare const getSuggestedPricesExportJSON: (headers: any) => Promise<AxiosUtilsResponse<ItemWithPrices[]>>;
/**
 * getSuggestedPrices
 * @param session
 * @param id
 */
export declare function getSuggestedPrices(session: Session, config: {
    notNullPriceList?: boolean;
    withItems?: boolean;
    withItemCategories?: boolean;
}): Promise<AxiosUtilsResponse<SuggestedPriceGraphQL[]>>;
/**
 * createSuggestedPrice
 * @param headers
 * @param body
 */
export declare function createSuggestedPrice(headers: any, body: Partial<SuggestedPriceGraphQL>): Promise<AxiosUtilsResponse<SuggestedPriceGraphQL>>;
/**
 * deleteSuggestedPrice
 * @param headers
 * @param body
 */
export declare function deleteSuggestedPrice(headers: any, id: string | number): Promise<AxiosUtilsResponse<boolean>>;
