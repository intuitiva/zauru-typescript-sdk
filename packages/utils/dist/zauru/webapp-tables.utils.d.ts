import type { Session } from "@remix-run/node";
import { AxiosUtilsResponse, WebAppRowGraphQL, ReceptionType } from "@zauru-sdk/types";
/**
 * Get template history entries from the web app table.
 * @param headers Request headers.
 * @param session Session object.
 * @returns A Promise of AxiosUtilsResponse<ReceptionType[]>.
 */
export declare const getReceptionTypes: (headers: any, session: Session) => Promise<AxiosUtilsResponse<WebAppRowGraphQL<ReceptionType>[]>>;
