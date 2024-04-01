import type { Session } from "@remix-run/node";
import { AxiosUtilsResponse, ItemCategoryGraphQL, ItemDataTable, ItemGraphQL, ItemSuperCategoryGraphQL, SearchItemParams } from "@zauru-sdk/types";
/**
 *
 * @param headers
 * @returns
 */
export declare const getItemsDataTable: (headers: any, search: SearchItemParams) => Promise<AxiosUtilsResponse<ItemDataTable[]>>;
/**
 * getItems
 */
export declare function getItems(session: Session): Promise<AxiosUtilsResponse<ItemGraphQL[]>>;
/**
 * getItemByName
 */
export declare function getItemByName(session: Session, name: string): Promise<AxiosUtilsResponse<ItemGraphQL>>;
/**
 * getItemCategories
 * @param headers
 * @param agency_id
 * @returns
 */
export declare function getItemCategories(headers: any, item_category_id: string): Promise<ItemCategoryGraphQL>;
/**
 * getItemsByCategoryId
 */
export declare function getItemsByCategoryId(session: Session, id: string): Promise<AxiosUtilsResponse<ItemGraphQL[]>>;
/**
 * getItemCategory
 * @param session
 * @param id
 */
export declare function getItemCategory(session: Session, id: number | string): Promise<AxiosUtilsResponse<ItemCategoryGraphQL | undefined>>;
/**
 * getItemCategoriesBySuperCategoryId
 * @param session
 * @param categoryId
 * @returns
 */
export declare function getItemCategoriesBySuperCategoryId(session: Session, id: number | string): Promise<AxiosUtilsResponse<ItemCategoryGraphQL[]>>;
/**
 * getItemsBySuperCategoryId
 * @param session
 * @param categoryId
 * @returns
 */
export declare function getItemsBySuperCategoryId(session: Session, id: number | string, agency_id: number | string): Promise<AxiosUtilsResponse<ItemGraphQL[]>>;
/**
 * createItemSuperCategory
 * @param session
 * @param headers
 * @returns
 */
export declare function createItemSuperCategory(headers: any, body: Partial<ItemSuperCategoryGraphQL>): Promise<AxiosUtilsResponse<ItemSuperCategoryGraphQL>>;
/**
 * createItemCategory
 * @param session
 * @param headers
 * @returns
 */
export declare function createItemCategory(headers: any, body: Partial<ItemCategoryGraphQL>): Promise<AxiosUtilsResponse<ItemCategoryGraphQL>>;
/**
 * deleteItemCategory
 * @param headers
 * @param id
 * @returns
 */
export declare function deleteItemCategory(headers: any, id: string | number): Promise<AxiosUtilsResponse<boolean>>;
/**
 * updatePayee
 * @param session
 * @param headers
 * @returns
 */
export declare function updateItemCategory(headers: any, body: Partial<ItemCategoryGraphQL>): Promise<AxiosUtilsResponse<boolean>>;
/**
 * createItem
 * @param headers
 * @param body
 * @returns
 */
export declare function createItem(headers: any, body: Partial<ItemGraphQL>): Promise<AxiosUtilsResponse<ItemGraphQL>>;
/**
 * updateItem
 * @param headers
 * @param body
 * @param id
 * @returns
 */
export declare function updateItem(headers: any, body: Partial<ItemGraphQL>): Promise<AxiosUtilsResponse<boolean>>;
/**
 * deleteItemCategory
 * @param headers
 * @param id
 * @returns
 */
export declare function deleteItem(headers: any, id: string | number): Promise<AxiosUtilsResponse<boolean>>;
