import type { Session } from "@remix-run/node";
import { handlePossibleAxiosErrors } from "@zauru-sdk/common";
import {
  AxiosUtilsResponse,
  ItemCategoryGraphQL,
  ItemGraphQL,
  ItemSuperCategoryGraphQL,
} from "@zauru-sdk/types";
import { getGraphQLAPIHeaders } from "~/common.server.js";
import httpGraphQLAPI from "./httpGraphQL.server.js";
import {
  getItemByNameStringQuery,
  getItemCategoryByIdStringQuery,
  getItemsByCategoryStringQuery,
  getItemsBySuperCategoryStringQuery,
  getItemsStringQuery,
  getSuperCategoryByIdStringQuery,
} from "@zauru-sdk/graphql";
import httpZauru from "./httpZauru.server.js";

/**
 * getItems
 */
export async function getItems(
  session: Session
): Promise<AxiosUtilsResponse<ItemGraphQL[]>> {
  return handlePossibleAxiosErrors(async () => {
    const headers = await getGraphQLAPIHeaders(session);

    const response = await httpGraphQLAPI.post<{
      data: { items: ItemGraphQL[] };
      errors?: {
        message: string;
        extensions: { path: string; code: string };
      }[];
    }>(
      "",
      {
        query: getItemsStringQuery,
      },
      { headers }
    );

    if (response.data.errors) {
      throw new Error(response.data.errors.map((x) => x.message).join(";"));
    }

    const items = response?.data?.data?.items ?? [];

    return items;
  });
}

/**
 * getItemByName
 */
export async function getItemByName(
  session: Session,
  name: string
): Promise<AxiosUtilsResponse<ItemGraphQL>> {
  return handlePossibleAxiosErrors(async () => {
    const headers = await getGraphQLAPIHeaders(session);

    const response = await httpGraphQLAPI.post<{
      data: { items: ItemGraphQL[] };
      errors?: {
        message: string;
        extensions: { path: string; code: string };
      }[];
    }>(
      "",
      {
        query: getItemByNameStringQuery,
        variables: {
          name,
        },
      },
      { headers }
    );

    if (response.data.errors) {
      throw new Error(response.data.errors.map((x) => x.message).join(";"));
    }

    if (!response?.data?.data?.items[0]) {
      throw new Error(
        `No se encontró ningún item con el nombre: ${name} asociado`
      );
    }

    const register = response?.data?.data?.items[0];

    return register;
  });
}

//===================== ITEM CATEGORIES

/**
 * getItemCategories
 * @param headers
 * @param agency_id
 * @returns
 */
export async function getItemCategories(
  headers: any,
  item_category_id: string
): Promise<ItemCategoryGraphQL> {
  const response = await httpZauru.get<ItemCategoryGraphQL>(
    `/settings/items/item_categories/${item_category_id}.json`,
    {
      headers,
    }
  );

  return response.data;
}

/**
 * getItemsByCategoryId
 */
export async function getItemsByCategoryId(
  session: Session,
  id: string
): Promise<AxiosUtilsResponse<ItemGraphQL[]>> {
  return handlePossibleAxiosErrors(async () => {
    const headers = await getGraphQLAPIHeaders(session);

    const response = await httpGraphQLAPI.post<{
      data: { item_categories: ItemCategoryGraphQL[] };
      errors?: {
        message: string;
        extensions: { path: string; code: string };
      }[];
    }>(
      "",
      {
        query: getItemsByCategoryStringQuery,
        variables: {
          id,
        },
      },
      { headers }
    );

    if (response.data.errors) {
      throw new Error(response.data.errors.map((x) => x.message).join(";"));
    }

    if (!response?.data?.data?.item_categories[0]) {
      throw new Error("No se encontró la categoría de item indicada");
    }

    const items = response?.data?.data?.item_categories[0]?.items ?? [];

    return items;
  });
}

/**
 * getItemCategory
 * @param session
 * @param id
 */
export async function getItemCategory(
  session: Session,
  id: number | string
): Promise<AxiosUtilsResponse<ItemCategoryGraphQL | undefined>> {
  return handlePossibleAxiosErrors(async () => {
    const headers = await getGraphQLAPIHeaders(session);

    const response = await httpGraphQLAPI.post<{
      data: { item_categories: ItemCategoryGraphQL[] };
      errors?: {
        message: string;
        extensions: { path: string; code: string };
      }[];
    }>(
      "",
      {
        query: getItemCategoryByIdStringQuery,
        variables: {
          id,
        },
      },
      { headers }
    );

    if (response.data.errors) {
      throw new Error(response.data.errors.map((x) => x.message).join(";"));
    }

    if (!response?.data?.data?.item_categories[0]) {
      throw new Error("No se encontró la categoría de item indicada");
    }

    return response?.data?.data?.item_categories[0];
  });
}

/**
 * getItemCategoriesBySuperCategoryId
 * @param session
 * @param categoryId
 * @returns
 */
