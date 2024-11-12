import { extractValueBetweenTags, handlePossibleAxiosErrors, } from "@zauru-sdk/common";
import { getGraphQLAPIHeaders } from "../common.js";
import httpGraphQLAPI from "./httpGraphQL.js";
import { getItemByNameStringQuery, getItemCategoryByIdStringQuery, getItemsByCategoryStringQuery, getItemsBySuperCategoryStringQuery, getItemsStringQuery, getSuperCategoryByIdStringQuery, } from "@zauru-sdk/graphql";
import { httpZauru } from "./httpZauru.js";
//============================ FORMATEADO DE ITEMS
function extractIdFromURL(input) {
    const regex = /\/items\/(\d+)/;
    const match = input.match(regex);
    return match ? parseInt(match[1], 10) : -1;
}
function formatHTMLItemList(item) {
    return {
        zid: parseInt(extractValueBetweenTags(item.zid, "a"), 10),
        itemId: extractIdFromURL(item.cod),
        name: extractValueBetweenTags(item.name, "a"),
        stck: extractValueBetweenTags(item.stck, "i") || null,
        act: extractValueBetweenTags(item.act, "i") || null,
        sell: extractValueBetweenTags(item.sell, "i") || null,
        purch: extractValueBetweenTags(item.purch, "i") || null,
        vat: extractValueBetweenTags(item.vat, "i") || null,
        cat: item.cat,
        warr: item.warr,
        cat_note: item.cat_note,
        DT_RowId: parseInt(item.DT_RowId.replace("settings-item-", ""), 10),
    };
}
/**
 *
 * @param headers
 * @returns
 */
export const getItemsDataTable = async (headers, search) => {
    return handlePossibleAxiosErrors(async () => {
        const response = await httpZauru.post(`/settings/items/datatables.json`, search, { headers });
        const items = response.data?.data?.map((x) => formatHTMLItemList(x)) ?? [];
        return items;
    });
};
/**
 * getItems
 */
export async function getItems(session) {
    return handlePossibleAxiosErrors(async () => {
        const headers = await getGraphQLAPIHeaders(session);
        const response = await httpGraphQLAPI.post("", {
            query: getItemsStringQuery,
        }, { headers });
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
export async function getItemByName(session, name) {
    return handlePossibleAxiosErrors(async () => {
        const headers = await getGraphQLAPIHeaders(session);
        const response = await httpGraphQLAPI.post("", {
            query: getItemByNameStringQuery(name),
        }, { headers });
        if (response.data.errors) {
            throw new Error(response.data.errors.map((x) => x.message).join(";"));
        }
        if (!response?.data?.data?.items[0]) {
            throw new Error(`No se encontró ningún item con el nombre: ${name} asociado`);
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
export async function getItemCategories(headers, item_category_id) {
    const response = await httpZauru.get(`/settings/items/item_categories/${item_category_id}.json`, {
        headers,
    });
    return response.data;
}
/**
 * getItemsByCategoryId
 */
export async function getItemsByCategoryId(session, id) {
    return handlePossibleAxiosErrors(async () => {
        const headers = await getGraphQLAPIHeaders(session);
        const response = await httpGraphQLAPI.post("", {
            query: getItemsByCategoryStringQuery(Number(id)),
        }, { headers });
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
export async function getItemCategory(session, id) {
    return handlePossibleAxiosErrors(async () => {
        const headers = await getGraphQLAPIHeaders(session);
        const response = await httpGraphQLAPI.post("", {
            query: getItemCategoryByIdStringQuery(Number(id)),
        }, { headers });
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
export async function getItemCategoriesBySuperCategoryId(session, id) {
    return handlePossibleAxiosErrors(async () => {
        const headers = await getGraphQLAPIHeaders(session);
        const response = await httpGraphQLAPI.post(``, {
            query: getSuperCategoryByIdStringQuery(Number(id)),
        }, { headers });
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
export async function getItemsBySuperCategoryId(session, id, agency_id) {
    return handlePossibleAxiosErrors(async () => {
        const headers = await getGraphQLAPIHeaders(session);
        const response = await httpGraphQLAPI.post(``, {
            query: getItemsBySuperCategoryStringQuery(Number(id), Number(agency_id)),
        }, { headers });
        if (response.data.errors) {
            throw new Error(response.data.errors.map((x) => x.message).join(";"));
        }
        if (!response?.data?.data.item_super_categories[0].item_categories) {
            return [];
        }
        const items = [];
        response.data?.data.item_super_categories[0]?.item_categories.forEach((x) => items.push(...x.items));
        return items;
    });
}
/**
 * createItemSuperCategory
 * @param session
 * @param headers
 * @returns
 */
export async function createItemSuperCategory(headers, body) {
    return handlePossibleAxiosErrors(async () => {
        const response = await httpZauru.post("/settings/items/item_super_categories.json", { item_super_category: body }, { headers });
        return response.data;
    });
}
/**
 * createItemCategory
 * @param session
 * @param headers
 * @returns
 */
export async function createItemCategory(headers, body) {
    return handlePossibleAxiosErrors(async () => {
        const itemCategoryResponse = await httpZauru.post("/settings/items/item_categories", { item_category: body }, { headers });
        return itemCategoryResponse.data;
    });
}
/**
 * deleteItemCategory
 * @param headers
 * @param id
 * @returns
 */
export async function deleteItemCategory(headers, id) {
    return handlePossibleAxiosErrors(async () => {
        await httpZauru.delete(`/settings/items/item_categories/${id}?destroy=true`, {
            headers,
        });
        return true;
    });
}
/**
 * updatePayee
 * @param session
 * @param headers
 * @returns
 */
export async function updateItemCategory(headers, body) {
    return handlePossibleAxiosErrors(async () => {
        await httpZauru.patch(`/settings/items/item_categories/${body.id}`, { item_category: body }, { headers });
        return true;
    });
}
/**
 * createItem
 * @param headers
 * @param body
 * @returns
 */
export async function createItem(headers, body) {
    return handlePossibleAxiosErrors(async () => {
        const response = await httpZauru.post(`/settings/items.json`, { item: body }, { headers });
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
export async function updateItem(headers, body) {
    return handlePossibleAxiosErrors(async () => {
        await httpZauru.patch(`/settings/items/${body.id}.json`, body, {
            headers,
        });
        return true;
    });
}
/**
 * deleteItemCategory
 * @param headers
 * @param id
 * @returns
 */
export async function deleteItem(headers, id) {
    return handlePossibleAxiosErrors(async () => {
        await httpZauru.delete(`/settings/items/${id}?destroy=true`, {
            headers,
        });
        return true;
    });
}
