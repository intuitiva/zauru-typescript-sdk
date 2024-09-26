import type { Session } from "@remix-run/node";
import { AxiosUtilsResponse, EmployeeGraphQL } from "@zauru-sdk/types";
/**
 * getEmployeesByAgencyId
 */
export declare function getEmployeesByAgencyId(session: Session, id: number | string): Promise<AxiosUtilsResponse<EmployeeGraphQL[]>>;
