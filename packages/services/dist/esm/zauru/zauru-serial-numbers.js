import { handlePossibleAxiosErrors } from "@zauru-sdk/common";
import { httpZauru } from "./httpZauru.js";
import { getGraphQLAPIHeaders } from "../common.js";
import { httpGraphQLAPI } from "./httpGraphQL.js";
import { getSerialsStringQuery } from "@zauru-sdk/graphql";
/**
 * getSerials
 */
export async function getSerials(session, filters) {
    return handlePossibleAxiosErrors(async () => {
        const headers = await getGraphQLAPIHeaders(session);
        const defaultFilters = {};
        const finalFilters = { ...defaultFilters, ...filters };
        const response = await httpGraphQLAPI.post("", {
            query: getSerialsStringQuery(finalFilters),
        }, { headers });
        if (response.data.errors) {
            throw new Error(response.data.errors.map((x) => x.message).join(";"));
        }
        const registers = response?.data?.data?.serials;
        return registers;
    });
}
/**
 * createSupportSerialAttended
 * @param headers
 * @param body
 */
export async function createSupportSerialAttended(headers, body) {
    return handlePossibleAxiosErrors(async () => {
        const response = await httpZauru.post(`/support/serials_attended.json`, { serial: body }, { headers });
        return response.data;
    });
}
