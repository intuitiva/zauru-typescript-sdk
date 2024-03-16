import type { Session } from "@remix-run/node";
import { AxiosUtilsResponse, WebAppRowGraphQL, ConsolidatedHistory, WebAppTableUpdateResponse } from "@zauru-sdk/types";
/**
 * Get getConsolidatedHistories from the web app table.
 * @param headers Request headers.
 * @param session Session object.
 * @returns A Promise of AxiosUtilsResponse<ConsolidatedHistory[]>.
 */
export declare function getConsolidatedHistories(headers: any, session: Session): Promise<AxiosUtilsResponse<WebAppRowGraphQL<ConsolidatedHistory>[]>>;
/**
 * Create a template in the web app table.
 * @param headers Request headers.
 * @param session Session object.
 * @param body ConsolidatedHistory data to be created.
 * @returns A Promise of AxiosUtilsResponse<ConsolidatedHistory>.
 */
export declare function createConsolidatedHistory(headers: any, session: Session, body: ConsolidatedHistory): Promise<AxiosUtilsResponse<WebAppTableUpdateResponse>>;
/**
 * Put updateConsolidatedHistory from the web app table.
 * @param headers Request headers.
 * @param session Session object.
 * @returns A Promise of AxiosUtilsResponse<ConsolidatedHistory[]>.
 */
export declare function updateConsolidatedHistory(headers: any, session: Session, body: ConsolidatedHistory, id_registro: string | number): Promise<AxiosUtilsResponse<WebAppTableUpdateResponse>>;
