import type { Session } from "@remix-run/node";
import { AxiosUtilsResponse, ConsolidateGraphQL, GeneratePDFBody, NewConsolidatedBody, PDFResult } from "@zauru-sdk/types";
/**
 *
 * @param headers
 * @returns
 */
export declare const createConsolidated: (headers: any, body: NewConsolidatedBody) => Promise<AxiosUtilsResponse<{
    id: number;
}>>;
/**
 * generateConsolidatePDF
 * @param headers
 * @param body
 */
export declare const generateConsolidatePDF: (headers: any, session: Session, body: GeneratePDFBody) => Promise<AxiosUtilsResponse<{
    status: number;
    zid: number;
}>>;
/**
 * getConsolidatedPDFResult
 * @param headers
 * @param zid
 * @returns
 */
export declare const getConsolidatedPDFResult: (headers: any, zid: number | string) => Promise<AxiosUtilsResponse<PDFResult>>;
/**
 *
 * @param session
 * @param dates
 * @returns
 */
export declare const getConsolidatesBetweenDates: (session: Session, dates: {
    startDate: string;
    endDate: string;
}) => Promise<AxiosUtilsResponse<ConsolidateGraphQL[]>>;
