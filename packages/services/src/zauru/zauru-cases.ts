import type { Session } from "@remix-run/node";
import { arrayToObject, handlePossibleAxiosErrors } from "@zauru-sdk/common";
import { AxiosUtilsResponse, CaseGraphQL } from "@zauru-sdk/types";
import { getGraphQLAPIHeaders } from "../common.js";
import { httpGraphQLAPI } from "./httpGraphQL.js";
import { getCasesStringQuery } from "@zauru-sdk/graphql";
import { httpZauru } from "./httpZauru.js";

/**
 * getCases
 */
export async function getCases(
  session: Session,
  filters?: {
    id?: number;
    responsible_id?: number;
    closed?: boolean;
    client_id?: number;
    tag_id?: string;
    limit?: number;
  }
): Promise<AxiosUtilsResponse<CaseGraphQL[]>> {
  return handlePossibleAxiosErrors(async () => {
    const headers = await getGraphQLAPIHeaders(session);

    const initialFilters = {
      ...(filters ? filters : {}),
    };

    const query = getCasesStringQuery(initialFilters);

    const response = await httpGraphQLAPI.post<{
      data: { cases: CaseGraphQL[] };
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

    const registers = response?.data?.data?.cases;

    return registers;
  });
}

/**
 * createCase
 * @param headers
 * @param body
 * @returns
 */
export async function createCase(
  headers: any,
  body: Partial<CaseGraphQL>
): Promise<AxiosUtilsResponse<CaseGraphQL>> {
  return handlePossibleAxiosErrors(async () => {
    const sendBody = {
      ...body,
      case_supplies_attributes: arrayToObject(body.case_supplies),
      tag_ids: ["", ...(body.taggings?.map((x) => x.tag_id) ?? [])],
    } as any;

    if (sendBody.deleted_case_supplies) delete sendBody.deleted_case_supplies;
    if (sendBody.__rvfInternalFormId) delete sendBody.__rvfInternalFormId;
    if (sendBody.case_supplies) delete sendBody.case_supplies;
    if (sendBody.taggings) delete sendBody.taggings;

    const response = await httpZauru.post<CaseGraphQL>(
      `/support/cases.json`,
      { case: sendBody },
      { headers }
    );

    return response.data;
  });
}

/**
 * updateCase
 * @param headers
 * @param body
 * @returns
 */
export async function updateCase(
  headers: any,
  body: Partial<CaseGraphQL>
): Promise<AxiosUtilsResponse<CaseGraphQL>> {
  return handlePossibleAxiosErrors(async () => {
    const sendBody = {
      ...body,
      case_supplies_attributes: arrayToObject(body.case_supplies),
    } as any;
    if (sendBody.deleted_case_supplies) delete sendBody.deleted_case_supplies;
    if (sendBody.__rvfInternalFormId) delete sendBody.__rvfInternalFormId;
    if (sendBody.case_supplies) delete sendBody.case_supplies;

    const response = await httpZauru.patch<CaseGraphQL>(
      `/support/cases/${body.id}.json`,
      { case: sendBody },
      { headers }
    );

    return response.data;
  });
}

/**
 * deleteCase
 * @param headers
 * @param body
 */
export async function deleteCase(
  headers: any,
  id: string | number
): Promise<AxiosUtilsResponse<boolean>> {
  return handlePossibleAxiosErrors(async () => {
    await httpZauru.delete<any>(`/support/cases/${id}.json`, {
      headers,
    });
    return true;
  });
}

/**
 * closeCase
 * @param headers
 * @param id
 * @returns
 */
export async function closeCase(
  headers: any,
  id: string | number
): Promise<AxiosUtilsResponse<boolean>> {
  return handlePossibleAxiosErrors(async () => {
    await httpZauru.get<any>(`/support/cases/${id}/close.json`, { headers });
    return true;
  });
}

/**
 * sendCaseEmail
 * @param headers
 * @param id
 * @returns
 */
export async function sendCaseEmail(
  headers: any,
  id: string | number
): Promise<AxiosUtilsResponse<boolean>> {
  return handlePossibleAxiosErrors(async () => {
    await httpZauru.get<any>(`/support/cases/${id}/send_email.json`, {
      headers,
    });
    return true;
  });
}

//==============================================
//======= ENDPOINTS DE POS/CASES
//==============================================

/**
 * createPOSCase
 * @param headers
 * @param body
 * @returns
 */
export async function createPOSCase(
  headers: any,
  body: Partial<CaseGraphQL>
): Promise<AxiosUtilsResponse<CaseGraphQL>> {
  return handlePossibleAxiosErrors(async () => {
    const sendBody = {
      ...body,
      case_supplies_attributes: arrayToObject(body.case_supplies),
      tag_ids: ["", ...(body.taggings?.map((x) => x.tag_id) ?? [])],
    } as any;

    if (sendBody.deleted_case_supplies) delete sendBody.deleted_case_supplies;
    if (sendBody.__rvfInternalFormId) delete sendBody.__rvfInternalFormId;
    if (sendBody.case_supplies) delete sendBody.case_supplies;
    if (sendBody.taggings) delete sendBody.taggings;

    const response = await httpZauru.post<CaseGraphQL>(
      `/pos/cases.json`,
      { case: sendBody },
      { headers }
    );

    return response.data;
  });
}

/**
 * updatePOSCase
 * @param headers
 * @param body
 * @returns
 */
export async function updatePOSCase(
  headers: any,
  body: Partial<CaseGraphQL>
): Promise<AxiosUtilsResponse<CaseGraphQL>> {
  return handlePossibleAxiosErrors(async () => {
    const sendBody = {
      ...body,
      case_supplies_attributes: arrayToObject(body.case_supplies),
    } as any;
    if (sendBody.deleted_case_supplies) delete sendBody.deleted_case_supplies;
    if (sendBody.__rvfInternalFormId) delete sendBody.__rvfInternalFormId;
    if (sendBody.case_supplies) delete sendBody.case_supplies;

    const response = await httpZauru.patch<CaseGraphQL>(
      `/pos/cases/${body.id}.json`,
      { case: sendBody },
      { headers }
    );

    return response.data;
  });
}

/**
 * closePOSCase
 * @param headers
 * @param id
 * @returns
 */
export async function closePOSCase(
  headers: any,
  id: string | number
): Promise<AxiosUtilsResponse<boolean>> {
  return handlePossibleAxiosErrors(async () => {
    await httpZauru.get<any>(`/pos/cases/${id}/close.json`, { headers });
    return true;
  });
}
