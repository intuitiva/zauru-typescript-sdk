import { handlePossibleAxiosErrors } from "@zauru-sdk/common";
import { getGraphQLAPIHeaders } from "../common.js";
import { httpGraphQLAPI } from "./httpGraphQL.js";
import { getCasesStringQuery } from "@zauru-sdk/graphql";
/**
 * getCasesByResponsibleId
 */
export async function getCasesByResponsibleId(session, filters) {
    return handlePossibleAxiosErrors(async () => {
        const headers = await getGraphQLAPIHeaders(session);
        const initialFilters = {
            ...(filters ? filters : {}),
        };
        const query = getCasesStringQuery(initialFilters);
        const response = await httpGraphQLAPI.post("", {
            query,
        }, { headers });
        if (response.data.errors) {
            throw new Error(response.data.errors.map((x) => x.message).join(";"));
        }
        const registers = response?.data?.data?.cases;
        return registers;
    });
}
