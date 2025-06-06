import { handlePossibleAxiosErrors } from "@zauru-sdk/common";
import { createWebAppTableRegister, getVariablesByName, } from "@zauru-sdk/services";
export const formatearMotivoDeRechazo = (entity) => {
    return { id: entity.id, name: entity.data.Nombre };
};
/**
 * Post saveRechazoCanastas from the web app table.
 * @param headers Request headers.
 * @param session Session object.
 * @returns A Promise of AxiosUtilsResponse<WebAppRowGraphQL<WebAppTableUpdateResponse>[]>.
 */
export const saveRechazoCanastas = (headers, session, body) => {
    return handlePossibleAxiosErrors(async () => {
        const { recepciones_rejections_webapp_table_id } = await getVariablesByName(headers, session, ["recepciones_rejections_webapp_table_id"]);
        const response = await createWebAppTableRegister(headers, recepciones_rejections_webapp_table_id, { ...body });
        return response;
    });
};
