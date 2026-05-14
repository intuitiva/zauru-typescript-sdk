import { Session } from "@remix-run/node";
import { AxiosUtilsResponse } from "@zauru-sdk/types";
/**
 * getGeneralQuery
 * @param headers
 * @param queryKey - clave dinámica para acceder a los datos en la respuesta (ej. 'purchase_orders', 'users')
 * @returns
 */
export declare const getGeneralQuery: <T>(session: Session, query: string, queryKey: string) => Promise<AxiosUtilsResponse<T[]>>;
