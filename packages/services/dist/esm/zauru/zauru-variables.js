import chalk from "chalk";
import httpZauru from "./httpZauru.js";
import { handlePossibleAxiosErrors } from "@zauru-sdk/common";
/**
 * getVariables Function for get all zauru variables
 * @param headers
 * @returns
 */
export async function getVariables(headers) {
    try {
        const response = await httpZauru(`/apps/webapp_vars.json`, {
            method: "GET",
            headers: headers,
        });
        return { data: response.data, error: false };
    }
    catch (error) {
        console.log(chalk.red(`OCURRIÓ UN ERROR AL CARGAR LAS VARIABLES: ${error}`));
        return {
            msg: error,
            error: true,
            userMsg: "Ocurrió un error al intentar obtener las variables",
        };
    }
}
/**
 *
 * @param headers
 * @param body
 * @returns
 */
export async function createVariable(headers, body) {
    try {
        const response = await httpZauru.post(`/apps/webapp_vars.json`, { variable: body }, {
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
export const updateVariable = async (headers, body) => {
    return handlePossibleAxiosErrors(async () => {
        await httpZauru.patch(`/apps/webapp_vars/${body.id}.json`, { variable: body }, { headers });
        return true;
    });
};
