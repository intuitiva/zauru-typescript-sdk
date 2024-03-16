import type { Session } from "@remix-run/node";
import { handlePossibleAxiosErrors } from "@zauru-sdk/common";
import {
  getVariablesByName,
  getWebAppTableRegisters,
} from "@zauru-sdk/services";
import httpZauru from "@zauru-sdk/services/dist/zauru/httpZauru.server.js";
import {
  AxiosUtilsResponse,
  MotivoRechazo,
  RejectionWebAppTableObject,
  WebAppRowGraphQL,
  ReceptionType,
  WebAppTableGraphQL,
} from "@zauru-sdk/types";

/**
 * getWebappTable
 * @param headers
 * @param session
 * @returns
 */
export const getRejectionWebAppTable = async (
  headers: any,
  session: Session
): Promise<AxiosUtilsResponse<RejectionWebAppTableObject>> => {
  return handlePossibleAxiosErrors(async () => {
    const {
      recepciones_rejections_webapp_table_id,
      recepciones_rejection_types_webapp_table_id,
    } = await getVariablesByName(headers, session, [
      "recepciones_rejections_webapp_table_id",
      "recepciones_rejection_types_webapp_table_id",
    ]);

    const webappTableResponse = await httpZauru.get<WebAppTableGraphQL>(
      `/apps/webapp_tables/${recepciones_rejections_webapp_table_id}.json`,
      { headers }
    );

    const webappTableRejectionsResponse = await httpZauru.get<
      WebAppRowGraphQL<MotivoRechazo>[]
    >(
      `/apps/webapp_tables/${recepciones_rejection_types_webapp_table_id}/webapp_rows.json`,
      { headers }
    );

    const rejections_select: { value: string; label: string }[] = [];
    const rejections_complete = webappTableRejectionsResponse.data;
    const keyName: string = Object.keys(rejections_complete[0].data)[0]; //get the first value
    const rejections_list: string[] = [];
    rejections_complete.forEach((val: any) => {
      rejections_list.push(val.data[keyName]);
    });

    rejections_complete.forEach((rc: any) => {
      rejections_select.push({
        value: rc.data[keyName],
        label: rc.data[keyName],
      });
    });

    return {
      webapp_table: webappTableResponse.data.structure,
      rejection_list: rejections_list,
      rejection_select: rejections_select,
    } as RejectionWebAppTableObject;
  });
};

/**
 * Get template history entries from the web app table.
 * @param headers Request headers.
 * @param session Session object.
 * @returns A Promise of AxiosUtilsResponse<ReceptionType[]>.
 */
export async function getReceptionTypes(
  headers: any,
  session: Session
): Promise<AxiosUtilsResponse<WebAppRowGraphQL<ReceptionType>[]>> {
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
}
