import { handlePossibleAxiosErrors } from "@zauru-sdk/webapp-common";
import { httpZauru } from "./httpZauru.js";
/**
 * createTag
 * @param headers
 * @param body
 */
export async function createTag(headers, body) {
    return handlePossibleAxiosErrors(async () => {
        const response = await httpZauru.post(`/settings/tags.json`, { tag: body }, { headers });
        return response.data;
    });
}
