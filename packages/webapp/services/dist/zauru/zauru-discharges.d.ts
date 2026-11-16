import type { Session } from "@remix-run/node";
import { AxiosUtilsResponse, CreateDischargeDetailsBody, DischargeDetailGraphQL, GeneratePDFBody, NewDischargeBody, PDFResult } from "@zauru-sdk/types";
/**
 *
 * @param headers
 * @returns
 */
export declare const createDischarge: (session: Session, headers: any, body: NewDischargeBody) => Promise<AxiosUtilsResponse<{
    id: number;
}>>;
/**
 * POST /purchases/discharges.json
 * Generic Baculo create. Does not overwrite discharge_method_id from webapp vars.
 */
export declare const createDischargeFromDetails: (headers: any, body: CreateDischargeDetailsBody) => Promise<AxiosUtilsResponse<{
    id: number;
}>>;
/**
 * DELETE /purchases/discharges/:id.json — voids the discharge and restores PO dues.
 */
export declare const deleteDischarge: (headers: any, id: number | string) => Promise<AxiosUtilsResponse<boolean>>;
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
export declare const getDischargeDetailsByPurchaseOrderIds: (session: Session, restHeaders: Record<string, string>, purchaseOrderIds: Array<number | string>) => Promise<AxiosUtilsResponse<DischargeDetailGraphQL[]>>;
