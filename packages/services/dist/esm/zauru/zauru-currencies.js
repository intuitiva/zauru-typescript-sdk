import { handlePossibleAxiosErrors } from "@zauru-sdk/common";
import { getGraphQLAPIHeaders } from "../common.js";
import { httpGraphQLAPI } from "./httpGraphQL.js";
import { getCurrenciesStringQuery } from "@zauru-sdk/graphql";
/**
 * getCurrencies
 */
export async function getCurrencies(session) {
    return handlePossibleAxiosErrors(async () => {
        const headers = await getGraphQLAPIHeaders(session);
        const response = await httpGraphQLAPI.post("", {
            query: getCurrenciesStringQuery,
        }, { headers });
        if (response.data.errors) {
            throw new Error(response.data.errors.map((x) => x.message).join(";"));
        }
        const registers = response?.data?.data?.currencies;
        return registers;
    });
}
