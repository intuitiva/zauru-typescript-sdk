"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateAutomaticNumber = void 0;
const common_1 = require("@zauru-sdk/common");
const httpZauru_js_1 = __importDefault(require("./httpZauru.js"));
/**
 * updateAutomaticNumber
 * @param headers
 * @param body
 * @returns
 */
const updateAutomaticNumber = async (headers, body) => {
    return (0, common_1.handlePossibleAxiosErrors)(async () => {
        const sendBody = {
            document_automatic_number: {
                ...body,
            },
        };
        const response = await httpZauru_js_1.default.put(`/settings/templates/document_automatic_numbers/${body.id}.json`, sendBody, {
            headers,
        });
        return response.data;
    });
};
exports.updateAutomaticNumber = updateAutomaticNumber;
