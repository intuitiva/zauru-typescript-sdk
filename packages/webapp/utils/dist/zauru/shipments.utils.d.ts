import type { Session } from "@remix-run/node";
import { AxiosUtilsResponse, ShipmentGraphQL } from "@zauru-sdk/types";
/**
 *
 * @param headers
 * @param session
 * @returns
 */
export declare const getShipmentsToMyAgency: (session: Session) => Promise<AxiosUtilsResponse<ShipmentGraphQL[]>>;
/**
 *
 * @param headers
 * @param session
 * @param props
 * @returns
 */
export declare const shipmentToVirtualClientAgency: (headers: any, session: Session, props: {
    deliver_quantity: number;
    item_id: number;
    esPerecedero?: boolean;
}) => Promise<AxiosUtilsResponse<boolean>>;
