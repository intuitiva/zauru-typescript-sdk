import type { Session } from "@remix-run/node";
import { AxiosUtilsResponse, BundleGraphQL } from "@zauru-sdk/types";
export declare const LAB_BUNDLE_NAME = "LAB_BUNDLE_RECIP_";
/**
 *
 * @param headers
 * @param session
 * @returns
 */
export declare const getBundlesRecipByLabCategory: (headers: any, session: Session) => Promise<AxiosUtilsResponse<BundleGraphQL[]>>;
/**
 *
 * @param headers
 * @param session
 * @returns
 */
export declare const getBundlesByLabCategory: (headers: any, session: Session) => Promise<AxiosUtilsResponse<BundleGraphQL[]>>;
/**
 * createNewLabPaquete
 * @param headers
 * @param session
 * @returns
 */
export declare const createNewLabPaquete: (headers: any, session: Session, body: Partial<BundleGraphQL>) => Promise<AxiosUtilsResponse<boolean>>;
/**
 * createNewLabEnsayo
 * @param headers
 * @param session
 * @returns
 */
export declare const createNewLabEnsayo: (headers: any, session: Session, body: Partial<BundleGraphQL>) => Promise<AxiosUtilsResponse<boolean>>;
/**
 * deleteLabBundle
 * @param headers
 * @param session
 * @param bundle
 * @returns
 */
export declare const deleteLabBundle: (headers: any, session: Session, bundle: BundleGraphQL) => Promise<AxiosUtilsResponse<boolean>>;
