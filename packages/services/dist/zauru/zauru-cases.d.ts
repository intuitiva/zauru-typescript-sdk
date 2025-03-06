import type { Session } from "@remix-run/node";
import { AxiosUtilsResponse, CaseGraphQL } from "@zauru-sdk/types";
/**
 * getCasesByResponsibleId
 */
export declare function getCasesByResponsibleId(session: Session, filters?: {
    responsible_id?: number;
    closed?: boolean;
    client_id?: number;
}): Promise<AxiosUtilsResponse<CaseGraphQL[]>>;
