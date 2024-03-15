import { handlePossibleAxiosErrors } from "./httpZauru.server.js";
import httpGraphQLAPI from "./httpGraphQL.server.js";
import { getGraphQLAPIHeaders } from "~/common.server.js";
import graphql from "@zauru-sdk/graphql";
const { default: queries } = graphql;
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
