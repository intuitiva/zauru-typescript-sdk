import { handlePossibleAxiosErrors } from "@zauru-sdk/common";
import { getGraphQLAPIHeaders } from "~/common.server.js";
import httpGraphQLAPI from "./httpGraphQL.server.js";
import { getWebAppRowStringQuery, getWebAppRowsByWebAppTableIdStringQuery, } from "@zauru-sdk/graphql";
import httpZauru from "./httpZauru.server.js";
/**
 * getWebAppRow
 * @param headers
 * @returns
 */
export async function getWebAppRow(session, id) {
    return handlePossibleAxiosErrors(async () => {
        const headers = await getGraphQLAPIHeaders(session);
        const response = await httpGraphQLAPI.post("", {
            query: getWebAppRowStringQuery,
            variables: {
                id,
            },
        }, { headers });
        return response.data?.data?.webapp_rows[0]?.data;
    });
}
/**
 * getWebAppTableRegisters Function for get all web app table registers
 * @param headers
 * @param webapp_table_id web app table id
 * @returns
 */
export async function getWebAppTableRegisters(session, webapp_table_id) {
    return handlePossibleAxiosErrors(async () => {
        const headers = await getGraphQLAPIHeaders(session);
        const response = await httpGraphQLAPI.post("", {
            query: getWebAppRowsByWebAppTableIdStringQuery,
            variables: {
                webapp_table_id,
            },
        }, { headers });
        if (response.data.errors) {
            throw new Error(response.data.errors.map((x) => x.message).join(";"));
        }
        if (!response?.data?.data.webapp_rows) {
            return [];
        }
        return response.data?.data?.webapp_rows;
    });
}
/**
 * deleteWebAppTableRegister Function for delete a web app table register
 * @param headers
 * @param id_web_app_table
 * @param id_register
 * @returns
 */
export async function deleteWebAppTableRegister(headers, id_web_app_table, id_register) {
    const response = await httpZauru(`/apps/webapp_tables/${id_web_app_table}/webapp_rows/${id_register}.json`, {
        method: "DELETE",
        headers: headers,
    });
    return response.data;
}
/**
 * createWebAppTableRegister function for create a new web app table register
 * @param headers
 * @param body
 * @param id_web_app_table
 * @returns
 */
export async function createWebAppTableRegister(headers, id_web_app_table, body, extraBody) {
    const requestBody = {
        webapp_row: { data: body },
        ...(extraBody ?? {}),
    };
    const response = await httpZauru(`/apps/webapp_tables/${id_web_app_table}/webapp_rows.json`, {
        method: "POST",
        headers: headers,
        data: requestBody,
    });
    return response.data;
}
/**
 * updateWebAppTableRegister Function for update a web app table register
 * @param headers
 * @param id_web_app_table
 * @param id_register
 * @returns
 */
export async function updateWebAppTableRegister(headers, id_web_app_table, id_register, body) {
    const requestBody = { webapp_row: { data: body } };
    const response = await httpZauru(`/apps/webapp_tables/${id_web_app_table}/webapp_rows/${id_register}.json`, {
        method: "PATCH",
        headers: headers,
        data: requestBody,
    });
    return response.data;
}
//============================== WEB APP TABLE
/**
 *
 * @param headers
 * @param body
 * @returns
 */
export async function createWebAppTable(headers, body) {
    try {
        const response = await httpZauru.post(`/apps/webapp_tables.json`, { webapp_table: body }, {
            headers,
        });
        return {
            data: response.data,
            error: false,
        };
    }
    catch (error) {
        return {
            msg: error,
            error: true,
            userMsg: `Ocurrió un error al intentar crear la web app table ${body.name}`,
        };
    }
}
