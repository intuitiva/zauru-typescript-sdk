import type { Session } from "@remix-run/node";
import { handlePossibleAxiosErrors } from "@zauru-sdk/common";
import {
  createWebAppTableRegister,
  deleteWebAppTableRegister,
  getVariablesByName,
  getWebAppTableRegisters,
  updateWebAppTableRegister,
} from "@zauru-sdk/services";
import {
  WebAppRowGraphQL,
  Programacion,
  AxiosUtilsResponse,
  WebAppTableUpdateResponse,
} from "@zauru-sdk/types";

/**
 * Get programaciones from the web app table.
 * @param headers Request headers.
 * @param session Session object.
 * @returns A Promise of AxiosUtilsResponse<WebAppRowGraphQL<Programacion>[]>>.
 */
export const getProgramaciones = (
  headers: any,
  session: Session,
): Promise<AxiosUtilsResponse<WebAppRowGraphQL<Programacion>[]>> => {
  return handlePossibleAxiosErrors(async () => {
    const { programaciones_webapp_table_id } = await getVariablesByName(
      headers,
      session,
      ["programaciones_webapp_table_id"],
    );

    const response = await getWebAppTableRegisters<Programacion>(
      session,
      programaciones_webapp_table_id,
    );

    if (response.error) {
      throw new Error(
        `Ocurrió un error al consultar las programaciones: ${response.userMsg}`,
      );
    }

    const registers = response.data ?? [];

    return registers;
  });
};

/**
 * Create a programacion in the web app table.
 * @param headers Request headers.
 * @param session Session object.
 * @param body Programacion data to be created.
 * @returns A Promise of AxiosUtilsResponse<WebAppTableUpdateResponse>.
 */
export const createProgramacion = (
  headers: any,
  session: Session,
  body: Programacion,
): Promise<AxiosUtilsResponse<WebAppTableUpdateResponse>> => {
  return handlePossibleAxiosErrors(async () => {
    const { programaciones_webapp_table_id } = await getVariablesByName(
      headers,
      session,
      ["programaciones_webapp_table_id"],
    );
    const response = await createWebAppTableRegister<Programacion>(
      headers,
      programaciones_webapp_table_id,
      body,
    );
    return response;
  });
};

/**
 * Delete a programacion from the web app table.
 * @param headers Request headers.
 * @param session Session object.
 * @param id ID of the programacion to be deleted.
 * @returns A Promise of AxiosUtilsResponse<WebAppTableUpdateResponse>.
 */
export const deleteProgramacion = (
  headers: any,
  session: Session,
  id: string,
): Promise<AxiosUtilsResponse<WebAppTableUpdateResponse>> => {
  return handlePossibleAxiosErrors(async () => {
    const { programaciones_webapp_table_id } = await getVariablesByName(
      headers,
      session,
      ["programaciones_webapp_table_id"],
    );

    const response = await deleteWebAppTableRegister(
      headers,
      programaciones_webapp_table_id,
      Number(id),
    );
    return response;
  });
};

/**
 * Update a programacion in the web app table.
 * @param headers Request headers.
 * @param session Session object.
 * @param id ID of the programacion to be updated.
 * @param body Updated programacion data.
 * @returns A Promise of AxiosUtilsResponse<WebAppTableUpdateResponse>.
 */
export const updateProgramacion = (
  headers: any,
  session: Session,
  id: string,
  body: Partial<Programacion>,
): Promise<AxiosUtilsResponse<WebAppTableUpdateResponse>> => {
  return handlePossibleAxiosErrors(async () => {
    const { programaciones_webapp_table_id } = await getVariablesByName(
      headers,
      session,
      ["programaciones_webapp_table_id"],
    );

    const response = await updateWebAppTableRegister(
      headers,
      programaciones_webapp_table_id,
      Number(id),
      body,
    );

    return response;
  });
};
