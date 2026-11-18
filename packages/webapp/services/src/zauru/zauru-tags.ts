import { handlePossibleAxiosErrors } from "@zauru-sdk/common";
import { AxiosUtilsResponse, TagGraphQL } from "@zauru-sdk/types";
import { httpZauru } from "./httpZauru.js";
import { httpGraphQLAPI } from "./httpGraphQL.js";
import { getTagByNameStringQuery } from "@zauru-sdk/graphql";

/**
 * createTag
 * @param headers
 * @param body
 */
export async function createTag(
  headers: any,
  body: Partial<TagGraphQL>
): Promise<AxiosUtilsResponse<TagGraphQL>> {
  return handlePossibleAxiosErrors(async () => {
    const response = await httpZauru.post<TagGraphQL>(
      `/settings/tags.json`,
      { tag: body },
      { headers }
    );
    return response.data;
  });
}

/**
 * Tag por nombre exacto en la entidad de `graphqlHeaders`.
 * Sirve para reutilizar el tag antes de crearlo en la entidad destino.
 */
export async function getTagByNameWithGraphQLHeaders(
  graphqlHeaders: Record<string, string>,
  name: string
): Promise<AxiosUtilsResponse<TagGraphQL | null>> {
  return handlePossibleAxiosErrors(async () => {
    const response = await httpGraphQLAPI.post<{
      data?: { tags?: TagGraphQL[] };
      errors?: { message: string }[];
    }>("", { query: getTagByNameStringQuery(name) }, { headers: graphqlHeaders });

    if (response.data?.errors?.length) {
      throw new Error(
        response.data.errors.map((error) => error.message).join(";")
      );
    }
    return response.data?.data?.tags?.[0] ?? null;
  });
}
