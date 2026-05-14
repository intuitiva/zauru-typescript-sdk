import type { Session } from "@remix-run/node";
import { AxiosUtilsResponse, EmployeeGraphQL } from "@zauru-sdk/types";
export declare function getEmployees(session: Session, filters?: {
    id?: number;
}): Promise<AxiosUtilsResponse<EmployeeGraphQL[]>>;
/**
 * getEmployeesByAgencyId
 */
export declare function getEmployeesByAgencyId(session: Session, id: number | string): Promise<AxiosUtilsResponse<EmployeeGraphQL[]>>;
