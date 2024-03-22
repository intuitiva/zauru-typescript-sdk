import type { Session } from "@remix-run/node";
import { AxiosUtilsResponse, ItemGraphQL, SearchItemParams, ItemDataTable, ItemCategoryGraphQL } from "@zauru-sdk/types";
/**
 *
 * @param headers
 * @param session
 * @returns
 */
export declare const getItemsByReceptionCategory: (headers: any, session: Session) => Promise<AxiosUtilsResponse<ItemGraphQL[]>>;
/**
 *
 * @param headers
 * @param session
 * @returns
 */
export declare const getItemsByLabCategory: (headers: any, session: Session) => Promise<AxiosUtilsResponse<ItemGraphQL[]>>;
/**
 *
 * @param headers
 * @param session
 * @returns
 */
export declare const getItemServicesByLabCategory: (headers: any, session: Session) => Promise<AxiosUtilsResponse<ItemGraphQL[]>>;
/**
 *
 * @param headers
 * @returns
 */
export declare const getItemsDataTable: (headers: any, search: SearchItemParams) => Promise<AxiosUtilsResponse<ItemDataTable[]>>;
/**
 * getLabItemCategories
 * @param session
 * @param headers
 * @returns
 */
export declare const getLabItemCategories: (headers: any, session: Session) => Promise<AxiosUtilsResponse<ItemCategoryGraphQL[]>>;
/**
 * createNewLaboratoryClient
 * @param session
 * @param headers
 * @param body
 * @returns
 */
export declare const createNewLaboratoryItemCategory: (session: Session, headers: any, body: Partial<ItemCategoryGraphQL>) => Promise<AxiosUtilsResponse<boolean>>;
/**
 * createNewLaboratoryItem
 * @param session
 * @param headers
 * @param body
 * @returns
 */
export declare const createNewLaboratoryItem: (headers: any, body: Partial<ItemGraphQL>) => Promise<AxiosUtilsResponse<ItemGraphQL>>;
