import type { Session } from "@remix-run/node";
import { AxiosUtilsResponse, CaseGraphQL } from "@zauru-sdk/types";
/**
 * getCases
 */
export declare function getCases(session: Session, filters?: {
    id?: number;
    responsible_id?: number;
    closed?: boolean;
    client_id?: number;
    tag_id?: string;
    limit?: number;
}): Promise<AxiosUtilsResponse<CaseGraphQL[]>>;
/**
 * createCase
 * @param headers
 * @param body
 * @returns
 */
export declare function createCase(headers: any, body: Partial<CaseGraphQL>): Promise<AxiosUtilsResponse<CaseGraphQL>>;
/**
 * updateCase
 * @param headers
 * @param body
 * @returns
 */
export declare function updateCase(headers: any, body: Partial<CaseGraphQL>): Promise<AxiosUtilsResponse<CaseGraphQL>>;
/**
 * deleteCase
 * @param headers
 * @param body
 */
export declare function deleteCase(headers: any, id: string | number): Promise<AxiosUtilsResponse<boolean>>;
/**
 * closeCase
 * @param headers
 * @param id
 * @returns
 */
export declare function closeCase(headers: any, id: string | number): Promise<AxiosUtilsResponse<boolean>>;
