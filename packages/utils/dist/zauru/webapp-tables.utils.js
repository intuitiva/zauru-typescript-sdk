import { handlePossibleAxiosErrors } from "@zauru-sdk/common";
import { getVariablesByName, getWebAppTableRegisters, } from "@zauru-sdk/services";
/**
 * Get template history entries from the web app table.
 * @param headers Request headers.
 * @param session Session object.
 * @returns A Promise of AxiosUtilsResponse<ReceptionType[]>.
 */
export const getReceptionTypes = (headers, session) => {
    return handlePossibleAxiosErrors(async () => {
        const { recepciones_receptions_type_table_id } = await getVariablesByName(headers, session, ["recepciones_receptions_type_table_id"]);
        const response = await getWebAppTableRegisters(session, recepciones_receptions_type_table_id);
        const receptionTypes = response?.data ?? [];
        return receptionTypes;
    });
};
