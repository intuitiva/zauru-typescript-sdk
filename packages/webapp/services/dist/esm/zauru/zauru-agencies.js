import { handlePossibleAxiosErrors } from "@zauru-sdk/webapp-common";
import { httpGraphQLAPI } from "./httpGraphQL.js";
import { getAgenciesStringQuery } from "@zauru-sdk/webapp-graphql";
import { getGraphQLAPIHeaders } from "../common.js";
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
