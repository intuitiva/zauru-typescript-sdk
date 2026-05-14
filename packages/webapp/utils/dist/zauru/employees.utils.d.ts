import type { Session } from "@remix-run/node";
import { AxiosUtilsResponse, EmployeeGraphQL } from "@zauru-sdk/types";
/**
 *
 * @param headers
 * @param session
 * @returns
 */
export declare const getEmployeesByLabAgency: (headers: any, session: Session) => Promise<AxiosUtilsResponse<EmployeeGraphQL[]>>;
/**
 *
 * @param headers
 * @param session
 * @returns
 */
export declare const getEmployeesByCurrentAgency: (session: Session) => Promise<AxiosUtilsResponse<EmployeeGraphQL[]>>;
