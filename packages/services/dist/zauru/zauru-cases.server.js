import { handlePossibleAxiosErrors } from "@zauru-sdk/common";
import { getGraphQLAPIHeaders } from "~/common.server.js";
import httpGraphQLAPI from "./httpGraphQL.server.js";
import { getCasesByResponsibleIdStringQuery } from "@zauru-sdk/graphql";
/**
 * getCasesByResponsibleId
 */
export async function getCasesByResponsibleId(session, responsible_id, wheres = []) {
    return handlePossibleAxiosErrors(async () => {
        const headers = await getGraphQLAPIHeaders(session);
        const response = await httpGraphQLAPI.post("", {
            query: getCasesByResponsibleIdStringQuery(wheres),
            variables: {
                responsible_id,
            },
        }, { headers });
        if (response.data.errors) {
            throw new Error(response.data.errors.map((x) => x.message).join(";"));
        }
        const registers = response?.data?.data?.cases;
        return registers;
    });
}
