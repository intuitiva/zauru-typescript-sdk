import { handlePossibleAxiosErrors } from "./httpZauru.server.js";
import httpGraphQLAPI from "./httpGraphQL.server.js";
import { getGraphQLAPIHeaders } from "~/common.server.js";
import { getAgenciesStringQuery } from "@zauru-sdk/graphql";
/**
 * getAgencies
 * @param headers
 * @returns
 */
export async function getAgencies(session) {
    return handlePossibleAxiosErrors(async () => {
        const headers = await getGraphQLAPIHeaders(session);
        const response = await httpGraphQLAPI.post(``, {
            query: getAgenciesStringQuery,
        }, {
            headers,
        });
        return response.data?.data.agencies;
    });
}
