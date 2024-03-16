import { handlePossibleAxiosErrors } from "@zauru-sdk/common";
import httpZauru from "./httpZauru.server.js";
/**
 * updateAutomaticNumber
 * @param headers
 * @param body
 * @returns
 */
export const updateAutomaticNumber = async (headers, body) => {
    return handlePossibleAxiosErrors(async () => {
        const sendBody = {
            document_automatic_number: {
                ...body,
            },
        };
        const response = await httpZauru.put(`/settings/templates/document_automatic_numbers/${body.id}.json`, sendBody, {
            headers,
        });
        return response.data;
    });
};
