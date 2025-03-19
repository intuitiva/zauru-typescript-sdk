import { arrayToObject, handlePossibleAxiosErrors } from "@zauru-sdk/common";
import { getGraphQLAPIHeaders } from "../common.js";
import { httpGraphQLAPI } from "./httpGraphQL.js";
import { getCasesStringQuery } from "@zauru-sdk/graphql";
import { httpZauru } from "./httpZauru.js";
/**
 * getCases
 */
export async function getCases(session, filters) {
    return handlePossibleAxiosErrors(async () => {
        const headers = await getGraphQLAPIHeaders(session);
        const initialFilters = {
            ...(filters ? filters : {}),
        };
        const query = getCasesStringQuery(initialFilters);
        const response = await httpGraphQLAPI.post("", {
            query,
        }, { headers });
        if (response.data.errors) {
            throw new Error(response.data.errors.map((x) => x.message).join(";"));
        }
        const registers = response?.data?.data?.cases;
        return registers;
    });
}
/**
 * createCase
 * @param headers
 * @param body
 * @returns
 */
export async function createCase(headers, body) {
    return handlePossibleAxiosErrors(async () => {
        const sendBody = {
            ...body,
            case_supplies_attributes: arrayToObject(body.case_supplies),
            tag_ids: ["", ...(body.taggings?.map((x) => x.tag_id) ?? [])],
        };
        if (sendBody.deleted_case_supplies)
            delete sendBody.deleted_case_supplies;
        if (sendBody.__rvfInternalFormId)
            delete sendBody.__rvfInternalFormId;
        if (sendBody.case_supplies)
            delete sendBody.case_supplies;
        if (sendBody.taggings)
            delete sendBody.taggings;
        const response = await httpZauru.post(`/support/cases.json`, { case: sendBody }, { headers });
        return response.data;
    });
}
/**
 * updateCase
 * @param headers
 * @param body
 * @returns
 */
export async function updateCase(headers, body) {
    return handlePossibleAxiosErrors(async () => {
        const sendBody = {
            ...body,
            case_supplies_attributes: arrayToObject(body.case_supplies),
        };
        if (sendBody.deleted_case_supplies)
            delete sendBody.deleted_case_supplies;
        if (sendBody.__rvfInternalFormId)
            delete sendBody.__rvfInternalFormId;
        if (sendBody.case_supplies)
            delete sendBody.case_supplies;
        const response = await httpZauru.patch(`/support/cases/${body.id}.json`, { case: sendBody }, { headers });
        return response.data;
    });
}
/**
 * deleteCase
 * @param headers
 * @param body
 */
export async function deleteCase(headers, id) {
    return handlePossibleAxiosErrors(async () => {
        await httpZauru.delete(`/support/cases/${id}.json`, {
            headers,
        });
        return true;
    });
}
/**
 * closeCase
 * @param headers
 * @param id
 * @returns
 */
export async function closeCase(headers, id) {
    return handlePossibleAxiosErrors(async () => {
        await httpZauru.get(`/support/cases/${id}/close.json`, { headers });
        return true;
    });
}
/**
 * sendCaseEmail
 * @param headers
 * @param id
 * @returns
 */
export async function sendCaseEmail(headers, id) {
    return handlePossibleAxiosErrors(async () => {
        await httpZauru.get(`/support/cases/${id}/send_email.json`, {
            headers,
        });
        return true;
    });
}
//==============================================
//======= ENDPOINTS DE POS/CASES
//==============================================
/**
 * createPOSCase
 * @param headers
 * @param body
 * @returns
 */
export async function createPOSCase(headers, body) {
    return handlePossibleAxiosErrors(async () => {
        const sendBody = {
            ...body,
            case_supplies_attributes: arrayToObject(body.case_supplies),
            tag_ids: ["", ...(body.taggings?.map((x) => x.tag_id) ?? [])],
        };
        if (sendBody.deleted_case_supplies)
            delete sendBody.deleted_case_supplies;
        if (sendBody.__rvfInternalFormId)
            delete sendBody.__rvfInternalFormId;
        if (sendBody.case_supplies)
            delete sendBody.case_supplies;
        if (sendBody.taggings)
            delete sendBody.taggings;
        const response = await httpZauru.post(`/pos/cases.json`, { case: sendBody }, { headers });
        return response.data;
    });
}
/**
 * updatePOSCase
 * @param headers
 * @param body
 * @returns
 */
export async function updatePOSCase(headers, body) {
    return handlePossibleAxiosErrors(async () => {
        const sendBody = {
            ...body,
            case_supplies_attributes: arrayToObject(body.case_supplies),
        };
        if (sendBody.deleted_case_supplies)
            delete sendBody.deleted_case_supplies;
        if (sendBody.__rvfInternalFormId)
            delete sendBody.__rvfInternalFormId;
        if (sendBody.case_supplies)
            delete sendBody.case_supplies;
        const response = await httpZauru.patch(`/pos/cases/${body.id}.json`, { case: sendBody }, { headers });
        return response.data;
    });
}
/**
 * closePOSCase
 * @param headers
 * @param id
 * @returns
 */
export async function closePOSCase(headers, id) {
    return handlePossibleAxiosErrors(async () => {
        await httpZauru.get(`/pos/cases/${id}/close.json`, { headers });
        return true;
    });
}
