import type { Session } from "@remix-run/node";
import { handlePossibleAxiosErrors } from "@zauru-sdk/common";
import { createWebAppTableRegister, deleteWebAppTableRegister, getVariablesByName, getWebAppTableRegisters, updateWebAppTableRegister } from "@zauru-sdk/services";
import { AxiosUtilsResponse, SpecialItem, WebAppRowGraphQL, WebAppTableUpdateResponse } from "@zauru-sdk/types";


/**
 * Get specialItems from the web app table.
 * @param headers Request headers.
 * @param session Session object.
 * @returns A Promise of AxiosUtilsResponse<WebAppRowGraphQL<SpecialItem>[]>>.
 */
export async function getSpecialItems(
  headers: any,
  session: Session
): Promise<AxiosUtilsResponse<WebAppRowGraphQL<SpecialItem>[]>> {
  return handlePossibleAxiosErrors(async () => {
    const { special_product_web_app_table_id } = await getVariablesByName(
      headers,
      session,
      ["special_product_web_app_table_id"]
    );

    const response = await getWebAppTableRegisters<SpecialItem>(
      session,
      special_product_web_app_table_id
    );

    if (response.error) {
      throw new Error(
        `Ocurrió un error al consultar los items especiales: ${response.userMsg}`
      );
    }

    const specialItems = response.data ?? [];

    return specialItems;
  });
}

/**
 * Create a specialItem in the web app table.
 * @param headers Request headers.
 * @param session Session object.
 * @param body SpecialItem data to be created.
 * @returns A Promise of AxiosUtilsResponse<WebAppTableUpdateResponse>.
 */
export async function createSpecialItem(
  headers: any,
  session: Session,
  body: SpecialItem
): Promise<AxiosUtilsResponse<WebAppTableUpdateResponse>> {
  return handlePossibleAxiosErrors(async () => {
    const { special_product_web_app_table_id } = await getVariablesByName(
      headers,
      session,
      ["special_product_web_app_table_id"]
    );
    const response = await createWebAppTableRegister<SpecialItem>(
      headers,
      special_product_web_app_table_id,
      body
    );
    return response;
  });
}

/**
 * Delete a specialItem from the web app table.
 * @param headers Request headers.
 * @param session Session object.
 * @param id ID of the specialItem to be deleted.
 * @returns A Promise of AxiosUtilsResponse<WebAppTableUpdateResponse>.
 */
export async function deleteSpecialItem(
  headers: any,
  session: Session,
  id: string
): Promise<AxiosUtilsResponse<WebAppTableUpdateResponse>> {
  return handlePossibleAxiosErrors(async () => {
    const { special_product_web_app_table_id } = await getVariablesByName(
      headers,
      session,
      ["special_product_web_app_table_id"]
    );

    const response = await deleteWebAppTableRegister(
      headers,
      special_product_web_app_table_id,
      Number(id)
    );
    return response;
  });
}

/**
 * Update a specialItem in the web app table.
 * @param headers Request headers.
 * @param session Session object.
 * @param id ID of the specialItem to be updated.
 * @param body Updated specialItem data.
 * @returns A Promise of AxiosUtilsResponse<WebAppTableUpdateResponse>.
 */
export async function updateSpecialItem(
  headers: any,
  session: Session,
  id: string,
  body: Partial<SpecialItem>
): Promise<AxiosUtilsResponse<WebAppTableUpdateResponse>> {
  return handlePossibleAxiosErrors(async () => {
    const { special_product_web_app_table_id } = await getVariablesByName(
      headers,
      session,
      ["special_product_web_app_table_id"]
    );

    const response = await updateWebAppTableRegister(
      headers,
      special_product_web_app_table_id,
      Number(id),
      body
    );

    return response;
  });
}
