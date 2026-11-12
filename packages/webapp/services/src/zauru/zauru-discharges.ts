import type { Session } from "@remix-run/node";
import {
  AxiosUtilsResponse,
  DischargeDetailGraphQL,
  GeneratePDFBody,
  NewDischargeBody,
  PDFResult,
  PurchaseOrderGraphQL,
} from "@zauru-sdk/types";
import { getGraphQLAPIHeaders, getVariablesByName } from "../common.js";
import { handlePossibleAxiosErrors } from "@zauru-sdk/common";
import { getDischargeDetailsByPurchaseOrderIdsStringQuery } from "@zauru-sdk/graphql";
import { httpGraphQLAPI } from "./httpGraphQL.js";
import { httpZauru } from "./httpZauru.js";

/**
 *
 * @param headers
 * @returns
 */
export const createDischarge = async (
  session: Session,
  headers: any,
  body: NewDischargeBody
): Promise<AxiosUtilsResponse<{ id: number }>> => {
  return handlePossibleAxiosErrors(async () => {
    const { id_check_discharge_method } = await getVariablesByName(
      headers,
      session,
      ["id_check_discharge_method"]
    );

    body.discharge.discharge_method_id = id_check_discharge_method;

    const response = await httpZauru.post<{ id: number }>(
      `/purchases/discharges.json`,
      body,
      {
        headers,
      }
    );

    return response.data;
  });
};

/**
 * generateDischargePDF
 * @param headers
 * @param body
 */
export const generateDischargePDF = async (
  headers: any,
  session: Session,
  body: GeneratePDFBody
): Promise<AxiosUtilsResponse<{ status: number; zid: number }>> => {
  return handlePossibleAxiosErrors(async () => {
    const { discharge_template_id } = await getVariablesByName(
      headers,
      session,
      ["discharge_template_id"]
    );
    body.print_template = discharge_template_id;
    const response = await httpZauru.post<{ status: number; zid: number }>(
      "/purchases/discharges/gen_print_all.json",
      body,
      { headers }
    );

    return response.data;
  });
};

/**
 * getDischargePDFResult
 * @param headers
 * @param zid
 * @returns
 */
export const getDischargePDFResult = async (
  headers: any,
  zid: number | string
): Promise<AxiosUtilsResponse<PDFResult>> => {
  return handlePossibleAxiosErrors(async () => {
    const response = await httpZauru.get<PDFResult>(
      "purchases/discharges/check_print_all",
      {
        headers,
        params: { zid },
      }
    );
    return response.data;
  });
};

const dischargeDetailsFromRestPurchaseOrder = (
  purchaseOrder: PurchaseOrderGraphQL,
): DischargeDetailGraphQL[] =>
  (purchaseOrder.discharge_details ?? []).map((detail) => ({
    id: Number(detail.id),
    amount: Number(detail.amount ?? 0),
    exchange_amount: detail.exchange_amount ?? null,
    purchase_order_id: Number(
      detail.purchase_order_id ?? purchaseOrder.id,
    ),
    discharge_id: Number(detail.discharge_id ?? detail.discharge?.id ?? 0),
    discharge: detail.discharge,
  }));

export const getDischargeDetailsByPurchaseOrderIds = (
  session: Session,
  restHeaders: Record<string, string>,
  purchaseOrderIds: Array<number | string>,
): Promise<AxiosUtilsResponse<DischargeDetailGraphQL[]>> => {
  return handlePossibleAxiosErrors(async () => {
    const ids = [
      ...new Set(
        purchaseOrderIds
          .map((id) => Number(id))
          .filter((id) => Number.isFinite(id) && id > 0),
      ),
    ];
    if (ids.length === 0) {
      return [];
    }

    try {
      const graphqlHeaders = await getGraphQLAPIHeaders(session);
      const collected: DischargeDetailGraphQL[] = [];
      const chunkSize = 200;
      for (let index = 0; index < ids.length; index += chunkSize) {
        const chunk = ids.slice(index, index + chunkSize);
        const response = await httpGraphQLAPI.post<{
          data?: { discharge_details?: DischargeDetailGraphQL[] };
          errors?: { message: string }[];
        }>(
          "",
          {
            query: getDischargeDetailsByPurchaseOrderIdsStringQuery(chunk),
          },
          { headers: graphqlHeaders },
        );
        if (response.data?.errors?.length) {
          throw new Error(
            response.data.errors.map((error) => error.message).join(";"),
          );
        }
        collected.push(...(response.data?.data?.discharge_details ?? []));
      }
      return collected;
    } catch {
      const collected: DischargeDetailGraphQL[] = [];
      for (const id of ids) {
        const response = await httpZauru.get<PurchaseOrderGraphQL>(
          `/purchases/purchase_orders/${id}.json`,
          { headers: restHeaders },
        );
        collected.push(
          ...dischargeDetailsFromRestPurchaseOrder(response.data),
        );
      }
      return collected;
    }
  });
};
