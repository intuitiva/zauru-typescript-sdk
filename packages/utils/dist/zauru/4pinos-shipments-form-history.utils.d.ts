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
 * Get getQueueShipmentsFormHistories from the web app table.
 * @param headers Request headers.
 * @param session Session object.
 * @returns A Promise of AxiosUtilsResponse<QueueShipmentsForm[]>.
 */
export declare const getQueueShipmentsFormHistoryByID: (session: Session, id: string | number) => Promise<AxiosUtilsResponse<QueueShipmentsForm | null>>;
/**
 * Create a template in the web app table.
 * @param headers Request headers.
 * @param session Session object.
 * @param body QueueShipmentsForm data to be created.
 * @returns A Promise of AxiosUtilsResponse<QueueShipmentsForm>.
 */
export declare const createQueueShipmentsFormHistory: (headers: any, session: Session, body: QueueShipmentsForm) => Promise<AxiosUtilsResponse<WebAppTableUpdateResponse>>;
/**
 * Put updateQueueShipmentsForm from the web app table.
 * @param headers Request headers.
 * @param session Session object.
 * @returns A Promise of AxiosUtilsResponse<QueueShipmentsForm[]>.
 */
export declare const updateQueueShipmentsFormHistory: (headers: any, session: Session, body: Partial<QueueShipmentsForm>, id_registro: string | number) => Promise<AxiosUtilsResponse<WebAppTableUpdateResponse>>;
/**
 * Delete QueueShipmentsFormHistory from the web app table.
 * @param headers Request headers.
 * @param session Session object.
 * @returns A Promise of AxiosUtilsResponse<QueueShipmentsForm[]>.
 */
export declare const deleteQueueShipmentsFormHistory: (headers: any, session: Session, id: string) => Promise<AxiosUtilsResponse<WebAppTableUpdateResponse>>;
