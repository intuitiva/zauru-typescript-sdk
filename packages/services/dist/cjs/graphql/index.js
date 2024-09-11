"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGeneralQuery = void 0;
const common_1 = require("@zauru-sdk/common");
const common_js_1 = require("../common.js");
const httpGraphQL_js_1 = __importDefault(require("../zauru/httpGraphQL.js"));
/**
 * getGeneralQuery
 * @param headers
 * @param queryKey - clave dinámica para acceder a los datos en la respuesta (ej. 'purchase_orders', 'users')
 * @returns
 */
const getGeneralQuery = async (session, query, queryKey // Clave dinámica
) => {
    return (0, common_1.handlePossibleAxiosErrors)(async () => {
        const headers = await (0, common_js_1.getGraphQLAPIHeaders)(session);
        // Respuesta con clave dinámica basada en queryKey
        const response = await httpGraphQL_js_1.default.post("", {
            query,
        }, { headers });
        if (response.data.errors) {
            throw new Error(response.data.errors.map((x) => x.message).join(";"));
        }
        // Retorna los datos según la clave dinámica proporcionada
        return response.data.data[queryKey];
    });
};
exports.getGeneralQuery = getGeneralQuery;
