import type { Session } from "@remix-run/node";
import { handlePossibleAxiosErrors } from "@zauru-sdk/common";
import {
  AxiosUtilsResponse,
  MotivoRechazo,
  RejectionWebAppTableObject,
  WebAppRowAssociateBody,
  WebAppRowAssociateResponse,
  WebAppRowDissociateBody,
  WebAppRowDissociateResponse,
  WebAppRowGraphQL,
  WebAppTableBody,
  WebAppTableBulkCreateBody,
  WebAppTableBulkResponse,
  WebAppTableBulkUpdateBody,
  WebAppTableCreateBody,
  WebAppTableGraphQL,
  WebAppTableUpdateResponse,
} from "@zauru-sdk/types";
import { getGraphQLAPIHeaders, getVariablesByName } from "../common.js";
import { httpGraphQLAPI } from "./httpGraphQL.js";
import {
  getWebAppRowStringQuery,
  getWebAppRowsByWebAppTableIdStringQuery,
  getWebAppTableByIdStringQuery,
  type GetWebAppRowsByTableIdOptions,
} from "@zauru-sdk/graphql";
import { httpZauru } from "./httpZauru.js";

/**
 * getWebAppRow
 * @param headers
 * @returns
 */
export async function getWebAppRow<T>(
  session: Session,
  id: number,
): Promise<AxiosUtilsResponse<T>> {
  return handlePossibleAxiosErrors(async () => {
    const headers = await getGraphQLAPIHeaders(session);

    const response = await httpGraphQLAPI.post<{
      data: { webapp_rows: WebAppRowGraphQL<T>[] };
      errors?: {
        message: string;
        extensions: { path: string; code: string };
      }[];
    }>(
      "",
      {
        query: getWebAppRowStringQuery(id),
      },
      { headers },
    );

    if (response.data.errors) {
      throw new Error(response.data.errors.map((x) => x.message).join(";"));
    }

    return response.data?.data?.webapp_rows[0]?.data;
  });
}

/**
 * getWebAppTableRegisters Function for get all web app table registers
 * @param headers
 * @param webapp_table_id web app table id
 * @param options optional `{ limit, data }` JSONB filters
 * @returns
 */
export async function getWebAppTableRegisters<T>(
  session: Session,
  webapp_table_id: string,
  options?: GetWebAppRowsByTableIdOptions,
): Promise<AxiosUtilsResponse<WebAppRowGraphQL<T>[]>> {
  return handlePossibleAxiosErrors(async () => {
    const headers = await getGraphQLAPIHeaders(session);

    const response = await httpGraphQLAPI.post<{
      data: { webapp_rows: WebAppRowGraphQL<T>[] };
      errors?: {
        message: string;
        extensions: { path: string; code: string };
      }[];
    }>(
      "",
      {
        query: getWebAppRowsByWebAppTableIdStringQuery(
          Number(webapp_table_id),
          options,
        ),
      },
      { headers },
    );

    if (response.data.errors) {
      throw new Error(response.data.errors.map((x) => x.message).join(";"));
    }

    if (!response?.data?.data.webapp_rows) {
      return [];
    }

    return response.data?.data?.webapp_rows;
  });
}

/**
 * deleteWebAppTableRegister Function for delete a web app table register
 * @param headers
 * @param id_web_app_table
 * @param id_register
 * @returns
 */
export async function deleteWebAppTableRegister(
  headers: any,
  id_web_app_table: string,
  id_register: number,
): Promise<WebAppTableUpdateResponse> {
  const response = await httpZauru<WebAppTableUpdateResponse>(
    `/apps/webapp_tables/${id_web_app_table}/webapp_rows/${id_register}.json`,
    {
      method: "DELETE",
      headers: headers,
    },
  );

  return response.data;
}

/**
 * REST listing of webapp table rows (no GraphQL session token required).
 */
export async function getWebAppTableRegistersRest<T>(
  headers: any,
  id_web_app_table: string,
): Promise<AxiosUtilsResponse<WebAppRowGraphQL<T>[]>> {
  return handlePossibleAxiosErrors(async () => {
    const response = await httpZauru.get<WebAppRowGraphQL<T>[]>(
      `/apps/webapp_tables/${id_web_app_table}/webapp_rows.json`,
      { headers },
    );
    return Array.isArray(response.data) ? response.data : [];
  });
}

