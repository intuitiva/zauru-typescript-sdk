"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDischargePDFResult = exports.generateDischargePDF = exports.createDischarge = void 0;
const common_js_1 = require("../common.js");
const common_1 = require("@zauru-sdk/common");
const httpZauru_js_1 = __importDefault(require("./httpZauru.js"));
/**
 *
 * @param headers
 * @returns
 */
const createDischarge = async (session, headers, body) => {
    return (0, common_1.handlePossibleAxiosErrors)(async () => {
        const { id_check_discharge_method } = await (0, common_js_1.getVariablesByName)(headers, session, ["id_check_discharge_method"]);
        body.discharge.discharge_method_id = id_check_discharge_method;
        const response = await httpZauru_js_1.default.post(`/purchases/discharges.json`, body, {
            headers,
        });
        return response.data;
    });
};
exports.createDischarge = createDischarge;
/**
 * generateDischargePDF
 * @param headers
 * @param body
 */
const generateDischargePDF = async (headers, session, body) => {
    return (0, common_1.handlePossibleAxiosErrors)(async () => {
        const { consolidated_template_id } = await (0, common_js_1.getVariablesByName)(headers, session, ["consolidated_template_id"]);
        body.print_template = consolidated_template_id;
        const response = await httpZauru_js_1.default.post("/purchases/consolidates/gen_print_all.json", body, { headers });
        return response.data;
    });
};
exports.generateDischargePDF = generateDischargePDF;
/**
 * getDischargePDFResult
 * @param headers
 * @param zid
 * @returns
 */
const getDischargePDFResult = async (headers, zid) => {
    return (0, common_1.handlePossibleAxiosErrors)(async () => {
        const response = await httpZauru_js_1.default.get("purchases/consolidates/check_print_all", {
            headers,
            params: { zid },
        });
        return response.data;
    });
};
exports.getDischargePDFResult = getDischargePDFResult;
