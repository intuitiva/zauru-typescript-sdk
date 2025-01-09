import { handlePossibleAxiosErrors } from "@zauru-sdk/common";
import { getCMSHeaders } from "../common.js";
import { httpCMSAPI } from "../zauru/httpCMS.js";
/**
 * getCMSGeneralQuery
 * @param query
 * @returns
 */
export const getCMSGeneralQuery = async (query) => {
    return handlePossibleAxiosErrors(async () => {
        const headers = await getCMSHeaders();
        // Respuesta con clave dinámica basada en query
        const response = await httpCMSAPI.post("", {
            query,
        }, { headers });
        // Retorna los datos según la clave dinámica proporcionada
        return response.data;
    });
};
