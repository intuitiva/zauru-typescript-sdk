import type { Session } from "@remix-run/node";
import { handlePossibleAxiosErrors } from "@zauru-sdk/common";
import { AxiosUtilsResponse, ShipmentGraphQL } from "@zauru-sdk/types";
import { getGraphQLAPIHeaders } from "../common.js";
import httpGraphQLAPI from "./httpGraphQL.js";
import { getShipmentsStringQuery } from "@zauru-sdk/graphql";
import httpZauru from "./httpZauru.js";

/**
 * getShipments
 */
export async function getShipments(
  session: Session,
  config: {
    agency_to_id: string | number;
    agency_from_id?: string | number;
    suffix?: string;
    id_number?: string;
    id_number_not_null?: boolean;
    id_number_not_empty?: boolean;
    withMovementLots?: boolean;
  }
): Promise<AxiosUtilsResponse<ShipmentGraphQL[]>> {
  return handlePossibleAxiosErrors(async () => {
    const headers = await getGraphQLAPIHeaders(session);

    const query = getShipmentsStringQuery({
      agency_to_id: Number(config.agency_to_id),
      agency_from_id: config.agency_from_id
        ? Number(config.agency_from_id)
        : undefined,
      suffix: config.suffix,
      id_number: config.id_number,
      id_number_not_null: config.id_number_not_null,
      id_number_not_empty: config.id_number_not_empty,
      withMovementLots: config.withMovementLots,
    });

    const response = await httpGraphQLAPI.post<{
      data: { shipments: ShipmentGraphQL[] };
      errors?: {
        message: string;
        extensions: { path: string; code: string };
      }[];
    }>(
      "",
      {
        query,
      },
      { headers }
    );

    if (response.data.errors) {
      throw new Error(response.data.errors.map((x) => x.message).join(";"));
    }

    const registers = response?.data?.data?.shipments;

    return registers;
  });
}

/**
 * receiveShipment_booking
 * @param headers
 * @param id
 * @returns
 */
export async function receiveShipment_booking(
  headers: any,
  id: string | number
): Promise<AxiosUtilsResponse<boolean>> {
  return handlePossibleAxiosErrors(async () => {
    const response = await httpZauru.get<any>(
      `/inventories/bookings/${id}/deliver.json`,
      { headers }
    );

    if (!response.data) {
      throw new Error(
        "Sin respuesta de: /inventories/bookings/id/deliver.json"
      );
    }

    return true;
  });
}

/**
 * despacharShipment_booking
 * Esta función cambia el atributo 'shipment' de los envíos a 'true', lo que indica que el envío está en tránsito.
 * Esto es utilizado para marcar los envíos que necesitan ser entregados en las tablas como "En tránsito".
 * @param headers
 * @param id
 * @returns
 */
export async function despacharShipment_booking(
  headers: any,
  id: string | number
): Promise<AxiosUtilsResponse<boolean>> {
  return handlePossibleAxiosErrors(async () => {
    await httpZauru.get<any>(`/inventories/bookings/${id}/ship`, { headers });

    return true;
  });
}

/**
 * deleteShipment_booking
 * @param headers
 * @param id
 * @returns
 */
export async function deleteShipment_booking(
  headers: any,
  id: string | number
): Promise<AxiosUtilsResponse<boolean>> {
  return handlePossibleAxiosErrors(async () => {
    await httpZauru.delete<any>(`/inventories/bookings/${id}.json`, {
      headers,
    });
    return true;
  });
}
