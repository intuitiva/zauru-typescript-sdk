import type { Session } from "@remix-run/node";
import { AxiosUtilsResponse, CaseGraphQL, CaseSupplyGraphQL } from "@zauru-sdk/types";
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
/**
 * makeCaseSuppliesWithPrice
 * @param case_supplies
 * @returns
 */
export declare const makeCaseSuppliesWithPrice: (case_supplies: any[], deleted_case_supplies?: any[]) => CaseSupplyGraphQL[];
