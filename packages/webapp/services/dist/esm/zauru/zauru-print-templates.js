import { handlePossibleAxiosErrors } from "@zauru-sdk/common";
import { httpGraphQLAPI } from "./httpGraphQL.js";
import { getGraphQLAPIHeaders } from "../common.js";
import { getPrintTemplatesStringQuery } from "@zauru-sdk/graphql";
import { httpZauru } from "./httpZauru.js";
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
export const getPrintTemplate = async (headers, id) => {
    return handlePossibleAxiosErrors(async () => {
        const response = await httpZauru.get(`/settings/templates/print_templates/${id}.json`, { headers });
        return response.data;
    });
};
export const createPrintTemplate = async (headers, body) => {
    return handlePossibleAxiosErrors(async () => {
        const response = await httpZauru.post(`/settings/templates/print_templates.json`, { print_template: body }, { headers });
        return response.data;
    });
};
export const updatePrintTemplate = async (headers, id, body) => {
    return handlePossibleAxiosErrors(async () => {
        const response = await httpZauru.patch(`/settings/templates/print_templates/${id}.json`, { print_template: body }, { headers });
        return response.data;
    });
};
export const createDocumentPrint = async (headers, body) => {
    return handlePossibleAxiosErrors(async () => {
        const response = await httpZauru.post(`/settings/templates/document_prints.json`, { document_print: body }, { headers });
        return response.data;
    });
};
