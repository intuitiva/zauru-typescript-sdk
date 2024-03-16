import type { Session } from "@remix-run/node";
import {
  arrayToObject,
  getDatePickerCurrentDate,
  handlePossibleAxiosErrors,
} from "@zauru-sdk/common";
import {
  AxiosUtilsResponse,
  NewReceptionBody,
  PurchaseOrderGraphQL,
} from "@zauru-sdk/types";
import httpZauru from "./httpZauru.server.js";

/**
 * createNewReception
 * @param headers
 * @param body
 * @param purchase_order_id
 * @returns
 */
export async function createNewReception(
  headers: any,
  body: NewReceptionBody,
  purchase_order_id: number | string
) {
  return handlePossibleAxiosErrors(async () => {
    const response = await httpZauru<any>(
      `/purchases/purchase_orders/${purchase_order_id}/receptions.json`,
      { method: "POST", headers, data: body }
    );

    return response.data;
  });
}

/**
 * deleteReception
 * @param headers
 * @param id
 * @returns
 */
export async function deleteReception(
  headers: any,
  receptionId: string | number,
  poId: string | number
): Promise<AxiosUtilsResponse<boolean>> {
  return handlePossibleAxiosErrors(async () => {
    await httpZauru.get(
      `/purchases/receptions/${receptionId}/rebound.json?purchase_order_id=${poId}`,
      {
        headers,
      }
    );

    return true;
  });
}

/**
 *
 * @param headers
 * @param poId
 * @returns
 */
export async function createNewPurchaseOrderReception(
  headers: any,
  session: Session,
  body: Partial<PurchaseOrderGraphQL>
): Promise<AxiosUtilsResponse<boolean>> {
  return handlePossibleAxiosErrors(async () => {
    const sendBody = {
      reception: {
        memo: "LABORATORIO - Recibido parcialmente desde WebApp",
        purchase_order_id: body.id,
        needs_transit: false,
        agency_id: session.get("agency_id"),
        entity_id: session.get("selectedEntity"),
        received_at: getDatePickerCurrentDate(),
        invoice_number: "",
        reception_details_attributes: arrayToObject(
          body?.purchase_order_details?.map((x) => {
            return {
              item_id: x.item_id,
              purchase_order_detail_id: x.id,
              quantity: x.delivered_quantity,
            };
          })
        ),
      },
      purchase_order_id: body.id,
    };

    await httpZauru.post(
      `/purchases/purchase_orders/${body.id}/receptions.json`,
      sendBody,
      {
        headers,
      }
    );

    return true;
  });
}

/**
 *
 * @param headers
 * @param poId
 * @returns
 */
export async function createNewLotPurchaseOrderReception(
  headers: any,
  session: Session,
  body: Partial<PurchaseOrderGraphQL> & { fechaVencimiento: string }
): Promise<AxiosUtilsResponse<boolean>> {
  return handlePossibleAxiosErrors(async () => {
    const sendBody = {
      memo: "LABORATORIO - Recibido parcialmente desde WebApp",
      purchase_order_id: body.id,
      needs_transit: false,
      received_at: getDatePickerCurrentDate(),
      invoice_number: "",
      agency_id: session.get("agency_id"),
      entity_id: session.get("selectedEntity"),
      reception_details_attributes: arrayToObject(
        body?.purchase_order_details?.map((x) => {
          return {
            item_id: x.item_id,
            purchase_order_detail_id: x.id,
            lot_delivered_quantity: [x.delivered_quantity],
            lot_name: [body.id_number],
            lot_expire: [body.fechaVencimiento],
          };
        })
      ),
    };

    await httpZauru.post(
      `/purchases/purchase_orders/${body.id}/receptions.json`,
      { reception: sendBody, purchase_order_id: body.id },
      {
        headers,
      }
    );

    return true;
  });
}
