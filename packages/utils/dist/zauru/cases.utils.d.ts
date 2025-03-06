import type { Session } from "@remix-run/node";
import { AxiosUtilsResponse, CaseGraphQL } from "@zauru-sdk/types";
/**
 *
 * @param headers
 * @param session
 * @returns
 */
export declare const getMyCases: (session: Session, filters?: {
    responsible_id?: number;
    closed?: boolean;
    client_id?: number;
}) => Promise<AxiosUtilsResponse<CaseGraphQL[]>>;
