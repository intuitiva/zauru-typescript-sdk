import { handlePossibleAxiosErrors } from "@zauru-sdk/common";
import { getGraphQLAPIHeaders } from "../common.js";
import httpGraphQLAPI from "../zauru/httpGraphQL.js";
/**
 * getGeneralQuery
 * @param headers
 * @param queryKey - clave dinámica para acceder a los datos en la respuesta (ej. 'purchase_orders', 'users')
 * @returns
 */
export const getGeneralQuery = async (session, query, queryKey // Clave dinámica
) => {
    return handlePossibleAxiosErrors(async () => {
        const headers = await getGraphQLAPIHeaders(session);
        // Respuesta con clave dinámica basada en queryKey
        const response = await httpGraphQLAPI.post("", {
            query,
        }, { headers });
        if (response.data.errors) {
            throw new Error(response.data.errors.map((x) => x.message).join(";"));
        }
        // Retorna los datos según la clave dinámica proporcionada
        return response.data.data[queryKey];
    });
};
