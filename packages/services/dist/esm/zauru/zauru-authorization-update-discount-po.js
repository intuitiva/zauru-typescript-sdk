import { handlePossibleAxiosErrors } from "@zauru-sdk/common";
import { getVariablesByName } from "../common.js";
import { createWebAppTableRegister, deleteWebAppTableRegister, getWebAppTableRegisters, } from "./zauru-web-app-tables.js";
export async function getAuthorizationUpdateDiscountPO(headers, session) {
    return handlePossibleAxiosErrors(async () => {
        const { cc_autorizaciones } = await getVariablesByName(headers, session, [
            "cc_autorizaciones",
        ]);
        const response = await getWebAppTableRegisters(session, cc_autorizaciones);
        if (response.error || !response.data) {
            throw new Error(response.userMsg);
        }
        return response?.data;
    });
}
export async function deleteAuthorizationUpdateDiscountPO(headers, session, id) {
    return handlePossibleAxiosErrors(async () => {
        const { cc_autorizaciones } = await getVariablesByName(headers, session, [
            "cc_autorizaciones",
        ]);
        const response = await deleteWebAppTableRegister(headers, cc_autorizaciones, id);
        return response;
    });
}
export async function createAuthorizationUpdateDiscountPO(headers, session, body) {
    return handlePossibleAxiosErrors(async () => {
        const { cc_autorizaciones } = await getVariablesByName(headers, session, [
            "cc_autorizaciones",
        ]);
        const response = await createWebAppTableRegister(headers, cc_autorizaciones, body);
        return response;
    });
}
