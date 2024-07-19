import { handlePossibleAxiosErrors } from "@zauru-sdk/common";
import httpGraphQLAPI from "./httpGraphQL.js";
import { getGraphQLAPIHeaders } from "../common.js";
import { getClientCategoriesStringQuery, getPayeeByIdStringQuery, getPayeeCategoriesByNotesMatchStringQuery, getPayeeCategoriesStringQuery, getPayeeCategoryByIdStringQuery, getPayeesStringQuery, getProviderCategoriesStringQuery, getProvidersStringQuery, } from "@zauru-sdk/graphql";
import httpZauru from "./httpZauru.js";
/**
 * getPayees
 * @param headers
 * @returns
 */
export async function getPayees(session) {
    return handlePossibleAxiosErrors(async () => {
        const headers = await getGraphQLAPIHeaders(session);
        const response = await httpGraphQLAPI.post(``, {
            query: getPayeesStringQuery,
        }, {
            headers,
        });
        return response.data?.data.payees;
    });
}
/**
 * getProviders
 * @param headers
 * @returns
 */
export async function getProviders(session) {
    return handlePossibleAxiosErrors(async () => {
        const headers = await getGraphQLAPIHeaders(session);
        const response = await httpGraphQLAPI.post(``, {
            query: getProvidersStringQuery,
        }, {
            headers,
        });
        return response.data?.data.payees;
    });
}
/**
 * getPayee
 * @param session
 * @param id
 */
export async function getPayee(session, id) {
    return handlePossibleAxiosErrors(async () => {
        const headers = await getGraphQLAPIHeaders(session);
        const responsePayee = await httpGraphQLAPI.post("", {
            query: getPayeeByIdStringQuery,
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
/**
 * getCreatePayee
 * @param headers
 * @param session
 * @param id
 * @returns
 */
export async function getCreatePayee(headers, search) {
    return handlePossibleAxiosErrors(async () => {
        const response = await httpZauru.post(`/settings/payees/search_payee.json`, search, {
            headers,
        });
        return response.data;
    });
}
/**
 * getPayeesByCategoryId
 * @param session
 * @param categoryId
 * @returns
 */
export async function getPayeesByCategoryId(session, id) {
    return handlePossibleAxiosErrors(async () => {
        const headers = await getGraphQLAPIHeaders(session);
        const response = await httpGraphQLAPI.post(``, {
            query: getPayeeCategoryByIdStringQuery,
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
/**
 * getPayeeCategoriesByNotesMatch
 * @param session
 * @param match
 * @returns
 */
export async function getPayeeCategoriesByNotesMatch(session, match) {
    return handlePossibleAxiosErrors(async () => {
        const headers = await getGraphQLAPIHeaders(session);
        const response = await httpGraphQLAPI.post(``, {
            query: getPayeeCategoriesByNotesMatchStringQuery(match),
        }, { headers });
        if (response.data.errors) {
            throw new Error(response.data.errors.map((x) => x.message).join(";"));
        }
        return response.data?.data?.payee_categories;
    });
}
/**
 * getPayeeCategories
 * @param session
 * @param match
 * @returns
 */
export async function getPayeeCategories(session) {
    return handlePossibleAxiosErrors(async () => {
        const headers = await getGraphQLAPIHeaders(session);
        const response = await httpGraphQLAPI.post(``, {
            query: getPayeeCategoriesStringQuery,
        }, { headers });
        if (response.data.errors) {
            throw new Error(response.data.errors.map((x) => x.message).join(";"));
        }
        return response.data?.data?.payee_categories;
    });
}
/**
 * getProviderCategories
 * @param session
 * @param match
 * @returns
 */
export async function getProviderCategories(session) {
    return handlePossibleAxiosErrors(async () => {
        const headers = await getGraphQLAPIHeaders(session);
        const response = await httpGraphQLAPI.post(``, {
            query: getProviderCategoriesStringQuery,
        }, { headers });
        if (response.data.errors) {
            throw new Error(response.data.errors.map((x) => x.message).join(";"));
        }
        return response.data?.data?.payee_categories;
    });
}
/**
 * getProviderCategories
 * @param session
 * @param match
 * @returns
 */
export async function getClientCategories(session) {
    return handlePossibleAxiosErrors(async () => {
        const headers = await getGraphQLAPIHeaders(session);
        const response = await httpGraphQLAPI.post(``, {
            query: getClientCategoriesStringQuery,
        }, { headers });
        if (response.data.errors) {
            throw new Error(response.data.errors.map((x) => x.message).join(";"));
        }
        return response.data?.data?.payee_categories;
    });
}
/**
 * createPayee
 * @param session
 * @param headers
 * @returns
 */
export async function createPayee(headers, body) {
    return handlePossibleAxiosErrors(async () => {
        await httpZauru.post("/settings/payees", { payee: body }, { headers });
        return true;
    });
}
/**
 * deletePayee
 * @param headers
 * @param id
 * @returns
 */
export async function deletePayee(headers, id) {
    return handlePossibleAxiosErrors(async () => {
        await httpZauru.delete(`/settings/payees/${id}?destroy=true`, {
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
export async function updatePayee(headers, body) {
    return handlePossibleAxiosErrors(async () => {
        await httpZauru.patch(`/settings/payees/${body.id}`, { payee: body }, { headers });
        return true;
    });
}
/**
 * createPayeeCategory
 * @param session
 * @param headers
 * @returns
 */
export async function createPayeeCategory(headers, body) {
    return handlePossibleAxiosErrors(async () => {
        const response = await httpZauru.post("/settings/payees/payee_categories", { payee_category: body }, { headers });
        return response.data;
    });
}
/**
 * updatePayeeCategory
 * @param session
 * @param headers
 * @returns
 */
export async function updatePayeeCategory(headers, body) {
    return handlePossibleAxiosErrors(async () => {
        await httpZauru.patch(`/settings/payees/payee_categories/${body.id}`, { payee_category: body }, { headers });
        return true;
    });
}
/**
 * deletePayeeCategory
 * @param headers
 * @param id
 * @returns
 */
export async function deletePayeeCategory(headers, id) {
    return handlePossibleAxiosErrors(async () => {
        await httpZauru.delete(`/settings/payees/payee_categories/${id}?destroy=true`, {
            headers,
        });
        return true;
    });
}
