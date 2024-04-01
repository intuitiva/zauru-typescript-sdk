import chalk from "chalk";
import httpZauru from "./httpZauru.js";
import { VariableGraphQL, AxiosUtilsResponse } from "@zauru-sdk/types";

/**
 * getVariables Function for get all zauru variables
 * @param headers
 * @returns
 */
export async function getVariables(
  headers: any
): Promise<AxiosUtilsResponse<VariableGraphQL[]>> {
  try {
    const response = await httpZauru<VariableGraphQL[]>(
      `/apps/webapp_vars.json`,
      {
        method: "GET",
        headers: headers,
      }
    );

    return { data: response.data, error: false } as AxiosUtilsResponse<
      VariableGraphQL[]
    >;
  } catch (error) {
    console.log(
      chalk.red(`OCURRIÓ UN ERROR AL CARGAR LAS VARIABLES: ${error}`)
    );
    return {
      msg: error,
      error: true,
      userMsg: "Ocurrió un error al intentar obtener las variables",
    } as AxiosUtilsResponse<VariableGraphQL[]>;
  }
}

/**
 *
 * @param headers
 * @param body
 * @returns
 */
export async function createVariable(
  headers: any,
  body: Partial<VariableGraphQL>
) {
  try {
    const response = await httpZauru.post<VariableGraphQL>(
      `/apps/webapp_vars.json`,
      { variable: body },
      {
        headers,
      }
    );

    return {
      data: response.data,
      error: false,
    } as AxiosUtilsResponse<VariableGraphQL>;
  } catch (error) {
    return {
      msg: error,
      error: true,
      userMsg: `Ocurrió un error al intentar crear la variable ${body.name}`,
    } as AxiosUtilsResponse<VariableGraphQL>;
  }
}
