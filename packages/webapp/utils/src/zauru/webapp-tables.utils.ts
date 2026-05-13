import type { Session } from "@remix-run/node";
import { handlePossibleAxiosErrors } from "@zauru-sdk/webapp-common";
import {
  getVariablesByName,
  getWebAppTableRegisters,
} from "@zauru-sdk/webapp-services";
import {
  AxiosUtilsResponse,
  WebAppRowGraphQL,
  ReceptionType,
} from "@zauru-sdk/webapp-types";

/**
 * Get template history entries from the web app table.
 * @param headers Request headers.
 * @param session Session object.
 * @returns A Promise of AxiosUtilsResponse<ReceptionType[]>.
 */
export const getReceptionTypes = (
  headers: any,
  session: Session
): Promise<AxiosUtilsResponse<WebAppRowGraphQL<ReceptionType>[]>> => {
  return handlePossibleAxiosErrors(async () => {
    const { recepciones_receptions_type_table_id } = await getVariablesByName(
      headers,
      session,
      ["recepciones_receptions_type_table_id"]
    );
    const response = await getWebAppTableRegisters<ReceptionType>(
      session,
      recepciones_receptions_type_table_id
    );
    const receptionTypes = response?.data ?? [];
    return receptionTypes;
  });
};
