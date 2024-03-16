import { Session } from "@remix-run/node";
import { handlePossibleAxiosErrors } from "@zauru-sdk/common";
import {
  createWebAppTableRegister,
  getVariablesByName,
} from "@zauru-sdk/services";
import {
  AxiosUtilsResponse,
  BasicIdNameSchema,
  MotivoRechazo,
  WebAppRowGraphQL,
  WebAppTableUpdateResponse,
} from "@zauru-sdk/types";

export function formatearMotivoDeRechazo(
  entity: WebAppRowGraphQL<MotivoRechazo>
): BasicIdNameSchema {
  return { id: entity.id, name: entity.data.Nombre } as BasicIdNameSchema;
}

/**
 * Post saveBitacoraPOMassive from the web app table.
 * @param headers Request headers.
 * @param session Session object.
 * @returns A Promise of AxiosUtilsResponse<WebAppRowGraphQL<BitacoraPOMassive>[]>.
 */
export async function saveRechazoCanastas(
  headers: any,
  session: Session,
  body: any
): Promise<AxiosUtilsResponse<WebAppTableUpdateResponse>> {
  return handlePossibleAxiosErrors(async () => {
    const { recepciones_rejections_webapp_table_id } = await getVariablesByName(
      headers,
      session,
      ["recepciones_rejections_webapp_table_id"]
    );

    const response = await createWebAppTableRegister<any>(
      headers,
      recepciones_rejections_webapp_table_id,
      { ...body }
    );

    return response;
  });
}
