import type { Session } from "@remix-run/node";
import { arrayToObject, handlePossibleAxiosErrors } from "@zauru-sdk/common";
import {
  AxiosUtilsResponse,
  InvoiceGraphQL,
  SubmissionInvoicesGraphQL,
} from "@zauru-sdk/types";
import { getGraphQLAPIHeaders } from "../common.js";
import httpGraphQLAPI from "./httpGraphQL.js";
import { getInvoicesByAgencyIdStringQuery } from "@zauru-sdk/graphql";
import { httpZauru } from "./httpZauru.js";

/**
 * getInvoicesByAgencyId
 */
export async function getInvoicesByAgencyId(
  session: Session,
  id: string | null
): Promise<AxiosUtilsResponse<InvoiceGraphQL[]>> {
  return handlePossibleAxiosErrors(async () => {
    const headers = await getGraphQLAPIHeaders(session);

    const response = await httpGraphQLAPI.post<{
      data: { invoices: InvoiceGraphQL[] };
      errors?: {
        message: string;
        extensions: { path: string; code: string };
      }[];
    }>(
      "",
      {
        query: getInvoicesByAgencyIdStringQuery(Number(id ?? 0)),
      },
      { headers }
    );

    if (response.data.errors) {
      throw new Error(response.data.errors.map((x) => x.message).join(";"));
    }

    // Filtrar los registros para obtener sólo los de la versión más alta.
    const registers = response?.data?.data?.invoices.map((x) => {
      const groupedByVersion = x.submission_invoices?.reduce((acc, record) => {
        const zid = record.settings_form_submission?.zid;

        if (!acc[zid]) {
          acc[zid] = record;
        }

        return acc;
      }, {} as { [key: string]: SubmissionInvoicesGraphQL });

      x.submission_invoices = Object.values(groupedByVersion)?.reverse() ?? [];

      return x;
    });

    return registers;
  });
}

/**
 * createInvoice
 * @param headers
 * @param body
 * @returns
 */
export async function createInvoice(
  headers: any,
  body: Partial<InvoiceGraphQL>,
  sujetaAImpuestos: boolean = true
): Promise<AxiosUtilsResponse<InvoiceGraphQL>> {
  return handlePossibleAxiosErrors(async () => {
    const sendBody = {
      ...body,
      invoice_details_attributes: arrayToObject(body.invoice_details),
      tag_ids: ["", ...(body.tagging_invoices?.map((x) => x.tag_id) ?? [])],
      taxable: sujetaAImpuestos,
    } as any;

    if (sendBody.deleted_invoice_details)
      delete sendBody.deleted_invoice_details;
    if (sendBody.__rvfInternalFormId) delete sendBody.__rvfInternalFormId;
    if (sendBody.invoice_details) delete sendBody.invoice_details;
    if (sendBody.tagging_invoices) delete sendBody.tagging_invoices;

    const response = await httpZauru.post<InvoiceGraphQL>(
      `/sales/unpaid_invoices.json`,
      { invoice: sendBody },
      { headers }
    );

    return response.data;
  });
}

/**
 * createInvoiceOrder
 * @param headers
 * @param body
 * @returns
 */
export async function createInvoiceOrder(
  headers: any,
  body: Partial<InvoiceGraphQL>,
  esFactura: boolean = false
): Promise<AxiosUtilsResponse<InvoiceGraphQL>> {
  return handlePossibleAxiosErrors(async () => {
    const sendBody = {
      ...body,
      issued: esFactura, //(false) - Esto lo hace una órden y no una factura
      invoice_details_attributes: arrayToObject(body.invoice_details),
      tag_ids: ["", ...(body.tagging_invoices?.map((x) => x.tag_id) ?? [])],
      taxable: esFactura ? 1 : 0,
    } as any;

    if (sendBody.deleted_invoice_details)
      delete sendBody.deleted_invoice_details;
    if (sendBody.__rvfInternalFormId) delete sendBody.__rvfInternalFormId;
    if (sendBody.invoice_details) delete sendBody.invoice_details;
    if (sendBody.tagging_invoices) delete sendBody.tagging_invoices;

    const response = await httpZauru.post<InvoiceGraphQL>(
      `/sales/orders.json`,
      { invoice: sendBody },
      { headers }
    );

    return response.data;
  });
}

/**
 * updateInvoiceOrder
 * @param headers
 * @param body
 * @returns
 */
export async function updateInvoiceOrder(
  headers: any,
  body: Partial<InvoiceGraphQL>
): Promise<AxiosUtilsResponse<InvoiceGraphQL>> {
  return handlePossibleAxiosErrors(async () => {
    const sendBody = {
      ...body,
      invoice_details_attributes: arrayToObject(body.invoice_details),
    } as any;
    if (sendBody.deleted_invoice_details)
      delete sendBody.deleted_invoice_details;
    if (sendBody.__rvfInternalFormId) delete sendBody.__rvfInternalFormId;
    if (sendBody.invoice_details) delete sendBody.invoice_details;

    const response = await httpZauru.patch<InvoiceGraphQL>(
      `/sales/orders/${body.id}.json`,
      { invoice: sendBody },
      { headers }
    );

    return response.data;
  });
}

/**
 * deleteInvoice
 * @param headers
 * @param body
 */
export async function deleteInvoiceOrder(
  headers: any,
  id: string | number
): Promise<AxiosUtilsResponse<boolean>> {
  return handlePossibleAxiosErrors(async () => {
    await httpZauru.get<any>(`/sales/orders/${id}/void`, {
      headers,
    });
    return true;
  });
}
