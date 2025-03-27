import { handlePossibleAxiosErrors } from "@zauru-sdk/common";
import { AxiosUtilsResponse, SerialGraphQL } from "@zauru-sdk/types";
import { httpZauru } from "./httpZauru.js";
import { Session } from "@remix-run/node";
import { getGraphQLAPIHeaders } from "../common.js";
import { httpGraphQLAPI } from "./httpGraphQL.js";
import { getSerialsStringQuery } from "@zauru-sdk/graphql";

/**
 * getSerials
 */
export async function getSerials(
  session: Session,
  filters?: { name?: string; id?: number | string }
): Promise<AxiosUtilsResponse<SerialGraphQL[]>> {
  return handlePossibleAxiosErrors(async () => {
    const headers = await getGraphQLAPIHeaders(session);

    const defaultFilters = {};

    const finalFilters = { ...defaultFilters, ...filters };

    const response = await httpGraphQLAPI.post<{
      data: { serials: SerialGraphQL[] };
      errors?: {
        message: string;
        extensions: { path: string; code: string };
      }[];
    }>(
      "",
      {
        query: getSerialsStringQuery(finalFilters),
      },
      { headers }
    );

    if (response.data.errors) {
      throw new Error(response.data.errors.map((x) => x.message).join(";"));
    }

    const registers = response?.data?.data?.serials;

    return registers;
  });
}

/**
 * createSupportSerialAttended
 * @param headers
 * @param body
 */
export async function createSupportSerialAttended(
  headers: any,
  body: Partial<SerialGraphQL> & { payee_id: number }
): Promise<AxiosUtilsResponse<SerialGraphQL>> {
  return handlePossibleAxiosErrors(async () => {
    const response = await httpZauru.post<SerialGraphQL>(
      `/support/serials_attended.json`,
      { serial: body },
      { headers }
    );
    return response.data;
  });
}
