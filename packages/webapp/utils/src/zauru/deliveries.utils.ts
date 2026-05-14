import type { Session } from "@remix-run/node";
import { extractValueBetweenTags } from "@zauru-sdk/common";
import { getDeliveriesDataTables } from "@zauru-sdk/services";
import {
  AxiosUtilsResponse,
  DataTablesFilterBody,
  DeliveryHTMLDataTable,
} from "@zauru-sdk/types";

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
export const getDeliveriesDataTableFormated = async (
  headers: any,
  session: Session
): Promise<AxiosUtilsResponse<DeliveryDataTable[]>> => {
  const body: DataTablesFilterBody = {
    order: {
      "0": {
        column: "0",
        dir: "desc",
      },
    },
    start: 0,
    length: 40,
    search: {
      value: "",
      regex: false,
    },
    agency: session.get("agency_id"),
  };
  const response = await getDeliveriesDataTables(headers, body);

  if (response.error) {
    return { ...response, data: [] } as AxiosUtilsResponse<DeliveryDataTable[]>;
  }

  const deliveries: DeliveryDataTable[] =
    response.data?.data?.map((x: DeliveryHTMLDataTable) =>
      formatHTMLDeliveryList(x)
    ) ?? [];

  return { ...response, data: deliveries } as AxiosUtilsResponse<
    DeliveryDataTable[]
  >;
};

/**
 * formatHTMLDeliveryList
 * @param delivery
 * @returns
 */
const formatHTMLDeliveryList = (
  delivery: DeliveryHTMLDataTable
): DeliveryDataTable => {
  return {
    zid: extractValueBetweenTags(delivery.zid, "a"),
    referencia: extractValueBetweenTags(delivery.ref, "a"),
    fechaEntrega: delivery.pd,
    fechaEntregaEstimada: delivery.dt,
    destino: delivery.at,
    origen: delivery.af,
    deliveryId: delivery.DT_RowId.replace("inventories-delivery-", ""),
  } as DeliveryDataTable;
};
