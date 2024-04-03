"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePayeeCategory = exports.updatePayeeCategory = exports.createPayeeCategory = exports.updatePayee = exports.deletePayee = exports.createPayee = exports.getClientCategories = exports.getProviderCategories = exports.getPayeeCategories = exports.getPayeeCategoriesByNotesMatch = exports.getPayeesByCategoryId = exports.getPayee = exports.getProviders = exports.getPayees = void 0;
const common_1 = require("@zauru-sdk/common");
const httpGraphQL_js_1 = __importDefault(require("./httpGraphQL.js"));
const common_js_1 = require("../common.js");
const graphql_1 = require("@zauru-sdk/graphql");
const httpZauru_js_1 = __importDefault(require("./httpZauru.js"));
/**
 * getPayees
 * @param headers
 * @returns
 */
async function getPayees(session) {
    return (0, common_1.handlePossibleAxiosErrors)(async () => {
        const headers = await (0, common_js_1.getGraphQLAPIHeaders)(session);
        const response = await httpGraphQL_js_1.default.post(``, {
            query: graphql_1.getPayeesStringQuery,
        }, {
            headers,
        });
        return response.data?.data.payees;
    });
}
exports.getPayees = getPayees;
/**
 * getProviders
 * @param headers
 * @returns
 */
async function getProviders(session) {
    return (0, common_1.handlePossibleAxiosErrors)(async () => {
        const headers = await (0, common_js_1.getGraphQLAPIHeaders)(session);
        const response = await httpGraphQL_js_1.default.post(``, {
            query: graphql_1.getProvidersStringQuery,
        }, {
            headers,
        });
        return response.data?.data.payees;
    });
}
exports.getProviders = getProviders;
/**
 * getPayee
 * @param session
 * @param id
 */
async function getPayee(session, id) {
    return (0, common_1.handlePossibleAxiosErrors)(async () => {
        const headers = await (0, common_js_1.getGraphQLAPIHeaders)(session);
        const responsePayee = await httpGraphQL_js_1.default.post("", {
            query: graphql_1.getPayeeByIdStringQuery,
            variables: {
                id,
            },
        }, { headers });
        if (!responsePayee?.data?.data?.payees[0]) {
            throw new Error("No se encontró el beneficiario indicado");
        }
        return responsePayee?.data?.data?.payees[0];
    });
}
exports.getPayee = getPayee;
/**
 * getPayeesByCategoryId
 * @param session
 * @param categoryId
 * @returns
 */
async function getPayeesByCategoryId(session, id) {
    return (0, common_1.handlePossibleAxiosErrors)(async () => {
        const headers = await (0, common_js_1.getGraphQLAPIHeaders)(session);
        const response = await httpGraphQL_js_1.default.post(``, {
            query: graphql_1.getPayeeCategoryByIdStringQuery,
            variables: { id },
        }, { headers });
        if (response.data.errors) {
            throw new Error(response.data.errors.map((x) => x.message).join(";"));
        }
        if (!response?.data?.data?.payee_categories[0]) {
            return [];
        }
        return response.data?.data?.payee_categories[0]?.payees;
    });
}
exports.getPayeesByCategoryId = getPayeesByCategoryId;
/**
 * getPayeeCategoriesByNotesMatch
 * @param session
 * @param match
 * @returns
 */
async function getPayeeCategoriesByNotesMatch(session, match) {
    return (0, common_1.handlePossibleAxiosErrors)(async () => {
        const headers = await (0, common_js_1.getGraphQLAPIHeaders)(session);
        const response = await httpGraphQL_js_1.default.post(``, {
            query: (0, graphql_1.getPayeeCategoriesByNotesMatchStringQuery)(match),
        }, { headers });
        if (response.data.errors) {
            throw new Error(response.data.errors.map((x) => x.message).join(";"));
        }
        return response.data?.data?.payee_categories;
    });
}
exports.getPayeeCategoriesByNotesMatch = getPayeeCategoriesByNotesMatch;
/**
 * getPayeeCategories
 * @param session
 * @param match
 * @returns
 */
