import type { Session } from "@remix-run/node";
import { AxiosUtilsResponse, PayeeCategoryGraphQL, PayeeGraphQL } from "@zauru-sdk/types";
/**
 * getPayees
 * @param headers
 * @returns
 */
export declare function getPayees(session: Session, filters?: {
    id_number?: string;
    name?: string;
    vendor?: boolean;
    tin?: string;
}): Promise<AxiosUtilsResponse<PayeeGraphQL[]>>;
/**
 * getProviders
 * @param headers
 * @returns
 */
export declare function getProviders(session: Session): Promise<AxiosUtilsResponse<PayeeGraphQL[]>>;
/**
 * getPayee
 * @param session
 * @param id
 */
export declare function getPayee(session: Session, id: number | string): Promise<AxiosUtilsResponse<PayeeGraphQL | undefined>>;
/**
 * getCreatePayee
 * @param headers
 * @param session
 * @param id
 * @returns
 */
export declare function getCreatePayee(headers: any, search: {
    tin?: string;
}): Promise<AxiosUtilsResponse<PayeeGraphQL | undefined>>;
/**
 * getPayeesByCategoryId
 * @param session
 * @param categoryId
 * @returns
 */
export declare function getPayeesByCategoryId(session: Session, id: number | string): Promise<AxiosUtilsResponse<PayeeGraphQL[]>>;
/**
 * getPayeeCategoriesByNotesMatch
 * @param session
 * @param match
 * @returns
 */
export declare function getPayeeCategoriesByNotesMatch(session: Session, match: string): Promise<AxiosUtilsResponse<PayeeCategoryGraphQL[]>>;
/**
 * getPayeeCategories
 * @param session
 * @param match
 * @returns
 */
export declare function getPayeeCategories(session: Session): Promise<AxiosUtilsResponse<PayeeCategoryGraphQL[]>>;
/**
 * getProviderCategories
 * @param session
 * @param match
 * @returns
 */
export declare function getProviderCategories(session: Session): Promise<AxiosUtilsResponse<PayeeCategoryGraphQL[]>>;
/**
 * getProviderCategories
 * @param session
 * @param match
 * @returns
 */
export declare function getClientCategories(session: Session): Promise<AxiosUtilsResponse<PayeeCategoryGraphQL[]>>;
/**
 * createPayee
 * @param session
 * @param headers
 * @returns
 */
export declare function createPayee(headers: any, body: Partial<PayeeGraphQL>): Promise<AxiosUtilsResponse<PayeeGraphQL>>;
/**
 * deletePayee
 * @param headers
 * @param id
 * @returns
 */
export declare function deletePayee(headers: any, id: string | number): Promise<AxiosUtilsResponse<boolean>>;
/**
 * updatePayee
 * @param session
 * @param headers
 * @returns
 */
export declare function updatePayee(headers: any, body: Partial<PayeeGraphQL>): Promise<AxiosUtilsResponse<boolean>>;
/**
 * createPayeeCategory
 * @param session
 * @param headers
 * @returns
 */
export declare function createPayeeCategory(headers: any, body: Partial<PayeeCategoryGraphQL>): Promise<AxiosUtilsResponse<PayeeCategoryGraphQL>>;
/**
 * updatePayeeCategory
 * @param session
 * @param headers
 * @returns
 */
export declare function updatePayeeCategory(headers: any, body: Partial<PayeeCategoryGraphQL>): Promise<AxiosUtilsResponse<boolean>>;
/**
 * deletePayeeCategory
 * @param headers
 * @param id
 * @returns
 */
export declare function deletePayeeCategory(headers: any, id: string | number): Promise<AxiosUtilsResponse<boolean>>;
