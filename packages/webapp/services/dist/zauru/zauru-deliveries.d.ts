import { AxiosUtilsResponse, DataTablesFilterBody, HTMLDataTableDeliveries, ShipmentGraphQL } from "@zauru-sdk/types";
/**
 * getDelivery
 * @param headers
 * @param body
 * @returns
 */
export declare function getDelivery(headers: any, idDelivery: string): Promise<AxiosUtilsResponse<ShipmentGraphQL>>;
/**
 * GET DELIVERIES DATA TABLES
 * @param headers
 * @param body
 * @returns
 */
export declare function getDeliveriesDataTables(headers: any, body: DataTablesFilterBody): Promise<AxiosUtilsResponse<HTMLDataTableDeliveries>>;
/**
 * deleteDelivery
 * Esta función elimina (devuelve) un envío que ya ha sido entregado.
 * @param headers
 * @param id
 * @returns
 */
export declare function deleteDelivery(headers: any, id: string | number): Promise<AxiosUtilsResponse<boolean>>;
