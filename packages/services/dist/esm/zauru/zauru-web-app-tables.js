import { handlePossibleAxiosErrors } from "@zauru-sdk/common";
import { getGraphQLAPIHeaders, getVariablesByName } from "../common.js";
import httpGraphQLAPI from "./httpGraphQL.js";
import { getWebAppRowStringQuery, getWebAppRowsByWebAppTableIdStringQuery, } from "@zauru-sdk/graphql";
import httpZauru from "./httpZauru.js";
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
        if (response.data.errors) {
            throw new Error(response.data.errors.map((x) => x.message).join(";"));
        }
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
/**
 * getWebappTable
 * @param headers
 * @param session
 * @returns
 */
export const getRejectionWebAppTable = async (headers, session) => {
    return handlePossibleAxiosErrors(async () => {
        const { recepciones_rejections_webapp_table_id, recepciones_rejection_types_webapp_table_id, } = await getVariablesByName(headers, session, [
            "recepciones_rejections_webapp_table_id",
            "recepciones_rejection_types_webapp_table_id",
        ]);
        const webappTableResponse = await httpZauru.get(`/apps/webapp_tables/${recepciones_rejections_webapp_table_id}.json`, { headers });
        const webappTableRejectionsResponse = await httpZauru.get(`/apps/webapp_tables/${recepciones_rejection_types_webapp_table_id}/webapp_rows.json`, { headers });
        const rejections_select = [];
        const rejections_complete = webappTableRejectionsResponse.data;
        const keyName = Object.keys(rejections_complete[0].data)[0]; //get the first value
        const rejections_list = [];
        rejections_complete.forEach((val) => {
            rejections_list.push(val.data[keyName]);
        });
        rejections_complete.forEach((rc) => {
            rejections_select.push({
                value: rc.data[keyName],
                label: rc.data[keyName],
            });
        });
        return {
            webapp_table: webappTableResponse.data.structure,
            rejection_list: rejections_list,
            rejection_select: rejections_select,
        };
    });
};
