import type { Session } from "@remix-run/node";
import { arrayToObject, handlePossibleAxiosErrors } from "@zauru-sdk/common";
import { getProductionWorkOrderStringQuery } from "@zauru-sdk/graphql";
import {
  AxiosUtilsResponse,
  CloseOpenWorkOrderBody,
  CloseOpenWorkOrderDetailInput,
  CloseOpenWorkOrderResponse,
  DataTablesFilterBody,
  OpenWorkOrdersDataTableResponse,
  ProductionWorkOrderDetailGraphQL,
  ProductionWorkOrderGraphQL,
} from "@zauru-sdk/types";
import { getGraphQLAPIHeaders } from "../common.js";
import { httpGraphQLAPI } from "./httpGraphQL.js";
import { httpZauru } from "./httpZauru.js";

type CloseDetailSource =
  | ProductionWorkOrderDetailGraphQL
  | CloseOpenWorkOrderDetailInput;

/**
 * getProductionWorkOrder
 * @param session
 * @param config
 * @returns
 */
export async function getProductionWorkOrder(
  session: Session,
  config: {
    id: number | string;
    closed?: boolean;
    voided?: boolean;
  },
): Promise<AxiosUtilsResponse<ProductionWorkOrderGraphQL>> {
  return handlePossibleAxiosErrors(async () => {
    const headers = await getGraphQLAPIHeaders(session);

    const response = await httpGraphQLAPI.post<{
      data: { production_work_orders: ProductionWorkOrderGraphQL[] };
      errors?: {
        message: string;
        extensions: { path: string; code: string };
      }[];
    }>(
      "",
      {
        query: getProductionWorkOrderStringQuery({
          id: config.id,
          closed: config.closed ?? false,
          voided: config.voided ?? false,
        }),
      },
      { headers },
    );

    if (response.data.errors) {
      throw new Error(response.data.errors.map((x) => x.message).join(";"));
    }

    const workOrder = response.data.data.production_work_orders[0];
    if (!workOrder) {
      throw new Error("Production work order not found");
    }

    return workOrder;
  });
}

/**
 * getOpenWorkOrdersDataTables
 * @param headers
 * @param body
 * @returns
 */
export const getOpenWorkOrdersDataTables = (
  headers: any,
  body: DataTablesFilterBody,
): Promise<AxiosUtilsResponse<OpenWorkOrdersDataTableResponse>> => {
  return handlePossibleAxiosErrors(async () => {
    const response = await httpZauru.post<OpenWorkOrdersDataTableResponse>(
      `/production/open_work_orders/datatables.json`,
      body,
      { headers },
    );

    return response.data;
  });
};

/**
 * buildCloseOpenWorkOrderBody
 * @param details
 * @param options
 * @returns
 */
export const buildCloseOpenWorkOrderBody = (
  details: CloseDetailSource[],
  options?: { defaultDeliveredToBooked?: boolean },
): CloseOpenWorkOrderBody => {
  const defaultDeliveredToBooked = options?.defaultDeliveredToBooked ?? true;

  const work_order_details_attributes: CloseOpenWorkOrderDetailInput[] =
    details.map((detail) => {
      const deliveredQuantity = defaultDeliveredToBooked
        ? (detail.delivered_quantity ?? detail.booked_quantity)
        : detail.delivered_quantity;

      return {
        id: detail.id,
        item_id: detail.item_id,
        bundle_id: detail.bundle_id,
        cost_center_id: detail.cost_center_id,
        lot_id: detail.lot_id,
        serial_id: detail.serial_id,
        booked_quantity: detail.booked_quantity,
        delivered_quantity:
          deliveredQuantity === null || deliveredQuantity === undefined
            ? undefined
            : deliveredQuantity,
        reference: detail.reference,
      };
    });

  return {
    production_work_order: {
      work_order_details_attributes,
    },
  };
};

/**
 * closeOpenWorkOrder
 * @param headers
 * @param id
 * @param body
 * @returns
 */
export const closeOpenWorkOrder = (
  headers: any,
  id: number | string,
  body?: CloseOpenWorkOrderBody,
): Promise<AxiosUtilsResponse<CloseOpenWorkOrderResponse>> => {
  return handlePossibleAxiosErrors(async () => {
    const sendBody = body ?? { production_work_order: {} };

    const normalizedBody = sendBody.production_work_order
      ?.work_order_details_attributes
      ? {
          production_work_order: {
            work_order_details_attributes: arrayToObject(
              sendBody.production_work_order.work_order_details_attributes,
            ),
          },
        }
      : sendBody;

    const response = await httpZauru.patch<CloseOpenWorkOrderResponse>(
      `/production/open_work_orders/${id}/update_close.json`,
      normalizedBody,
      { headers },
    );

    return response.data;
  });
};

/**
 * closeOpenWorkOrderWithBookedQuantities
 * @param headers
 * @param session
 * @param id
 * @returns
 */
export const closeOpenWorkOrderWithBookedQuantities = async (
  headers: any,
  session: Session,
  id: number | string,
): Promise<AxiosUtilsResponse<CloseOpenWorkOrderResponse>> => {
  const workOrderResult = await getProductionWorkOrder(session, {
    id,
    closed: false,
    voided: false,
  });

  if (workOrderResult.error) {
    return workOrderResult;
  }

  const details = workOrderResult.data?.production_work_order_details ?? [];

  if (details.length === 0) {
    return closeOpenWorkOrder(headers, id);
  }

  const body = buildCloseOpenWorkOrderBody(details, {
    defaultDeliveredToBooked: true,
  });

  return closeOpenWorkOrder(headers, id, body);
};
