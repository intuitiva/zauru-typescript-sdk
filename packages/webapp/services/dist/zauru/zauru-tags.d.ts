import { AxiosUtilsResponse, TagGraphQL } from "@zauru-sdk/types";
/**
 * createTag
 * @param headers
 * @param body
 */
export declare function createTag(headers: any, body: Partial<TagGraphQL>): Promise<AxiosUtilsResponse<TagGraphQL>>;
/**
 * Tag por nombre exacto en la entidad de `graphqlHeaders`.
 * Sirve para reutilizar el tag antes de crearlo en la entidad destino.
 */
export declare function getTagByNameWithGraphQLHeaders(graphqlHeaders: Record<string, string>, name: string): Promise<AxiosUtilsResponse<TagGraphQL | null>>;
