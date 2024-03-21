import type { Session } from "@remix-run/node";
import { AxiosUtilsResponse, QueueFormReceptionWebAppTable, WebAppRowGraphQL, WebAppTableUpdateResponse } from "@zauru-sdk/types";
export declare const ESTADOS_COLA_RECEPCIONES: {
    EN_PROCESO: string;
    ERROR: string;
    REINTENTANDO: string;
    OFFLINE: string;
};
/**
 * Get getQueueFormReceptionHistories from the web app table.
 * @param headers Request headers.
 * @param session Session object.
 * @returns A Promise of AxiosUtilsResponse<QueueFormReceptionWebAppTable[]>.
 */
export declare function getQueueFormReceptionHistories(headers: any, session: Session): Promise<AxiosUtilsResponse<WebAppRowGraphQL<QueueFormReceptionWebAppTable>[]>>;
/**
 * Create a template in the web app table.
 * @param headers Request headers.
 * @param session Session object.
 * @param body QueueFormReceptionWebAppTable data to be created.
 * @returns A Promise of AxiosUtilsResponse<QueueFormReceptionWebAppTable>.
 */
export declare function createQueueFormReceptionHistory(headers: any, session: Session, body: QueueFormReceptionWebAppTable): Promise<AxiosUtilsResponse<WebAppTableUpdateResponse>>;
/**
 * Put updateQueueFormReception from the web app table.
 * @param headers Request headers.
 * @param session Session object.
 * @returns A Promise of AxiosUtilsResponse<QueueFormReceptionWebAppTable[]>.
 */
export declare function updateQueueFormReceptionHistory(headers: any, session: Session, body: Partial<QueueFormReceptionWebAppTable>, id_registro: string | number): Promise<AxiosUtilsResponse<WebAppTableUpdateResponse>>;
/**
 * Delete QueueFormReceptionHistory from the web app table.
 * @param headers Request headers.
 * @param session Session object.
 * @returns A Promise of AxiosUtilsResponse<QueueFormReceptionWebAppTable[]>.
 */
export declare function deleteQueueFormReceptionHistory(headers: any, session: Session, id: string): Promise<AxiosUtilsResponse<WebAppTableUpdateResponse>>;
