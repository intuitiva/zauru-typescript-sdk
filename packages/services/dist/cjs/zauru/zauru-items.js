"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteItem = exports.updateItem = exports.createItem = exports.updateItemCategory = exports.deleteItemCategory = exports.createItemCategory = exports.createItemSuperCategory = exports.getItemsBySuperCategoryId = exports.getItemCategoriesBySuperCategoryId = exports.getItemCategory = exports.getItemsByCategoryId = exports.getItemCategories = exports.getItemByName = exports.getItems = exports.getItemsDataTable = void 0;
const common_1 = require("@zauru-sdk/common");
const common_js_1 = require("../common.js");
const httpGraphQL_js_1 = __importDefault(require("./httpGraphQL.js"));
const graphql_1 = require("@zauru-sdk/graphql");
const httpZauru_js_1 = __importDefault(require("./httpZauru.js"));
//============================ FORMATEADO DE ITEMS
function extractIdFromURL(input) {
    const regex = /\/items\/(\d+)/;
    const match = input.match(regex);
    return match ? parseInt(match[1], 10) : -1;
}
function formatHTMLItemList(item) {
    return {
        zid: parseInt((0, common_1.extractValueBetweenTags)(item.zid, "a"), 10),
        itemId: extractIdFromURL(item.cod),
        name: (0, common_1.extractValueBetweenTags)(item.name, "a"),
        stck: (0, common_1.extractValueBetweenTags)(item.stck, "i") || null,
        act: (0, common_1.extractValueBetweenTags)(item.act, "i") || null,
        sell: (0, common_1.extractValueBetweenTags)(item.sell, "i") || null,
        purch: (0, common_1.extractValueBetweenTags)(item.purch, "i") || null,
        vat: (0, common_1.extractValueBetweenTags)(item.vat, "i") || null,
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
const getItemsDataTable = async (headers, search) => {
    return (0, common_1.handlePossibleAxiosErrors)(async () => {
        const response = await httpZauru_js_1.default.post(`/settings/items/datatables.json`, search, { headers });
        const items = response.data?.data?.map((x) => formatHTMLItemList(x)) ?? [];
        return items;
    });
};
exports.getItemsDataTable = getItemsDataTable;
/**
 * getItems
 */
async function getItems(session) {
    return (0, common_1.handlePossibleAxiosErrors)(async () => {
        const headers = await (0, common_js_1.getGraphQLAPIHeaders)(session);
        const response = await httpGraphQL_js_1.default.post("", {
            query: graphql_1.getItemsStringQuery,
        }, { headers });
        if (response.data.errors) {
            throw new Error(response.data.errors.map((x) => x.message).join(";"));
        }
        const items = response?.data?.data?.items ?? [];
        return items;
    });
}
exports.getItems = getItems;
/**
 * getItemByName
 */
async function getItemByName(session, name) {
    return (0, common_1.handlePossibleAxiosErrors)(async () => {
        const headers = await (0, common_js_1.getGraphQLAPIHeaders)(session);
        const response = await httpGraphQL_js_1.default.post("", {
            query: graphql_1.getItemByNameStringQuery,
            variables: {
                name,
            },
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
exports.getItemByName = getItemByName;
//===================== ITEM CATEGORIES
/**
 * getItemCategories
 * @param headers
 * @param agency_id
 * @returns
 */
async function getItemCategories(headers, item_category_id) {
    const response = await httpZauru_js_1.default.get(`/settings/items/item_categories/${item_category_id}.json`, {
        headers,
    });
    return response.data;
}
exports.getItemCategories = getItemCategories;
/**
 * getItemsByCategoryId
 */
async function getItemsByCategoryId(session, id) {
    return (0, common_1.handlePossibleAxiosErrors)(async () => {
        const headers = await (0, common_js_1.getGraphQLAPIHeaders)(session);
        const response = await httpGraphQL_js_1.default.post("", {
            query: (0, graphql_1.getItemsByCategoryStringQuery)(Number(id)),
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
exports.getItemsByCategoryId = getItemsByCategoryId;
/**
 * getItemCategory
 * @param session
 * @param id
 */
async function getItemCategory(session, id) {
    return (0, common_1.handlePossibleAxiosErrors)(async () => {
        const headers = await (0, common_js_1.getGraphQLAPIHeaders)(session);
        const response = await httpGraphQL_js_1.default.post("", {
            query: (0, graphql_1.getItemCategoryByIdStringQuery)(Number(id)),
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
exports.getItemCategory = getItemCategory;
/**
 * getItemCategoriesBySuperCategoryId
 * @param session
 * @param categoryId
 * @returns
 */
async function getItemCategoriesBySuperCategoryId(session, id) {
    return (0, common_1.handlePossibleAxiosErrors)(async () => {
        const headers = await (0, common_js_1.getGraphQLAPIHeaders)(session);
        const response = await httpGraphQL_js_1.default.post(``, {
            query: (0, graphql_1.getSuperCategoryByIdStringQuery)(Number(id)),
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
exports.getItemCategoriesBySuperCategoryId = getItemCategoriesBySuperCategoryId;
/**
 * getItemsBySuperCategoryId
 * @param session
 * @param categoryId
 * @returns
 */
async function getItemsBySuperCategoryId(session, id, agency_id) {
    return (0, common_1.handlePossibleAxiosErrors)(async () => {
        const headers = await (0, common_js_1.getGraphQLAPIHeaders)(session);
        const response = await httpGraphQL_js_1.default.post(``, {
            query: graphql_1.getItemsBySuperCategoryStringQuery,
            variables: { id, agency_id },
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
exports.getItemsBySuperCategoryId = getItemsBySuperCategoryId;
/**
 * createItemSuperCategory
 * @param session
 * @param headers
 * @returns
 */
async function createItemSuperCategory(headers, body) {
    return (0, common_1.handlePossibleAxiosErrors)(async () => {
        const response = await httpZauru_js_1.default.post("/settings/items/item_super_categories.json", { item_super_category: body }, { headers });
        return response.data;
    });
}
exports.createItemSuperCategory = createItemSuperCategory;
/**
 * createItemCategory
 * @param session
 * @param headers
 * @returns
 */
async function createItemCategory(headers, body) {
    return (0, common_1.handlePossibleAxiosErrors)(async () => {
        const itemCategoryResponse = await httpZauru_js_1.default.post("/settings/items/item_categories", { item_category: body }, { headers });
        return itemCategoryResponse.data;
    });
}
exports.createItemCategory = createItemCategory;
/**
 * deleteItemCategory
 * @param headers
 * @param id
 * @returns
 */
async function deleteItemCategory(headers, id) {
    return (0, common_1.handlePossibleAxiosErrors)(async () => {
        await httpZauru_js_1.default.delete(`/settings/items/item_categories/${id}?destroy=true`, {
            headers,
        });
        return true;
    });
}
exports.deleteItemCategory = deleteItemCategory;
/**
 * updatePayee
 * @param session
 * @param headers
 * @returns
 */
async function updateItemCategory(headers, body) {
    return (0, common_1.handlePossibleAxiosErrors)(async () => {
        await httpZauru_js_1.default.patch(`/settings/items/item_categories/${body.id}`, { item_category: body }, { headers });
        return true;
    });
}
exports.updateItemCategory = updateItemCategory;
/**
 * createItem
 * @param headers
 * @param body
 * @returns
 */
async function createItem(headers, body) {
    return (0, common_1.handlePossibleAxiosErrors)(async () => {
        const response = await httpZauru_js_1.default.post(`/settings/items.json`, { item: body }, { headers });
        return response.data;
    });
}
exports.createItem = createItem;
/**
 * updateItem
 * @param headers
 * @param body
 * @param id
 * @returns
 */
async function updateItem(headers, body) {
    return (0, common_1.handlePossibleAxiosErrors)(async () => {
        await httpZauru_js_1.default.patch(`/settings/items/${body.id}.json`, body, {
            headers,
        });
        return true;
    });
}
exports.updateItem = updateItem;
/**
 * deleteItemCategory
 * @param headers
 * @param id
 * @returns
 */
async function deleteItem(headers, id) {
    return (0, common_1.handlePossibleAxiosErrors)(async () => {
        await httpZauru_js_1.default.delete(`/settings/items/${id}?destroy=true`, {
            headers,
        });
        return true;
    });
}
exports.deleteItem = deleteItem;
