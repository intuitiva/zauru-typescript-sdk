import { formatDateToUTC, handlePossibleAxiosErrors } from "@zauru-sdk/common";
import httpZauru from "./httpZauru.js";
import { getGraphQLAPIHeaders, getVariablesByName } from "../common.js";
import httpGraphQLAPI from "./httpGraphQL.js";
import { getConsolidatesBetweenDatesStringQuery } from "@zauru-sdk/graphql";
/**
 *
 * @param headers
 * @returns
 */
export const createConsolidated = async (headers, body) => {
    return handlePossibleAxiosErrors(async () => {
        const response = await httpZauru.post(`/purchases/consolidates/create_for_special_invoice.json`, body, {
            headers,
        });
        return response.data;
    });
};
/**
 * generateConsolidatePDF
 * @param headers
 * @param body
 */
export const generateConsolidatePDF = async (headers, session, body) => {
    return handlePossibleAxiosErrors(async () => {
        const { consolidated_template_id } = await getVariablesByName(headers, session, ["consolidated_template_id"]);
        body.print_template = consolidated_template_id;
        const response = await httpZauru.post("/purchases/consolidates/gen_print_all.json", body, { headers });
        return response.data;
    });
};
/**
 * getConsolidatedPDFResult
 * @param headers
 * @param zid
 * @returns
 */
export const getConsolidatedPDFResult = async (headers, zid) => {
    return handlePossibleAxiosErrors(async () => {
        const response = await httpZauru.get("purchases/consolidates/check_print_all", {
            headers,
            params: { zid },
        });
        return response.data;
    });
};
/**
 *
 * @param session
 * @param dates
 * @returns
 */
export const getConsolidatesBetweenDates = async (session, dates) => {
    return handlePossibleAxiosErrors(async () => {
        const headers = await getGraphQLAPIHeaders(session);
        const response = await httpGraphQLAPI.post("", {
            query: getConsolidatesBetweenDatesStringQuery(formatDateToUTC(dates.startDate), formatDateToUTC(dates.endDate)),
        }, { headers });
        if (response.data.errors) {
            throw new Error(response.data.errors.map((x) => x.message).join(";"));
        }
        if (!response?.data?.data.consolidates) {
            return [];
        }
        return response.data?.data.consolidates;
    });
};
