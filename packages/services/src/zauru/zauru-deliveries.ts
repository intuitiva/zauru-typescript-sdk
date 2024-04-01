import { handlePossibleAxiosErrors } from "@zauru-sdk/common";
import {
  AxiosUtilsResponse,
  DataTablesFilterBody,
  HTMLDataTableDeliveries,
  ShipmentGraphQL,
} from "@zauru-sdk/types";
import httpZauru from "./httpZauru.js";

/**
 * getDelivery
 * @param headers
 * @param body
 * @returns
 */
export async function getDelivery(
  headers: any,
  idDelivery: string
): Promise<AxiosUtilsResponse<ShipmentGraphQL>> {
  return handlePossibleAxiosErrors(async () => {
    const response = await httpZauru.get<ShipmentGraphQL>(
      `/inventories/deliveries/${idDelivery}.json`,
      {
        headers,
      }
    );
    return response.data;
  });
}

/**
 * GET DELIVERIES DATA TABLES
 * @param headers
 * @param body
 * @returns
 */
export async function getDeliveriesDataTables(
  headers: any,
  body: DataTablesFilterBody
): Promise<AxiosUtilsResponse<HTMLDataTableDeliveries>> {
  return handlePossibleAxiosErrors(async () => {
    const response = await httpZauru.post<HTMLDataTableDeliveries>(
      `/inventories/deliveries/datatables.json`,
      body,
      {
        headers,
      }
    );
    return response.data;
  });
}

/**
 * deleteDelivery
 * @param headers
 * @param id
 * @returns
 */
export async function deleteDelivery(
  headers: any,
  id: string | number
): Promise<AxiosUtilsResponse<boolean>> {
  return handlePossibleAxiosErrors(async () => {
    await httpZauru.delete(`/inventories/deliveries/${id}.json?destroy=true`, {
      headers,
    });

    return true;
  });
}
