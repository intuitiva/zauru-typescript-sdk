import { handlePossibleAxiosErrors } from "@zauru-sdk/common";
import { AxiosUtilsResponse, TagGraphQL } from "@zauru-sdk/types";
import { httpZauru } from "./httpZauru.js";

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
