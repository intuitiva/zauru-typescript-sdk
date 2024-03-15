import { Session } from "@remix-run/node";
import { AxiosRequestHeaders } from "axios";
import { AxiosUtilsResponse } from "./zauru/httpZauru.server.js";
import { Agency, OauthProfile, ProfileResponse } from "./zauru/zauru-profiles.server.js";
import { EmployeeGraphQL } from "@zauru-sdk/graphql";
/**
 * loginWebApp
 * @param session
 * @param codeValue
 * @param cookie
 * @returns
 */
export declare const loginWebApp: (session: Session, codeValue: string, cookie: string) => Promise<AxiosUtilsResponse<{
    headers: any;
    oauthProfile: OauthProfile;
    employeeProfile: EmployeeGraphQL;
    userProfile: ProfileResponse;
    agencyProfile: Agency;
}>>;
export type GraphQLToken = {
    status: number;
    message: string;
    token: string;
    expires: string;
    expiresMsg: string;
    graphqlUrl: string;
};
/**
 * Obtiene los headers que se usan en todos los endpoints de zauru
 * @param cookie
 * @param _session La session es opcional, se envía sólo si ya se tiene a la mano, para ya no volverla a consultar.
 * @returns
 */
export declare const getHeaders: (cookie: string | null, _session?: Session | null, config?: {
    token: string;
    username: string;
} | null, extraConfig?: {
    withOutContentType: string;
}) => Promise<{
    [key: string]: string;
}>;
/**
 * getGraphQLAPIHeaders
 * @param session
 * @returns
 */
export declare const getGraphQLAPIHeaders: (session: Session) => Promise<AxiosRequestHeaders>;
export type SessionMessage = {
    id: string;
    title: string;
    message: string;
};
export declare const saveSessionMessage: (session: Session, info: SessionMessage) => Promise<void>;
export declare const deleteSessionMessage: (session: Session, id: string) => Promise<boolean>;
export declare function generateDistinctCode(prefix: string): string;
