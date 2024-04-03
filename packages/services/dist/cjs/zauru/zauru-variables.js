"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createVariable = exports.getVariables = void 0;
const chalk_1 = __importDefault(require("chalk"));
const httpZauru_js_1 = __importDefault(require("./httpZauru.js"));
/**
 * getVariables Function for get all zauru variables
 * @param headers
 * @returns
 */
async function getVariables(headers) {
    try {
        const response = await (0, httpZauru_js_1.default)(`/apps/webapp_vars.json`, {
            method: "GET",
            headers: headers,
        });
        return { data: response.data, error: false };
    }
    catch (error) {
        console.log(chalk_1.default.red(`OCURRIÓ UN ERROR AL CARGAR LAS VARIABLES: ${error}`));
        return {
            msg: error,
            error: true,
            userMsg: "Ocurrió un error al intentar obtener las variables",
        };
    }
}
exports.getVariables = getVariables;
/**
 *
 * @param headers
 * @param body
 * @returns
 */
async function createVariable(headers, body) {
    try {
        const response = await httpZauru_js_1.default.post(`/apps/webapp_vars.json`, { variable: body }, {
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
            userMsg: `Ocurrió un error al intentar crear la variable ${body.name}`,
        };
    }
}
exports.createVariable = createVariable;
