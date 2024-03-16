import type { Session } from "@remix-run/node";
import { handlePossibleAxiosErrors } from "@zauru-sdk/common";
import {
  getPurchasesListDataTables,
  getVariablesByName,
} from "@zauru-sdk/services";
import {
  AxiosUtilsResponse,
  BasicIdNameSchema,
  DataTablesFilterBody,
} from "@zauru-sdk/types";

/**
 * getProvidersList
 * @param headers
 * @param session
 * @param byReceptions
 * @returns
 */
export const getProvidersList = async (
  headers: any,
  session: Session,
  byReceptions: boolean = true
): Promise<
  AxiosUtilsResponse<{
    vendors: BasicIdNameSchema[];
    vendors_categories: BasicIdNameSchema[];
  }>
> => {
  return handlePossibleAxiosErrors(async () => {
    let tag_id = undefined;
    if (byReceptions) {
      const { recepciones_tag_id } = await getVariablesByName(
        headers,
        session,
        ["recepciones_tag_id"]
      );
      tag_id = recepciones_tag_id;
    }

    //Obtengo los proveedores, que vienen en el endpoint de órdenes de compra
    const body: DataTablesFilterBody = {
      order: { "0": { column: "1", dir: "desc" } },
      start: 0,
      length: 1,
      search: { value: "", regex: false },
      tag: tag_id,
      agency: session.get("agency_id") ?? "",
    };

    //Voy por las ordenes y las ordeno por fecha de recepción
    const ordersDataTablesResponse = await getPurchasesListDataTables(
      headers,
      body
    );

    if (ordersDataTablesResponse.error)
      throw new Error(ordersDataTablesResponse.userMsg);

    const ordersDataTables = ordersDataTablesResponse.data;

    return {
      vendors: ordersDataTables?.vendors ?? [],
      vendors_categories: ordersDataTables?.vendor_categories ?? [],
    };
  });
};
