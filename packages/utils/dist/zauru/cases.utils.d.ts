import type { Session } from "@remix-run/node";
import { AxiosUtilsResponse, CaseGraphQL } from "@zauru-sdk/types";
/**
 *
 * @param headers
 * @param session
 * @returns
 */
export declare const getMyCases: (session: Session, wheres?: string[]) => Promise<AxiosUtilsResponse<CaseGraphQL[]>>;
