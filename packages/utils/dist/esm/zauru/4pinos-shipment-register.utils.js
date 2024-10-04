import { getHeaders, getSession } from "@zauru-sdk/services";
export const register4pinosShipment = async ({ cookie, idWebAppTable, agency_id, values, }) => {
    const session = await getSession(cookie);
    const headers = await getHeaders(cookie, session);
    console.log(values);
};
