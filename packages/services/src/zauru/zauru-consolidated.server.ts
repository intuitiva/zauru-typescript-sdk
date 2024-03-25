import type { Session } from "@remix-run/node";
import { formatDateToUTC, handlePossibleAxiosErrors } from "@zauru-sdk/common";
import {
  AxiosUtilsResponse,
  ConsolidateGraphQL,
  GeneratePDFBody,
  NewConsolidatedBody,
  PDFResult,
} from "@zauru-sdk/types";
import httpZauru from "./httpZauru.server.js";
import { getGraphQLAPIHeaders, getVariablesByName } from "../common.server.js";
import httpGraphQLAPI from "./httpGraphQL.server.js";
import { getConsolidatesBetweenDatesStringQuery } from "@zauru-sdk/graphql";

/**
 *
 * @param headers
 * @returns
 */
export const createConsolidated = async (
  headers: any,
  body: NewConsolidatedBody
): Promise<AxiosUtilsResponse<{ id: number }>> => {
  return handlePossibleAxiosErrors(async () => {
    const response = await httpZauru.post<{ id: number }>(
      `/purchases/consolidates/create_for_special_invoice.json`,
      body,
      {
        headers,
      }
    );

    return response.data;
  });
};

/**
 * generateConsolidatePDF
 * @param headers
 * @param body
 */
export const generateConsolidatePDF = async (
  headers: any,
  session: Session,
  body: GeneratePDFBody
): Promise<AxiosUtilsResponse<{ status: number; zid: number }>> => {
  return handlePossibleAxiosErrors(async () => {
    const { consolidated_template_id } = await getVariablesByName(
      headers,
      session,
      ["consolidated_template_id"]
    );
    body.print_template = consolidated_template_id;
    const response = await httpZauru.post<{ status: number; zid: number }>(
      "/purchases/consolidates/gen_print_all.json",
      body,
      { headers }
    );

    return response.data;
  });
};

/**
 * getConsolidatedPDFResult
 * @param headers
 * @param zid
 * @returns
 */
export const getConsolidatedPDFResult = async (
  headers: any,
  zid: number | string
): Promise<AxiosUtilsResponse<PDFResult>> => {
  return handlePossibleAxiosErrors(async () => {
    const response = await httpZauru.get<PDFResult>(
      "purchases/consolidates/check_print_all",
      {
        headers,
        params: { zid },
      }
    );
    return response.data;
  });
};

/**
 *
 * @param session
 * @param dates
 * @returns
 */
export const getConsolidatesBetweenDates = async (
  session: Session,
  dates: {
    startDate: string;
    endDate: string;
  }
): Promise<AxiosUtilsResponse<ConsolidateGraphQL[]>> => {
  return handlePossibleAxiosErrors(async () => {
    const headers = await getGraphQLAPIHeaders(session);
    const response = await httpGraphQLAPI.post<{
      data: { consolidates: ConsolidateGraphQL[] };
      errors?: {
        message: string;
        extensions: { path: string; code: string };
      }[];
    }>(
      "",
      {
        query: getConsolidatesBetweenDatesStringQuery,
        variables: {
          startDate: formatDateToUTC(dates.startDate),
          endDate: formatDateToUTC(dates.endDate),
        },
      },
      { headers }
    );

    if (response.data.errors) {
      throw new Error(response.data.errors.map((x) => x.message).join(";"));
    }

    if (!response?.data?.data.consolidates) {
      return [];
    }

    return response.data?.data.consolidates;
  });
};
