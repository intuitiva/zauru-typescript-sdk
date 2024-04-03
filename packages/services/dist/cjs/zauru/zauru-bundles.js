"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBundle = exports.updateBundle = exports.createBundle = exports.getBundleByName = exports.getBundlesByItemCategoryId = void 0;
const common_1 = require("@zauru-sdk/common");
const common_js_1 = require("../common.js");
const httpGraphQL_js_1 = __importDefault(require("./httpGraphQL.js"));
const graphql_1 = require("@zauru-sdk/graphql");
const httpZauru_js_1 = __importDefault(require("./httpZauru.js"));
/**
 * getBundlesByItemCategoryId
 */
async function getBundlesByItemCategoryId(session, id) {
    return (0, common_1.handlePossibleAxiosErrors)(async () => {
        const headers = await (0, common_js_1.getGraphQLAPIHeaders)(session);
        const response = await httpGraphQL_js_1.default.post("", {
            query: graphql_1.getBundlesByItemCategoryIdStringQuery,
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
exports.getBundlesByItemCategoryId = getBundlesByItemCategoryId;
/**
 * getBundleByName
 */
async function getBundleByName(session, name) {
    return (0, common_1.handlePossibleAxiosErrors)(async () => {
        const headers = await (0, common_js_1.getGraphQLAPIHeaders)(session);
        const response = await httpGraphQL_js_1.default.post("", {
            query: graphql_1.getBundleByNameStringQuery,
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
exports.getBundleByName = getBundleByName;
/**
 * createBundle
 * @param headers
 * @param body
 */
async function createBundle(headers, body) {
    return (0, common_1.handlePossibleAxiosErrors)(async () => {
        const sendBody = {
            ...body,
            bundle_details_attributes: (0, common_1.arrayToObject)(body.bundle_details, {
                withOutId: true,
            }),
        };
        delete sendBody.bundle_details;
        const response = await httpZauru_js_1.default.post(`/inventories/bundles.json`, sendBody, { headers });
        return response.data;
    });
}
exports.createBundle = createBundle;
/**
 * updateBundle
 * @param headers
 * @param body
 */
async function updateBundle(headers, body) {
    return (0, common_1.handlePossibleAxiosErrors)(async () => {
        const sendBody = {
            ...body,
            bundle_details_attributes: (0, common_1.arrayToObject)(body.bundle_details),
        };
        delete sendBody.bundle_details;
        const response = await httpZauru_js_1.default.patch(`/inventories/bundles/${body.id}.json`, sendBody, { headers });
        return response.data;
    });
}
exports.updateBundle = updateBundle;
/**
 * deleteBundle
 * @param headers
 * @param body
 */
async function deleteBundle(headers, id) {
    return (0, common_1.handlePossibleAxiosErrors)(async () => {
        await httpZauru_js_1.default.delete(`/inventories/bundles/${id}?destroy=true`, {
            headers,
        });
        return true;
    });
}
exports.deleteBundle = deleteBundle;
