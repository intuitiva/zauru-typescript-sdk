import type { Session } from "@remix-run/node";
import { AxiosUtilsResponse } from "@zauru-sdk/types";
export type DeliveryDataTable = {
    zid: string;
    referencia: string;
    fechaEntregaEstimada: string;
    fechaEntrega: string;
    origen: string;
    destino: string;
    deliveryId: string;
};
/**
 * getDeliveriesFormated
 * @param headers
 * @param session
 */
export declare const getDeliveriesDataTableFormated: (headers: any, session: Session) => Promise<AxiosUtilsResponse<DeliveryDataTable[]>>;