/**
 * createWebAppTableRegister function for create a new web app table register
 * @param headers
 * @param body
 * @param id_web_app_table
 * @returns
 */
export async function createWebAppTableRegister<T>(
  headers: any,
  id_web_app_table: string,
  body: T,
  extraBody?: WebAppRowAssociateBody,
): Promise<WebAppTableUpdateResponse> {
  const requestBody = {
    webapp_row: { data: body },
    ...(extraBody ?? {}),
  } as WebAppTableBody<T>;
  const response = await httpZauru<WebAppTableUpdateResponse>(
    `/apps/webapp_tables/${id_web_app_table}/webapp_rows.json`,
    {
      method: "POST",
      headers: headers,
      data: requestBody,
    },
  );

  return response.data;
}

/**
 * Creates multiple webapp table rows in one Baculo request.
 * Baculo currently accepts up to 200 rows per request.
 */
export async function createWebAppTableRegistersBulk<T>(
  headers: any,
  id_web_app_table: string,
  bodies: T[],
): Promise<WebAppTableBulkResponse<T>> {
  const requestBody: WebAppTableBulkCreateBody<T> = {
    webapp_rows: bodies.map((data) => ({ data })),
  };
  const response = await httpZauru<WebAppTableBulkResponse<T>>(
    `/apps/webapp_tables/${id_web_app_table}/webapp_rows/bulk.json`,
    {
      method: "POST",
      headers,
      data: requestBody,
    },
  );

  return response.data;
}

/**
 * updateWebAppTableRegister Function for update a web app table register
 * @param headers
 * @param id_web_app_table
 * @param id_register
 * @returns
 */
export async function updateWebAppTableRegister<T>(
  headers: any,
  id_web_app_table: string,
  id_register: number | string,
  body: Partial<T>,
): Promise<WebAppTableUpdateResponse> {
  const requestBody = { webapp_row: { data: body } } as WebAppTableBody<T>;
  const response = await httpZauru<WebAppTableUpdateResponse>(
    `/apps/webapp_tables/${id_web_app_table}/webapp_rows/${id_register}.json`,
    {
      method: "PATCH",
      headers: headers,
      data: requestBody,
    },
  );

  return response.data;
}

/**
 * Partially updates multiple webapp table rows in one Baculo request.
 * Each row's data is shallow-merged with its current JSON data.
 */
export async function updateWebAppTableRegistersBulk<T>(
  headers: any,
  id_web_app_table: string,
  rows: WebAppTableBulkUpdateBody<T>["webapp_rows"],
): Promise<WebAppTableBulkResponse<T>> {
  const requestBody: WebAppTableBulkUpdateBody<T> = { webapp_rows: rows };
  const response = await httpZauru<WebAppTableBulkResponse<T>>(
    `/apps/webapp_tables/${id_web_app_table}/webapp_rows/bulk.json`,
    {
      method: "PATCH",
      headers,
      data: requestBody,
    },
  );

  return response.data;
}

/**
 * associateWebAppTableRegister — links one or more rowables to an existing row
 * POST /apps/webapp_tables/:webapp_table_id/webapp_rows/:id/associate.json
 */
export async function associateWebAppTableRegister(
  headers: any,
  id_web_app_table: string,
  id_register: number | string,
  body: WebAppRowAssociateBody,
): Promise<WebAppRowAssociateResponse> {
  const response = await httpZauru<WebAppRowAssociateResponse>(
    `/apps/webapp_tables/${id_web_app_table}/webapp_rows/${id_register}/associate.json`,
    {
      method: "POST",
      headers: headers,
      data: body,
    },
  );

  return response.data;
}

/**
 * dissociateWebAppTableRegister — removes rowable associations from an existing row.
 * Pass specific temp_* ids to remove only those, or { all: true } to remove all.
 * DELETE /apps/webapp_tables/:webapp_table_id/webapp_rows/:id/dissociate.json
 */
export async function dissociateWebAppTableRegister(
  headers: any,
  id_web_app_table: string,
  id_register: number | string,
  body: WebAppRowDissociateBody,
): Promise<WebAppRowDissociateResponse> {
  const response = await httpZauru<WebAppRowDissociateResponse>(
    `/apps/webapp_tables/${id_web_app_table}/webapp_rows/${id_register}/dissociate.json`,
    {
      method: "DELETE",
      headers: headers,
      data: body,
    },
  );

  return response.data;
}

