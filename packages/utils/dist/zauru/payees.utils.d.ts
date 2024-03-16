import type { Session } from "@remix-run/node";
import { AxiosUtilsResponse, PayeeCategoryGraphQL, PayeeGraphQL } from "@zauru-sdk/types";
export declare const TEXT_PAYEE_CATEGORY_NOTES_FOR_PRICE = "CATEGORIA_QUE_REPRESENTA_UN_PRECIO_DE_LABORATORIO (No borrar esto): ";
export declare const TEXT_PAYEE_CATEGORY_NAME_FOR_PRICE = "CAT-LABORATORIO: ";
/**
 * getClientesLaboratorio
 * @param session
 * @param headers
 * @returns
 */
export declare function getClientesLaboratorio(session: Session): Promise<AxiosUtilsResponse<PayeeGraphQL[]>>;
/**
 * createNewLaboratoryClient
 * @param session
 * @param headers
 * @param body
 * @returns
 */
export declare function createNewLaboratoryClient(headers: any, body: Partial<PayeeGraphQL>): Promise<AxiosUtilsResponse<boolean>>;
/**
 * createNewLaboratoryClientCategoryPrice
 * @param session
 * @param headers
 * @param body
 * @returns
 */
export declare function updateLaboratoryClientCategoryPrice(headers: any, body: Partial<PayeeCategoryGraphQL>): Promise<AxiosUtilsResponse<boolean>>;
/**
 * createNewLaboratoryClientCategoryPrice
 * @param session
 * @param headers
 * @param body
 * @returns
 */
export declare function createNewLaboratoryClientCategoryPrice(headers: any, session: Session, body: Partial<PayeeCategoryGraphQL>): Promise<AxiosUtilsResponse<boolean>>;
/**
 * deleteLaboratoryClientCategoryPrice
 * @param headers
 * @param body
 * @returns
 */
export declare function deleteLaboratoryClientCategoryPrice(headers: any, body: Partial<PayeeCategoryGraphQL>): Promise<AxiosUtilsResponse<boolean>>;
