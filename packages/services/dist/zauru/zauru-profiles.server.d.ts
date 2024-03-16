import type { Session } from "@remix-run/node";
import type { AxiosUtilsResponse } from "./httpZauru.server.js";
import { EmployeeGraphQL } from "@zauru-sdk/graphql";
/**
 * getOauthUserInfo
 * @param codeValue
 * @returns
 */
export declare const getOauthUserInfo: (codeValue: string) => Promise<AxiosUtilsResponse<OauthProfile>>;
/**
 *
 * @param employeeId
 * @param headers
 * @returns
 */
export declare const getEmployeeInfo: (id: number, headers: any) => Promise<AxiosUtilsResponse<EmployeeGraphQL>>;
/**
 * getProfileInformation
 * @param headers
 * @returns
 */
export declare const getProfileInformation: (headers: any) => Promise<AxiosUtilsResponse<ProfileResponse>>;
export declare const changeEntity: (headers: any, entityId: string) => Promise<any>;
/**
 *
 * @param headers
 * @returns
 */
export declare const getAgencyInfo: (headers: any, session: Session) => Promise<AxiosUtilsResponse<Agency>>;
