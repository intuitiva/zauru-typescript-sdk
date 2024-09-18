import type { Session } from "@remix-run/node";
import { AxiosUtilsResponse, QueueFormReceptionWebAppTable, WebAppRowGraphQL, WebAppTableUpdateResponse } from "@zauru-sdk/types";
export declare const ESTADOS_COLA_RECEPCIONES: {
    EN_PROCESO: string;
    ERROR: string;
    REINTENTANDO: string;
    PENDIENTE_DE_REINTENTO: string;
    OFFLINE: string;
};
/**
 * Get getQueueFormReceptionHistories from the web app table.
 * @param headers Request headers.
 * @param session Session object.
 * @returns A Promise of AxiosUtilsResponse<QueueFormReceptionWebAppTable[]>.
 */
export declare const getQueueFormReceptionHistories: (headers: any, session: Session) => Promise<AxiosUtilsResponse<WebAppRowGraphQL<QueueFormReceptionWebAppTable>[]>>;
/**
 * Get getQueueFormReceptionHistories from the web app table.
 * @param headers Request headers.
 * @param session Session object.
 * @returns A Promise of AxiosUtilsResponse<QueueFormReceptionWebAppTable[]>.
 */
export declare const getQueueFormReceptionHistoryByID: (session: Session, id: string | number) => Promise<AxiosUtilsResponse<QueueFormReceptionWebAppTable | null>>;
/**
 * Create a template in the web app table.
 * @param headers Request headers.
 * @param session Session object.
 * @param body QueueFormReceptionWebAppTable data to be created.
 * @returns A Promise of AxiosUtilsResponse<QueueFormReceptionWebAppTable>.
 */
export declare const createQueueFormReceptionHistory: (headers: any, session: Session, body: QueueFormReceptionWebAppTable) => Promise<AxiosUtilsResponse<WebAppTableUpdateResponse>>;
/**
 * Put updateQueueFormReception from the web app table.
 * @param headers Request headers.
 * @param session Session object.
 * @returns A Promise of AxiosUtilsResponse<QueueFormReceptionWebAppTable[]>.
 */
export declare const updateQueueFormReceptionHistory: (headers: any, session: Session, body: Partial<QueueFormReceptionWebAppTable>, id_registro: string | number) => Promise<AxiosUtilsResponse<WebAppTableUpdateResponse>>;
/**
 * Delete QueueFormReceptionHistory from the web app table.
 * @param headers Request headers.
 * @param session Session object.
 * @returns A Promise of AxiosUtilsResponse<QueueFormReceptionWebAppTable[]>.
 */
export declare const deleteQueueFormReceptionHistory: (headers: any, session: Session, id: string) => Promise<AxiosUtilsResponse<WebAppTableUpdateResponse>>;
