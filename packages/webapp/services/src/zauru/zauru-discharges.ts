import type { Session } from "@remix-run/node";
import {
  AxiosUtilsResponse,
  GeneratePDFBody,
  NewDischargeBody,
  PDFResult,
} from "@zauru-sdk/types";
import { getVariablesByName } from "../common.js";
import { handlePossibleAxiosErrors } from "@zauru-sdk/common";
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
