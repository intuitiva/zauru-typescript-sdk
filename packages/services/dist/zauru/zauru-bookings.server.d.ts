import { AxiosUtilsResponse, InsertBookingBody, ShipmentGraphQL } from "@zauru-sdk/types";
import { Session } from "@remix-run/node";
/**
 * insertBookings
 * @param headers
 * @param body
 * @returns
 */
export declare const insertBookings: (headers: any, body: Partial<InsertBookingBody>, temp_purchase_order_id?: string) => Promise<AxiosUtilsResponse<ShipmentGraphQL>>;
/**
 * getDeliveryByBooking
 * @param headers
 * @param shipment_id
 * @returns
 */
export declare const getDeliveryByBooking: (headers: any, shipment_id: number) => Promise<AxiosUtilsResponse<any>>;
/**
 * getBookings
 * @param headers
 * @returns
 */
export declare const getBookings: (session: Session, wheres?: string[]) => Promise<AxiosUtilsResponse<ShipmentGraphQL[]>>;
/**
 * getBookings
 * @param headers
 * @returns
 */
export declare const getBooking: (headers: any, booking_id: string) => Promise<AxiosUtilsResponse<ShipmentGraphQL>>;
