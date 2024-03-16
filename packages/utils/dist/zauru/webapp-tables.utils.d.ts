import type { Session } from "@remix-run/node";
import { AxiosUtilsResponse, RejectionWebAppTableObject, WebAppRowGraphQL, ReceptionType } from "@zauru-sdk/types";
/**
 * getWebappTable
 * @param headers
 * @param session
 * @returns
 */
export declare const getRejectionWebAppTable: (headers: any, session: Session) => Promise<AxiosUtilsResponse<RejectionWebAppTableObject>>;
/**
 * Get template history entries from the web app table.
 * @param headers Request headers.
 * @param session Session object.
 * @returns A Promise of AxiosUtilsResponse<ReceptionType[]>.
 */
export declare function getReceptionTypes(headers: any, session: Session): Promise<AxiosUtilsResponse<WebAppRowGraphQL<ReceptionType>[]>>;
