import { handlePossibleAxiosErrors } from "@zauru-sdk/common";
import { getGraphQLAPIHeaders } from "../common.js";
import httpGraphQLAPI from "./httpGraphQL.js";
import { getEmployeesByAgencyIdStringQuery } from "@zauru-sdk/graphql";
/**
 * getEmployeesByAgencyId
 */
export async function getEmployeesByAgencyId(session, id) {
    return handlePossibleAxiosErrors(async () => {
        const headers = await getGraphQLAPIHeaders(session);
        const response = await httpGraphQLAPI.post("", {
            query: getEmployeesByAgencyIdStringQuery(Number(id)),
        }, { headers });
        if (response.data.errors) {
            throw new Error(response.data.errors.map((x) => x.message).join(";"));
        }
        const registers = response?.data?.data?.employees;
        return registers;
    });
}