//============================== WEB APP TABLE

/**
 *
 * @param headers
 * @param body
 * @returns
 */
export async function createWebAppTable(
  headers: any,
  body: WebAppTableCreateBody,
) {
  try {
    const response = await httpZauru.post<WebAppTableGraphQL>(
      `/apps/webapp_tables.json`,
      { webapp_table: body },
      {
        headers,
      },
    );

    return {
      data: response.data,
      error: false,
    } as AxiosUtilsResponse<WebAppTableGraphQL>;
  } catch (error) {
    return {
      msg: error,
      error: true,
      userMsg: `Ocurrió un error al intentar crear la web app table ${body.name}`,
    } as AxiosUtilsResponse<WebAppTableGraphQL>;
  }
}

/**
 * getWebAppTable
 * GraphQL read of a webapp table schema (structure, name, ids).
 */
export async function getWebAppTable(
  session: Session,
  webapp_table_id: string | number,
): Promise<AxiosUtilsResponse<WebAppTableGraphQL>> {
  return handlePossibleAxiosErrors(async () => {
    const headers = await getGraphQLAPIHeaders(session);

    const response = await httpGraphQLAPI.post<{
      data: { webapp_tables: WebAppTableGraphQL[] };
      errors?: {
        message: string;
        extensions: { path: string; code: string };
      }[];
    }>(
      "",
      {
        query: getWebAppTableByIdStringQuery(Number(webapp_table_id)),
      },
      { headers },
    );

    if (response.data.errors) {
      throw new Error(response.data.errors.map((x) => x.message).join(";"));
    }

    const table = response.data?.data?.webapp_tables?.[0];
    if (!table) {
      throw new Error(`No se encontró la web app table ${webapp_table_id}`);
    }

    return table;
  });
}

const rejectionLabelFromRow = (
  row: WebAppRowGraphQL<MotivoRechazo>,
): string => {
  const data = row.data ?? ({} as MotivoRechazo);
  if (typeof data.Nombre === "string" && data.Nombre) {
    return data.Nombre;
  }
  const firstKey = Object.keys(data)[0];
  if (!firstKey) {
    return "";
  }
  const value = (data as Record<string, unknown>)[firstKey];
  return value == null ? "" : String(value);
};

/**
 * Rejection types catalog + schema of the receptions rejection table.
 * Reads both from GraphQL (webapp_tables / webapp_rows), not Zauru REST.
 */
export const getRejectionWebAppTable = async (
  headers: any,
  session: Session,
): Promise<AxiosUtilsResponse<RejectionWebAppTableObject>> => {
  return handlePossibleAxiosErrors(async () => {
    const {
      recepciones_rejections_webapp_table_id,
      recepciones_rejection_types_webapp_table_id,
    } = await getVariablesByName(headers, session, [
      "recepciones_rejections_webapp_table_id",
      "recepciones_rejection_types_webapp_table_id",
    ]);

    const webappTableResponse = await getWebAppTable(
      session,
      recepciones_rejections_webapp_table_id,
    );
    if (webappTableResponse.error || !webappTableResponse.data) {
      throw new Error(webappTableResponse.userMsg);
    }

    const webappTableRejectionsResponse =
      await getWebAppTableRegisters<MotivoRechazo>(
        session,
        recepciones_rejection_types_webapp_table_id,
      );
    if (
      webappTableRejectionsResponse.error ||
      !webappTableRejectionsResponse.data
    ) {
      throw new Error(webappTableRejectionsResponse.userMsg);
    }

    const rejections_select: { value: string; label: string }[] = [];
    const rejections_list: string[] = [];

    webappTableRejectionsResponse.data.forEach((row) => {
      const label = rejectionLabelFromRow(row);
      if (!label) {
        return;
      }
      rejections_list.push(label);
      rejections_select.push({ value: label, label });
    });

    return {
      webapp_table: webappTableResponse.data.structure,
      rejection_list: rejections_list,
      rejection_select: rejections_select,
    } as RejectionWebAppTableObject;
  });
};
