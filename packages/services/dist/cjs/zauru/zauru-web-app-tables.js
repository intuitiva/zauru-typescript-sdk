"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRejectionWebAppTable = exports.createWebAppTable = exports.updateWebAppTableRegister = exports.createWebAppTableRegister = exports.deleteWebAppTableRegister = exports.getWebAppTableRegisters = exports.getWebAppRow = void 0;
const common_1 = require("@zauru-sdk/common");
const common_js_1 = require("../common.js");
const httpGraphQL_js_1 = __importDefault(require("./httpGraphQL.js"));
const graphql_1 = require("@zauru-sdk/graphql");
const httpZauru_js_1 = __importDefault(require("./httpZauru.js"));
/**
 * getWebAppRow
 * @param headers
 * @returns
 */
async function getWebAppRow(session, id) {
    return (0, common_1.handlePossibleAxiosErrors)(async () => {
        const headers = await (0, common_js_1.getGraphQLAPIHeaders)(session);
        const response = await httpGraphQL_js_1.default.post("", {
            query: (0, graphql_1.getWebAppRowStringQuery)(id),
        }, { headers });
        if (response.data.errors) {
            throw new Error(response.data.errors.map((x) => x.message).join(";"));
        }
        return response.data?.data?.webapp_rows[0]?.data;
    });
}
exports.getWebAppRow = getWebAppRow;
/**
 * getWebAppTableRegisters Function for get all web app table registers
 * @param headers
 * @param webapp_table_id web app table id
 * @returns
 */
async function getWebAppTableRegisters(session, webapp_table_id) {
    return (0, common_1.handlePossibleAxiosErrors)(async () => {
        const headers = await (0, common_js_1.getGraphQLAPIHeaders)(session);
        const response = await httpGraphQL_js_1.default.post("", {
            query: (0, graphql_1.getWebAppRowsByWebAppTableIdStringQuery)(Number(webapp_table_id)),
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
exports.getWebAppTableRegisters = getWebAppTableRegisters;
/**
 * deleteWebAppTableRegister Function for delete a web app table register
 * @param headers
 * @param id_web_app_table
 * @param id_register
 * @returns
 */
async function deleteWebAppTableRegister(headers, id_web_app_table, id_register) {
    const response = await (0, httpZauru_js_1.default)(`/apps/webapp_tables/${id_web_app_table}/webapp_rows/${id_register}.json`, {
        method: "DELETE",
        headers: headers,
    });
    return response.data;
}
exports.deleteWebAppTableRegister = deleteWebAppTableRegister;
/**
 * createWebAppTableRegister function for create a new web app table register
 * @param headers
 * @param body
 * @param id_web_app_table
 * @returns
 */
async function createWebAppTableRegister(headers, id_web_app_table, body, extraBody) {
    const requestBody = {
        webapp_row: { data: body },
        ...(extraBody ?? {}),
    };
    const response = await (0, httpZauru_js_1.default)(`/apps/webapp_tables/${id_web_app_table}/webapp_rows.json`, {
        method: "POST",
        headers: headers,
        data: requestBody,
    });
    return response.data;
}
exports.createWebAppTableRegister = createWebAppTableRegister;
/**
 * updateWebAppTableRegister Function for update a web app table register
 * @param headers
 * @param id_web_app_table
 * @param id_register
 * @returns
 */
async function updateWebAppTableRegister(headers, id_web_app_table, id_register, body) {
    const requestBody = { webapp_row: { data: body } };
    const response = await (0, httpZauru_js_1.default)(`/apps/webapp_tables/${id_web_app_table}/webapp_rows/${id_register}.json`, {
        method: "PATCH",
        headers: headers,
        data: requestBody,
    });
    return response.data;
}
exports.updateWebAppTableRegister = updateWebAppTableRegister;
//============================== WEB APP TABLE
/**
 *
 * @param headers
 * @param body
 * @returns
 */
async function createWebAppTable(headers, body) {
    try {
        const response = await httpZauru_js_1.default.post(`/apps/webapp_tables.json`, { webapp_table: body }, {
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
exports.createWebAppTable = createWebAppTable;
/**
 * getWebappTable
 * @param headers
 * @param session
 * @returns
 */
const getRejectionWebAppTable = async (headers, session) => {
    return (0, common_1.handlePossibleAxiosErrors)(async () => {
        const { recepciones_rejections_webapp_table_id, recepciones_rejection_types_webapp_table_id, } = await (0, common_js_1.getVariablesByName)(headers, session, [
            "recepciones_rejections_webapp_table_id",
            "recepciones_rejection_types_webapp_table_id",
        ]);
        const webappTableResponse = await httpZauru_js_1.default.get(`/apps/webapp_tables/${recepciones_rejections_webapp_table_id}.json`, { headers });
        const webappTableRejectionsResponse = await httpZauru_js_1.default.get(`/apps/webapp_tables/${recepciones_rejection_types_webapp_table_id}/webapp_rows.json`, { headers });
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
exports.getRejectionWebAppTable = getRejectionWebAppTable;
