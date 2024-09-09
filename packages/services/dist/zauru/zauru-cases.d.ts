import type { Session } from "@remix-run/node";
import { AxiosUtilsResponse, CaseGraphQL } from "@zauru-sdk/types";
/**
 * getCasesByResponsibleId
 */
export declare function getCasesByResponsibleId(session: Session, responsible_id: number | string, wheres?: string[]): Promise<AxiosUtilsResponse<CaseGraphQL[]>>;
