import type { Session } from "@remix-run/node";
import { AxiosUtilsResponse, WebAppRowGraphQL, DischargeHistory, WebAppTableUpdateResponse } from "@zauru-sdk/types";
/**
 * Get getDischargeHistories from the web app table.
 * @param headers Request headers.
 * @param session Session object.
 * @returns A Promise of AxiosUtilsResponse<DischargeHistory[]>.
 */
export declare function getDischargeHistories(headers: any, session: Session): Promise<AxiosUtilsResponse<WebAppRowGraphQL<DischargeHistory>[]>>;
/**
 * Create a template in the web app table.
 * @param headers Request headers.
 * @param session Session object.
 * @param body DischargeHistory data to be created.
 * @returns A Promise of AxiosUtilsResponse<DischargeHistory>.
 */
export declare function createDischargeHistory(headers: any, session: Session, body: DischargeHistory): Promise<AxiosUtilsResponse<WebAppTableUpdateResponse>>;
/**
 * Put updateDischargeHistory from the web app table.
 * @param headers Request headers.
 * @param session Session object.
 * @returns A Promise of AxiosUtilsResponse<DischargeHistory[]>.
 */
export declare function updateDischargeHistory(headers: any, session: Session, body: DischargeHistory, id_registro: string | number): Promise<AxiosUtilsResponse<WebAppTableUpdateResponse>>;
