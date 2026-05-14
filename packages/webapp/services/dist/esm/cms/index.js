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
        const response = await httpCMSAPI.post("/api/graphql", {
            query,
        }, { headers });
        if (response.data.errors) {
            throw new Error(response.data.errors?.map((x) => x.message).join(";"));
        }
        if (!response.data.data) {
            throw new Error("No data found");
        }
        // Retorna los datos según la clave dinámica proporcionada
        return response.data.data;
    });
};
