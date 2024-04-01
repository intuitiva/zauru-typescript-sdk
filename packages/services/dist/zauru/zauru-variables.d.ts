import { VariableGraphQL, AxiosUtilsResponse } from "@zauru-sdk/types";
/**
 * getVariables Function for get all zauru variables
 * @param headers
 * @returns
 */
export declare function getVariables(headers: any): Promise<AxiosUtilsResponse<VariableGraphQL[]>>;
/**
 *
 * @param headers
 * @param body
 * @returns
 */
export declare function createVariable(headers: any, body: Partial<VariableGraphQL>): Promise<AxiosUtilsResponse<VariableGraphQL>>;
