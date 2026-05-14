import type { Session } from "@remix-run/node";
import { AxiosUtilsResponse, GeneratePDFBody, NewDischargeBody, PDFResult } from "@zauru-sdk/types";
/**
 *
 * @param headers
 * @returns
 */
export declare const createDischarge: (session: Session, headers: any, body: NewDischargeBody) => Promise<AxiosUtilsResponse<{
    id: number;
}>>;
/**
 * generateDischargePDF
 * @param headers
 * @param body
 */
export declare const generateDischargePDF: (headers: any, session: Session, body: GeneratePDFBody) => Promise<AxiosUtilsResponse<{
    status: number;
    zid: number;
}>>;
/**
 * getDischargePDFResult
 * @param headers
 * @param zid
 * @returns
 */
export declare const getDischargePDFResult: (headers: any, zid: number | string) => Promise<AxiosUtilsResponse<PDFResult>>;
