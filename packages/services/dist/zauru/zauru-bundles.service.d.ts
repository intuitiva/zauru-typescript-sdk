import type { Session } from "@remix-run/node";
import { AxiosUtilsResponse, BundleGraphQL } from "@zauru-sdk/types";
/**
 * getBundlesByItemCategoryId
 */
export declare function getBundlesByItemCategoryId(session: Session, id: string): Promise<AxiosUtilsResponse<BundleGraphQL[]>>;
/**
 * getBundleByName
 */
export declare function getBundleByName(session: Session, name: string): Promise<AxiosUtilsResponse<BundleGraphQL>>;
/**
 * createBundle
 * @param headers
 * @param body
 */
export declare function createBundle(headers: any, body: Partial<BundleGraphQL>): Promise<AxiosUtilsResponse<BundleGraphQL>>;
/**
 * updateBundle
 * @param headers
 * @param body
 */
export declare function updateBundle(headers: any, body: Partial<BundleGraphQL>): Promise<AxiosUtilsResponse<BundleGraphQL>>;
/**
 * deleteBundle
 * @param headers
 * @param body
 */
export declare function deleteBundle(headers: any, id: string | number): Promise<AxiosUtilsResponse<boolean>>;
