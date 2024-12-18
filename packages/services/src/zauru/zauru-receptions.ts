import type { Session } from "@remix-run/node";
import {
  arrayToObject,
  getDatePickerCurrentDate,
  handlePossibleAxiosErrors,
} from "@zauru-sdk/common";
import {
  AxiosUtilsResponse,
  PurchaseOrderGraphQL,
  ReceptionDetailsGraphQL,
  ReceptionGraphQL,
} from "@zauru-sdk/types";
import { httpZauru } from "./httpZauru.js";

/**
 * createNewReception
 * @param headers
 * @param body
 * @param purchase_order_id
 * @returns
 */
export type CreateNewPurchaseOrderReceptionType = Omit<
  Partial<ReceptionGraphQL>,
  "reception_details"
> & {
  reception_details?: Partial<ReceptionDetailsGraphQL>[];
};
export async function createNewReception(
  headers: any,
  body: CreateNewPurchaseOrderReceptionType,
  purchase_order_id: number | string
) {
  return handlePossibleAxiosErrors(async () => {
    const sendBody = {
      ...body,
      reception_details_attributes: arrayToObject(body.reception_details),
    };
    delete sendBody.reception_details;

    const response = await httpZauru.post(
      `/purchases/purchase_orders/${purchase_order_id}/receptions.json`,
      { reception: sendBody },
      { headers }
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

//TODO: PASARLO A UTILS
/**
 *
 * @param headers
 * @param poId
 * @returns
 */
export async function createNewLabPurchaseOrderReception(
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
        received_at: getDatePickerCurrentDate(),
        invoice_number: "",
        agency_id: session.get("agency_id"),
        entity_id: session.get("selectedEntity"),
        reception_details_attributes: arrayToObject(
          body?.purchase_order_details?.map((x) => {
            const temp: any = {
              item_id: x.item_id,
              purchase_order_detail_id: x.id,
            };

            if (x.expire_date) {
              temp.lot_delivered_quantity = [`${x.delivered_quantity}`];
              temp.lot_name = [body.id_number];
              temp.lot_expire = [x.expire_date];
              temp.lot_description = [body.id_number];
            } else {
              temp.quantity = x.delivered_quantity;
            }

            return temp;
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
