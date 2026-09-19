import type { Session } from "@remix-run/node";
import { handlePossibleAxiosErrors } from "@zauru-sdk/common";
import type { GetWebAppRowsByTableIdOptions } from "@zauru-sdk/graphql";
import {
  createWebAppTableRegister,
  getVariablesByName,
  getWebAppTableRegisters,
  updateWebAppTableRegister,
} from "@zauru-sdk/services";
import {
  AxiosUtilsResponse,
  WebAppTableUpdateResponse,
  BitacoraPOMassive,
  WebAppRowGraphQL,
} from "@zauru-sdk/types";

const BITACORA_DEFAULT_LIMIT = 1000;

/**
 * Get saveBitacoraPOMassive from the web app table.
 * @param headers Request headers.
 * @param session Session object.
 * @returns A Promise of AxiosUtilsResponse<WebAppTableUpdateResponse>.
 */
export const saveBitacoraPOMassive = (
  headers: any,
  session: Session,
  body: BitacoraPOMassive
): Promise<AxiosUtilsResponse<WebAppTableUpdateResponse>> => {
  return handlePossibleAxiosErrors(async () => {
    const { bitacora_ediciones_masivas_web_app_table_id } =
      await getVariablesByName(headers, session, [
        "bitacora_ediciones_masivas_web_app_table_id",
      ]);

    const response = await createWebAppTableRegister<BitacoraPOMassive>(
      headers,
      bitacora_ediciones_masivas_web_app_table_id,
      { ...body, modificadoPor: session.get("name") }
    );

    return response;
  });
};

/**
 * Get getBitacorasPOMassive from the web app table.
 * @param headers Request headers.
 * @param session Session object.
 * @param options Optional JSON `data` filters, `createdAt` range and row limit. Defaults to the last 1000 rows.
 * @returns A Promise of AxiosUtilsResponse<WebAppRowGraphQL<BitacoraPOMassive>[]>.
 */
export const getBitacorasPOMassive = (
  headers: any,
  session: Session,
  options?: GetWebAppRowsByTableIdOptions
): Promise<AxiosUtilsResponse<WebAppRowGraphQL<BitacoraPOMassive>[]>> => {
  return handlePossibleAxiosErrors(async () => {
    const { bitacora_ediciones_masivas_web_app_table_id } =
      await getVariablesByName(headers, session, [
        "bitacora_ediciones_masivas_web_app_table_id",
      ]);

    const response = await getWebAppTableRegisters<BitacoraPOMassive>(
      session,
      bitacora_ediciones_masivas_web_app_table_id,
      {
        limit: options?.limit ?? BITACORA_DEFAULT_LIMIT,
        ...(options?.data ? { data: options.data } : {}),
        ...(options?.createdAt ? { createdAt: options.createdAt } : {}),
      }
    );

    if (response.error || !response.data) {
      throw new Error(response.userMsg);
    }

    return response.data;
  });
};

/**
 * Put updateBitacorasPOMassive from the web app table.
 * @param headers Request headers.
 * @param session Session object.
 * @returns A Promise of AxiosUtilsResponse<BitacorasPOMassiveWebAppTable[]>.
 */
export const updateBitacorasPOMassive = (
  headers: any,
  session: Session,
  body: BitacoraPOMassive,
  id_registro: string | number
): Promise<AxiosUtilsResponse<WebAppTableUpdateResponse>> => {
  return handlePossibleAxiosErrors(async () => {
    const { bitacora_ediciones_masivas_web_app_table_id } =
      await getVariablesByName(headers, session, [
        "bitacora_ediciones_masivas_web_app_table_id",
      ]);

    const response = await updateWebAppTableRegister<BitacoraPOMassive>(
      headers,
      bitacora_ediciones_masivas_web_app_table_id,
      id_registro,
      { ...body, modificadoPor: session.get("name") }
    );

    return response;
  });
};
