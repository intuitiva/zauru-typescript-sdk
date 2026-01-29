import { Session } from "@remix-run/node";
import { AxiosRequestHeaders } from "axios";
import { EmployeeGraphQL, OauthProfile, ProfileResponse, AgencyGraphQL, VariableGraphQL, AxiosUtilsResponse } from "@zauru-sdk/types";
/**
 * nativeLogin
 * @param session
 * @param codeValue
 * @param cookie
 * @returns
 */
export declare const nativeLogin: (session: Session, codeValue: string) => Promise<AxiosUtilsResponse<OauthProfile>>;
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
    agencyProfile: AgencyGraphQL;
}>>;
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
export declare const getCMSHeaders: () => Promise<AxiosRequestHeaders>;
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
/**
 *
 * @param headers
 * @param session
 * @param names
 * @returns
 */
export declare function getVariablesByName(headers: any, session: Session, names: Array<string>): Promise<{
    [key: string]: string;
}>;
export declare function getVariablesSchemaByName(headers: any, session: Session, names: Array<string>): Promise<VariableGraphQL[]>;
/**
 * Actualiza las variables en la sesión.
 * @param {any} headers - Headers necesarios para la consulta.
 * @param {Session} session - La sesión actual.
 * @returns {Promise<void>}
 */
export declare function actualizarVariables(headers: any, session: Session): Promise<void>;
