import { handlePossibleAxiosErrors } from "@zauru-sdk/common";
import httpZauru from "./httpZauru.js";
/**
 *
 * @param headers
 * @returns
 */
export const getReceptionTemplate = async (headers, id) => {
    return handlePossibleAxiosErrors(async () => {
        const response = await httpZauru.get(`/settings/templates/print_templates/${id}/preview_with_vars`, {
            headers,
        });
        return response.data;
    });
};
