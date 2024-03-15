import queries from "@zauru-sdk/graphql";
import { getGraphQLAPIHeaders } from "@zauru-sdk/utils";
import { handlePossibleAxiosErrors } from "./httpZauru.server";
import httpGraphQLAPI from "./httpGraphQL.server";
/**
 * getAgencies
 * @param headers
 * @returns
 */
export async function getAgencies(session) {
    return handlePossibleAxiosErrors(async () => {
        const headers = await getGraphQLAPIHeaders(session);
        const response = await httpGraphQLAPI.post(``, {
            query: queries.getAgencies,
        }, {
            headers,
        });
        return response.data?.data.agencies;
    });
}
