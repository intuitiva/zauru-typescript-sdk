import type { Session } from "@remix-run/node";
import { handlePossibleAxiosErrors } from "@zauru-sdk/common";
import { AxiosUtilsResponse, ShipmentGraphQL } from "@zauru-sdk/types";
import { getGraphQLAPIHeaders } from "../common.js";
import httpGraphQLAPI from "./httpGraphQL.js";
import { getShipmentsByToAgencyLast100StringQuery } from "@zauru-sdk/graphql";
import httpZauru from "./httpZauru.js";

/**
 * getShipmentsByToAgencyLast100Id_booking
 */
export async function getShipmentsByToAgencyLast100Id_booking(
  session: Session,
  agency_to_id: string | number
): Promise<AxiosUtilsResponse<ShipmentGraphQL[]>> {
  return handlePossibleAxiosErrors(async () => {
    const headers = await getGraphQLAPIHeaders(session);

    const response = await httpGraphQLAPI.post<{
      data: { shipments: ShipmentGraphQL[] };
      errors?: {
        message: string;
        extensions: { path: string; code: string };
      }[];
    }>(
      "",
      {
        query: getShipmentsByToAgencyLast100StringQuery,
        variables: {
          agency_to_id,
        },
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
