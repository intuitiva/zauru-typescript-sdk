import { handlePossibleAxiosErrors } from "@zauru-sdk/common";
import { httpZauru } from "./httpZauru.js";
import { httpGraphQLAPI } from "./httpGraphQL.js";
import { getTagByNameStringQuery } from "@zauru-sdk/graphql";
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
/**
 * Tag por nombre exacto en la entidad de `graphqlHeaders`.
 * Sirve para reutilizar el tag antes de crearlo en la entidad destino.
 */
export async function getTagByNameWithGraphQLHeaders(graphqlHeaders, name) {
    return handlePossibleAxiosErrors(async () => {
        const response = await httpGraphQLAPI.post("", { query: getTagByNameStringQuery(name) }, { headers: graphqlHeaders });
        if (response.data?.errors?.length) {
            throw new Error(response.data.errors.map((error) => error.message).join(";"));
        }
        return response.data?.data?.tags?.[0] ?? null;
    });
}
