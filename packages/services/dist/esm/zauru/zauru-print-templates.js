import { handlePossibleAxiosErrors } from "@zauru-sdk/common";
import httpGraphQLAPI from "./httpGraphQL.js";
import { getGraphQLAPIHeaders } from "../common.js";
import { getPrintTemplatesStringQuery } from "@zauru-sdk/graphql";
/**
 * getPayees
 * @param headers
 * @returns
 */
export async function getPrintTemplates(session) {
    return handlePossibleAxiosErrors(async () => {
        const headers = await getGraphQLAPIHeaders(session);
        const response = await httpGraphQLAPI.post(``, {
            query: getPrintTemplatesStringQuery,
        }, {
            headers,
        });
        return response.data?.data.print_templates;
    });
}
