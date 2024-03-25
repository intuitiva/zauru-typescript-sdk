import { arrayToObject, handlePossibleAxiosErrors } from "@zauru-sdk/common";
import { getGraphQLAPIHeaders } from "../common.server.js";
import httpGraphQLAPI from "./httpGraphQL.server.js";
import { getBundleByNameStringQuery, getBundlesByItemCategoryIdStringQuery, } from "@zauru-sdk/graphql";
import httpZauru from "./httpZauru.server.js";
/**
 * getBundlesByItemCategoryId
 */
export async function getBundlesByItemCategoryId(session, id) {
    return handlePossibleAxiosErrors(async () => {
        const headers = await getGraphQLAPIHeaders(session);
        const response = await httpGraphQLAPI.post("", {
            query: getBundlesByItemCategoryIdStringQuery,
            variables: {
                id,
            },
        }, { headers });
        if (response.data.errors) {
            throw new Error(response.data.errors.map((x) => x.message).join(";"));
        }
        const registers = response?.data?.data?.bundles;
        return registers;
    });
}
/**
 * getBundleByName
 */
export async function getBundleByName(session, name) {
    return handlePossibleAxiosErrors(async () => {
        const headers = await getGraphQLAPIHeaders(session);
        const response = await httpGraphQLAPI.post("", {
            query: getBundleByNameStringQuery,
            variables: {
                name,
            },
        }, { headers });
        if (response.data.errors) {
            throw new Error(response.data.errors.map((x) => x.message).join(";"));
        }
        if (!response?.data?.data?.bundles[0]) {
            throw new Error(`No se encontró ningún bundle con el nombre: ${name} asociado`);
        }
        const register = response?.data?.data?.bundles[0];
        return register;
    });
}
/**
 * createBundle
 * @param headers
 * @param body
 */
export async function createBundle(headers, body) {
    return handlePossibleAxiosErrors(async () => {
        const sendBody = {
            ...body,
            bundle_details_attributes: arrayToObject(body.bundle_details, {
                withOutId: true,
            }),
        };
        delete sendBody.bundle_details;
        const response = await httpZauru.post(`/inventories/bundles.json`, sendBody, { headers });
        return response.data;
    });
}
/**
 * updateBundle
 * @param headers
 * @param body
 */
export async function updateBundle(headers, body) {
    return handlePossibleAxiosErrors(async () => {
        const sendBody = {
            ...body,
            bundle_details_attributes: arrayToObject(body.bundle_details),
        };
        delete sendBody.bundle_details;
        const response = await httpZauru.patch(`/inventories/bundles/${body.id}.json`, sendBody, { headers });
        return response.data;
    });
}
/**
 * deleteBundle
 * @param headers
 * @param body
 */
export async function deleteBundle(headers, id) {
    return handlePossibleAxiosErrors(async () => {
        await httpZauru.delete(`/inventories/bundles/${id}?destroy=true`, {
            headers,
        });
        return true;
    });
}
