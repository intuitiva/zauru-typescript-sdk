import type { Session } from "@remix-run/node";
import { AxiosUtilsResponse, QueueShipmentsForm, WebAppRowGraphQL, WebAppTableUpdateResponse } from "@zauru-sdk/types";
/**
 * Get getQueueShipmentsFormHistories from the web app table.
 * @param headers Request headers.
 * @param session Session object.
 * @returns A Promise of AxiosUtilsResponse<QueueShipmentsForm[]>.
 */
export declare const getQueueShipmentsFormHistories: (headers: any, session: Session) => Promise<AxiosUtilsResponse<WebAppRowGraphQL<QueueShipmentsForm>[]>>;
/**
 * Get getQueueFormReceptionHistories from the web app table.
 * @param headers Request headers.
 * @param session Session object.
 * @returns A Promise of AxiosUtilsResponse<QueueShipmentsForm[]>.
 */
export declare const getQueueFormReceptionHistoryByID: (session: Session, id: string | number) => Promise<AxiosUtilsResponse<QueueShipmentsForm | null>>;
/**
 * Create a template in the web app table.
 * @param headers Request headers.
 * @param session Session object.
 * @param body QueueShipmentsForm data to be created.
 * @returns A Promise of AxiosUtilsResponse<QueueShipmentsForm>.
 */
export declare const createQueueFormReceptionHistory: (headers: any, session: Session, body: QueueShipmentsForm) => Promise<AxiosUtilsResponse<WebAppTableUpdateResponse>>;
/**
 * Put updateQueueFormReception from the web app table.
 * @param headers Request headers.
 * @param session Session object.
 * @returns A Promise of AxiosUtilsResponse<QueueShipmentsForm[]>.
 */
export declare const updateQueueFormReceptionHistory: (headers: any, session: Session, body: Partial<QueueShipmentsForm>, id_registro: string | number) => Promise<AxiosUtilsResponse<WebAppTableUpdateResponse>>;
/**
 * Delete QueueFormReceptionHistory from the web app table.
 * @param headers Request headers.
 * @param session Session object.
 * @returns A Promise of AxiosUtilsResponse<QueueShipmentsForm[]>.
 */
export declare const deleteQueueFormReceptionHistory: (headers: any, session: Session, id: string) => Promise<AxiosUtilsResponse<WebAppTableUpdateResponse>>;