async function getPayeeCategories(session) {
    return (0, common_1.handlePossibleAxiosErrors)(async () => {
        const headers = await (0, common_js_1.getGraphQLAPIHeaders)(session);
        const response = await httpGraphQL_js_1.default.post(``, {
            query: graphql_1.getPayeeCategoriesStringQuery,
        }, { headers });
        if (response.data.errors) {
            throw new Error(response.data.errors.map((x) => x.message).join(";"));
        }
        return response.data?.data?.payee_categories;
    });
}
exports.getPayeeCategories = getPayeeCategories;
/**
 * getProviderCategories
 * @param session
 * @param match
 * @returns
 */
async function getProviderCategories(session) {
    return (0, common_1.handlePossibleAxiosErrors)(async () => {
        const headers = await (0, common_js_1.getGraphQLAPIHeaders)(session);
        const response = await httpGraphQL_js_1.default.post(``, {
            query: graphql_1.getProviderCategoriesStringQuery,
        }, { headers });
        if (response.data.errors) {
            throw new Error(response.data.errors.map((x) => x.message).join(";"));
        }
        return response.data?.data?.payee_categories;
    });
}
exports.getProviderCategories = getProviderCategories;
/**
 * getProviderCategories
 * @param session
 * @param match
 * @returns
 */
async function getClientCategories(session) {
    return (0, common_1.handlePossibleAxiosErrors)(async () => {
        const headers = await (0, common_js_1.getGraphQLAPIHeaders)(session);
        const response = await httpGraphQL_js_1.default.post(``, {
            query: graphql_1.getClientCategoriesStringQuery,
        }, { headers });
        if (response.data.errors) {
            throw new Error(response.data.errors.map((x) => x.message).join(";"));
        }
        return response.data?.data?.payee_categories;
    });
}
exports.getClientCategories = getClientCategories;
/**
 * createPayee
 * @param session
 * @param headers
 * @returns
 */
async function createPayee(headers, body) {
    return (0, common_1.handlePossibleAxiosErrors)(async () => {
        await httpZauru_js_1.default.post("/settings/payees", { payee: body }, { headers });
        return true;
    });
}
exports.createPayee = createPayee;
/**
 * deletePayee
 * @param headers
 * @param id
 * @returns
 */
async function deletePayee(headers, id) {
    return (0, common_1.handlePossibleAxiosErrors)(async () => {
        await httpZauru_js_1.default.delete(`/settings/payees/${id}?destroy=true`, {
            headers,
        });
        return true;
    });
}
exports.deletePayee = deletePayee;
/**
 * updatePayee
 * @param session
 * @param headers
 * @returns
 */
async function updatePayee(headers, body) {
    return (0, common_1.handlePossibleAxiosErrors)(async () => {
        await httpZauru_js_1.default.patch(`/settings/payees/${body.id}`, { payee: body }, { headers });
        return true;
    });
}
exports.updatePayee = updatePayee;
/**
 * createPayeeCategory
 * @param session
 * @param headers
 * @returns
 */
async function createPayeeCategory(headers, body) {
    return (0, common_1.handlePossibleAxiosErrors)(async () => {
        const response = await httpZauru_js_1.default.post("/settings/payees/payee_categories", { payee_category: body }, { headers });
        return response.data;
    });
}
exports.createPayeeCategory = createPayeeCategory;
/**
 * updatePayeeCategory
 * @param session
 * @param headers
 * @returns
 */
async function updatePayeeCategory(headers, body) {
    return (0, common_1.handlePossibleAxiosErrors)(async () => {
        await httpZauru_js_1.default.patch(`/settings/payees/payee_categories/${body.id}`, { payee_category: body }, { headers });
        return true;
    });
}
exports.updatePayeeCategory = updatePayeeCategory;
/**
 * deletePayeeCategory
 * @param headers
 * @param id
 * @returns
 */
async function deletePayeeCategory(headers, id) {
    return (0, common_1.handlePossibleAxiosErrors)(async () => {
        await httpZauru_js_1.default.delete(`/settings/payees/payee_categories/${id}?destroy=true`, {
            headers,
        });
        return true;
    });
}
exports.deletePayeeCategory = deletePayeeCategory;
