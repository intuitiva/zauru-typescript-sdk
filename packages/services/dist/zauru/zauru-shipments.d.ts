import type { Session } from "@remix-run/node";
import { AxiosUtilsResponse, ShipmentGraphQL } from "@zauru-sdk/types";
/**
 * getShipments
 */
export declare function getShipments(session: Session, config: {
    agency_to_id: string | number;
    agency_from_id?: string | number;
    suffix?: string;
    id_number?: string;
    id_number_not_null?: boolean;
    id_number_not_empty?: boolean;
    withMovementLots?: boolean;
}): Promise<AxiosUtilsResponse<ShipmentGraphQL[]>>;
/**
 * receiveShipment_booking
 * @param headers
 * @param id
 * @returns
 */
export declare function receiveShipment_booking(headers: any, id: string | number): Promise<AxiosUtilsResponse<boolean>>;
/**
 * despacharShipment_booking
 * Esta función cambia el atributo 'shipment' de los envíos a 'true', lo que indica que el envío está en tránsito.
 * Esto es utilizado para marcar los envíos que necesitan ser entregados en las tablas como "En tránsito".
 * @param headers
 * @param id
 * @returns
 */
export declare function despacharShipment_booking(headers: any, id: string | number): Promise<AxiosUtilsResponse<boolean>>;
/**
 * deleteShipment_booking
 * @param headers
 * @param id
 * @returns
 */
export declare function deleteShipment_booking(headers: any, id: string | number): Promise<AxiosUtilsResponse<boolean>>;
