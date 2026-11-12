import { httpZauru } from "./httpZauru.js";
import { httpOauth } from "./httpOauth.js";
import { handlePossibleAxiosErrors } from "@zauru-sdk/common";
/**
 * getOauthUserInfo
 * @param codeValue
 * @returns
 */
export const getOauthUserInfo = async (codeValue) => {
    return handlePossibleAxiosErrors(async () => {
        const response = await httpOauth.get(`/api/userinfo`, {
            headers: {
                Authorization: `Bearer ${codeValue}`,
            },
        });
        return response.data;
    });
};
/**
 *
 * @param employeeId
 * @param headers
 * @returns
 */
export const getEmployeeInfo = async (id, headers) => {
    return handlePossibleAxiosErrors(async () => {
        const employeeInfo = await httpZauru.get(`/settings/employees/${id}.json`, { headers });
        return employeeInfo.data;
    });
};
/**
 * getProfileInformation
 * @param headers
 * @returns
 */
export const getProfileInformation = async (headers) => {
    return handlePossibleAxiosErrors(async () => {
        const response = await httpZauru.get(`/profile.json`, {
            headers,
        });
        return response.data;
    });
};
export const changeEntity = async (headers, entityId) => {
    const changeEntityFetch = await httpZauru.patch(`/company.json`, { selected_entity_id: String(entityId) }, {
        headers,
    });
    return changeEntityFetch.data;
};
export const withSelectedEntity = async (headers, entityId, fn) => {
    await changeEntity(headers, String(entityId));
    const responseToken = await httpZauru.get("/apps/graphql.json", {
        headers,
    });
    if (!responseToken.data?.token) {
        throw new Error("No viene información en la solicitud de getGraphQLToken a Zauru");
    }
    const graphqlHeaders = {
        Authorization: `Bearer ${responseToken.data.token}`,
        "Content-Type": "application/json",
    };
    return fn({ restHeaders: headers, graphqlHeaders });
};
/**
 *
 * @param headers
 * @returns
 */
export const getAgencyInfo = async (headers, session) => {
    return handlePossibleAxiosErrors(async () => {
        const agency_id = session.get("agency_id");
        if (!agency_id) {
            throw new Error("No hay una agencia asignada para este usuario... Contacte con su administrador.");
        }
        const response = await httpZauru.get(`/settings/agencies/${agency_id}.json`, {
            headers,
        });
        return response?.data;
    });
};
