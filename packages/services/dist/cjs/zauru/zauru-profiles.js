"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAgencyInfo = exports.changeEntity = exports.getProfileInformation = exports.getEmployeeInfo = exports.getOauthUserInfo = void 0;
const httpZauru_js_1 = __importDefault(require("./httpZauru.js"));
const httpOauth_js_1 = __importDefault(require("./httpOauth.js"));
const common_1 = require("@zauru-sdk/common");
const config_1 = require("@zauru-sdk/config");
/**
 * getOauthUserInfo
 * @param codeValue
 * @returns
 */
const getOauthUserInfo = async (codeValue) => {
    return (0, common_1.handlePossibleAxiosErrors)(async () => {
        const response = await httpOauth_js_1.default.get(`/api/userinfo`, {
            headers: {
                Authorization: `Bearer ${codeValue}`,
            },
        });
        return response.data;
    });
};
exports.getOauthUserInfo = getOauthUserInfo;
/**
 *
 * @param employeeId
 * @param headers
 * @returns
 */
const getEmployeeInfo = async (id, headers) => {
    return (0, common_1.handlePossibleAxiosErrors)(async () => {
        const employeeInfo = await httpZauru_js_1.default.get(`/settings/employees/${id}.json`, { headers });
        return employeeInfo.data;
    });
};
exports.getEmployeeInfo = getEmployeeInfo;
/**
 * getProfileInformation
 * @param headers
 * @returns
 */
const getProfileInformation = async (headers) => {
    return (0, common_1.handlePossibleAxiosErrors)(async () => {
        const response = await httpZauru_js_1.default.get(`/profile.json`, {
            headers,
        });
        return response.data;
    });
};
exports.getProfileInformation = getProfileInformation;
const changeEntity = async (headers, entityId) => {
    const changeEntityFetch = await httpZauru_js_1.default.patch(`${config_1.config.zauruBaseURL}/company.json`, JSON.stringify({
        selected_entity_id: entityId,
    }), {
        headers,
    });
    return changeEntityFetch.data;
};
exports.changeEntity = changeEntity;
/**
 *
 * @param headers
 * @returns
 */
const getAgencyInfo = async (headers, session) => {
    return (0, common_1.handlePossibleAxiosErrors)(async () => {
        const agency_id = session.get("agency_id");
        if (!agency_id) {
            throw new Error("No hay una agencia asignada para este usuario... Contacte con su administrador.");
        }
        const response = await httpZauru_js_1.default.get(`/settings/agencies/${agency_id}.json`, {
            headers,
        });
        return response?.data;
    });
};
exports.getAgencyInfo = getAgencyInfo;
