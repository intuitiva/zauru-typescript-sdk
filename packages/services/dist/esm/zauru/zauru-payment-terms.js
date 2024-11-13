import { handlePossibleAxiosErrors } from "@zauru-sdk/common";
import { getGraphQLAPIHeaders } from "../common.js";
import { httpGraphQLAPI } from "./httpGraphQL.js";
import { getPaymentTermByIdStringQuery, getPaymentTermsStringQuery, } from "@zauru-sdk/graphql";
import { httpZauru } from "./httpZauru.js";
/**
 * getPaymentTerms
 */
export async function getPaymentTerms(session, config) {
    return handlePossibleAxiosErrors(async () => {
        const headers = await getGraphQLAPIHeaders(session);
        const defaultConfig = {
            includeAllowedDiscounts: false,
            includeAllowedPaymentTerms: false,
            onlyActives: true,
        };
        const query = getPaymentTermsStringQuery({ ...defaultConfig, ...config });
        const response = await httpGraphQLAPI.post("", {
            query,
        }, { headers });
        if (response.data.errors) {
            throw new Error(response.data.errors.map((x) => x.message).join(";"));
        }
        const registers = response?.data?.data?.payment_terms;
        return registers;
    });
}
/**
 * getPaymentTermById
 */
export async function getPaymentTermById(session, id) {
    return handlePossibleAxiosErrors(async () => {
        const headers = await getGraphQLAPIHeaders(session);
        const response = await httpGraphQLAPI.post("", {
            query: getPaymentTermByIdStringQuery(Number(id)),
        }, { headers });
        if (response.data.errors) {
            throw new Error(response.data.errors.map((x) => x.message).join(";"));
        }
        if (!response?.data?.data?.payment_terms[0]) {
            throw new Error("No se encontró ningún método de pago con este id: " + id);
        }
        const registers = response?.data?.data?.payment_terms[0] ?? [];
        return registers;
    });
}
/**
 * createPaymentTerm
 * @param headers
 */
export async function createPaymentTerm(headers, payment_term) {
    return handlePossibleAxiosErrors(async () => {
        const response = await httpZauru.patch(`/sales/settings/payment_terms.json`, {
            payment_term,
        }, { headers });
        return response.data;
    });
}
/**
 * updatePaymentTerm
 * @param headers
 */
export async function updatePaymentTerm(headers, payment_term) {
    return handlePossibleAxiosErrors(async () => {
        const response = await httpZauru.patch(`/sales/settings/payment_terms/${payment_term.id}.json`, {
            payment_term,
        }, { headers });
        return response.data;
    });
}
