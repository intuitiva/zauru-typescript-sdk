import type { Session } from "@remix-run/node";
import { AxiosUtilsResponse, ShipmentGraphQL } from "@zauru-sdk/types";
/**
 * getShipmentsByToAgencyLast100Id_booking
 */
export declare function getShipmentsByToAgencyLast100Id_booking(session: Session, agency_to_id: string | number): Promise<AxiosUtilsResponse<ShipmentGraphQL[]>>;
/**
 * receiveShipment_booking
 * @param headers
 * @param id
 * @returns
 */
export declare function receiveShipment_booking(headers: any, id: string | number): Promise<AxiosUtilsResponse<boolean>>;
/**
 * deleteShipment_booking
 * @param headers
 * @param id
 * @returns
 */
export declare function deleteShipment_booking(headers: any, id: string | number): Promise<AxiosUtilsResponse<boolean>>;
