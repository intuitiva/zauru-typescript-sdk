import type { Session } from "@remix-run/node";
import { AxiosUtilsResponse } from "@zauru-sdk/webapp-types";
/**
 * updateMuestraAutomaticNumber
 * @param headers
 * @param session
 * @returns
 */
export declare const updateMuestraAutomaticNumber: (headers: any, session: Session, current_number: number) => Promise<AxiosUtilsResponse<boolean>>;
