"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getReceptionTemplate = void 0;
const common_1 = require("@zauru-sdk/common");
const httpZauru_js_1 = __importDefault(require("./httpZauru.js"));
/**
 *
 * @param headers
 * @returns
 */
const getReceptionTemplate = async (headers, id) => {
    return (0, common_1.handlePossibleAxiosErrors)(async () => {
        const response = await httpZauru_js_1.default.get(`/settings/templates/print_templates/${id}/preview_with_vars`, {
            headers,
        });
        return response.data;
    });
};
exports.getReceptionTemplate = getReceptionTemplate;
