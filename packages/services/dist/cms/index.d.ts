import { AxiosUtilsResponse } from "@zauru-sdk/types";
/**
 * getCMSGeneralQuery
 * @param headers
 * @param queryKey - clave dinámica para acceder a los datos en la respuesta (ej. 'purchase_orders', 'users')
 * @returns
 */
export declare const getCMSGeneralQuery: <T>(query: string) => Promise<AxiosUtilsResponse<T[]>>;
