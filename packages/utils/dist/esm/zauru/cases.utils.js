import { handlePossibleAxiosErrors } from "@zauru-sdk/common";
import { getCasesByResponsibleId } from "@zauru-sdk/services";
/**
 *
 * @param headers
 * @param session
 * @returns
 */
export const getMyCases = async (session, filters) => {
    return handlePossibleAxiosErrors(async () => {
        const response = await getCasesByResponsibleId(session, filters);
        if (response.error) {
            throw new Error(`Ocurrió un error al consultar los casos asignados a este usuario: ${response.userMsg}`);
        }
        return response?.data ?? [];
    });
};
