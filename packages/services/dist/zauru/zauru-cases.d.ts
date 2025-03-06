import type { Session } from "@remix-run/node";
import { AxiosUtilsResponse, CaseGraphQL } from "@zauru-sdk/types";
/**
 * getCasesByResponsibleId
 */
export declare function getCasesByResponsibleId(session: Session, filters?: {
    responsible_id?: number;
    closed?: boolean;
    client_id?: number;
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