export async function getItemCategoriesBySuperCategoryId(
  session: Session,
  id: number | string
): Promise<AxiosUtilsResponse<ItemCategoryGraphQL[]>> {
  return handlePossibleAxiosErrors(async () => {
    const headers = await getGraphQLAPIHeaders(session);
    const response = await httpGraphQLAPI.post<{
      data: {
        item_super_categories: ItemSuperCategoryGraphQL[];
      };
      errors?: {
        message: string;
        extensions: { path: string; code: string };
      }[];
    }>(
      ``,
      {
        query: getSuperCategoryByIdStringQuery,
        variables: { id },
      },
      { headers }
    );

    if (response.data.errors) {
      throw new Error(response.data.errors.map((x) => x.message).join(";"));
    }

    if (!response?.data?.data.item_super_categories[0].item_categories) {
      return [];
    }

    return response.data?.data.item_super_categories[0]?.item_categories;
  });
}

/**
 * getItemsBySuperCategoryId
 * @param session
 * @param categoryId
 * @returns
 */
export async function getItemsBySuperCategoryId(
  session: Session,
  id: number | string,
  agency_id: number | string
): Promise<AxiosUtilsResponse<ItemGraphQL[]>> {
  return handlePossibleAxiosErrors(async () => {
    const headers = await getGraphQLAPIHeaders(session);
    const response = await httpGraphQLAPI.post<{
      data: {
        item_super_categories: ItemSuperCategoryGraphQL[];
      };
      errors?: {
        message: string;
        extensions: { path: string; code: string };
      }[];
    }>(
      ``,
      {
        query: getItemsBySuperCategoryStringQuery,
        variables: { id, agency_id },
      },
      { headers }
    );

    if (response.data.errors) {
      throw new Error(response.data.errors.map((x) => x.message).join(";"));
    }

    if (!response?.data?.data.item_super_categories[0].item_categories) {
      return [];
    }

    const items: ItemGraphQL[] = [];

    response.data?.data.item_super_categories[0]?.item_categories.forEach((x) =>
      items.push(...x.items)
    );

    return items;
  });
}

/**
 * createItemSuperCategory
 * @param session
 * @param headers
 * @returns
 */
export async function createItemSuperCategory(
  headers: any,
  body: Partial<ItemSuperCategoryGraphQL>
): Promise<AxiosUtilsResponse<ItemSuperCategoryGraphQL>> {
  return handlePossibleAxiosErrors(async () => {
    const response = await httpZauru.post<ItemSuperCategoryGraphQL>(
      "/settings/items/item_super_categories.json",
      { item_super_category: body },
      { headers }
    );
    return response.data;
  });
}

/**
 * createItemCategory
 * @param session
 * @param headers
 * @returns
 */
export async function createItemCategory(
  headers: any,
  body: Partial<ItemCategoryGraphQL>
): Promise<AxiosUtilsResponse<ItemCategoryGraphQL>> {
  return handlePossibleAxiosErrors(async () => {
    const itemCategoryResponse = await httpZauru.post<ItemCategoryGraphQL>(
      "/settings/items/item_categories",
      { item_category: body },
      { headers }
    );
    return itemCategoryResponse.data;
  });
}

/**
 * deleteItemCategory
 * @param headers
 * @param id
 * @returns
 */
export async function deleteItemCategory(
  headers: any,
  id: string | number
): Promise<AxiosUtilsResponse<boolean>> {
  return handlePossibleAxiosErrors(async () => {
    await httpZauru.delete<any>(
      `/settings/items/item_categories/${id}?destroy=true`,
      {
        headers,
      }
    );
    return true;
  });
}

/**
 * updatePayee
 * @param session
 * @param headers
 * @returns
 */
export async function updateItemCategory(
  headers: any,
  body: Partial<ItemCategoryGraphQL>
): Promise<AxiosUtilsResponse<boolean>> {
  return handlePossibleAxiosErrors(async () => {
    await httpZauru.patch<any>(
      `/settings/items/item_categories/${body.id}`,
      { item_category: body },
      { headers }
    );
    return true;
  });
}

/**
 * createItem
 * @param headers
 * @param body
 * @returns
 */
export async function createItem(
  headers: any,
  body: Partial<ItemGraphQL>
): Promise<AxiosUtilsResponse<ItemGraphQL>> {
  return handlePossibleAxiosErrors(async () => {
    const response = await httpZauru.post<ItemGraphQL>(
      `/settings/items.json`,
      { item: body },
      { headers }
    );
    return response.data;
  });
}

/**
 * updateItem
 * @param headers
 * @param body
 * @param id
 * @returns
 */
export async function updateItem(headers: any, body: Partial<ItemGraphQL>) {
  return handlePossibleAxiosErrors(async () => {
    await httpZauru.patch<Partial<ItemGraphQL>>(
      `/settings/items/${body.id}.json`,
      body,
      {
        headers,
      }
    );
    return true;
  });
}

/**
 * deleteItemCategory
 * @param headers
 * @param id
 * @returns
 */
export async function deleteItem(
  headers: any,
  id: string | number
): Promise<AxiosUtilsResponse<boolean>> {
  return handlePossibleAxiosErrors(async () => {
    await httpZauru.delete<any>(`/settings/items/${id}?destroy=true`, {
      headers,
    });
    return true;
  });
}
