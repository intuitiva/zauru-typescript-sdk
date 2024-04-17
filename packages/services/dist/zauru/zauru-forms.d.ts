import type { Session } from "@remix-run/node";
import { AxiosUtilsResponse, FormDocumentType, FormGraphQL, FormSubmissionGraphQL, SubmissionCasesGraphQL, SubmissionInvoicesGraphQL } from "@zauru-sdk/types";
/**
 * getForms
 */
export declare function getForms(session: Session): Promise<AxiosUtilsResponse<FormGraphQL[]>>;
/**
 * getFormByName
 */
export declare function getFormByName(session: Session, name: string): Promise<AxiosUtilsResponse<FormGraphQL>>;
/**
 * getAllForms
 */
export declare function getAllForms(session: Session, filters?: {
    withSubmissions: boolean;
}): Promise<AxiosUtilsResponse<FormGraphQL[]>>;
/**
 * getFormsByDocumentType
 */
export declare function getFormsByDocumentType(session: Session, document_type: FormDocumentType, filters?: {
    formZid?: number;
}): Promise<AxiosUtilsResponse<FormGraphQL[]>>;
/**
 * getFormSubmissionById
 */
export declare function getFormSubmissionById(headersZauru: any, session: Session, id: string | number, config?: {
    withFiles?: boolean;
}): Promise<AxiosUtilsResponse<FormSubmissionGraphQL>>;
/**
 * getInvoiceFormSubmissionsByAgencyId
 */
export declare function getInvoiceFormSubmissionsByAgencyId(session: Session, agency_id: string, filters?: {
    startDate?: string;
    endDate?: string;
    seller_id?: string | number;
    payee_id_number_search?: string;
    some_field_value?: string;
    item_ids?: number[];
    bundle_ids?: number[];
}): Promise<AxiosUtilsResponse<SubmissionInvoicesGraphQL[]>>;
/**
 * getMyCaseFormSubmissions
 */
export declare function getMyCaseFormSubmissions(headersZauru: any, session: Session, filters?: {
    formZid?: number;
    caseId?: number;
}, config?: {
    withFiles?: boolean;
}): Promise<AxiosUtilsResponse<SubmissionCasesGraphQL[]>>;
/**
 * getLastInvoiceFormSubmission
 * @param session
 * @param filters
 * @returns
 */
export declare function getLastInvoiceFormSubmission(session: Session, filters?: {
    formZid?: number;
}): Promise<AxiosUtilsResponse<SubmissionInvoicesGraphQL>>;
/**
 * getInvoiceFormSubmissionsByInvoiceId
 */
export declare function getInvoiceFormSubmissionsByInvoiceId(session: Session, invoice_id: string, filters?: {
    formZid?: number;
}): Promise<AxiosUtilsResponse<SubmissionInvoicesGraphQL[]>>;
export declare const getFormSubmissionAPIZauru: (headers: any, id: number | string) => Promise<AxiosUtilsResponse<any>>;
/**
 * createForm
 * @param headers
 * @param body
 */
export declare function createForm(headers: any, body: Partial<FormGraphQL>): Promise<AxiosUtilsResponse<FormGraphQL>>;
/**
 * deleteForm
 * @param headers
 * @param body
 */
export declare function deleteForm(headers: any, id: string | number): Promise<AxiosUtilsResponse<boolean>>;
/**
 * createForm
 * @param headers
 * @param body
 */
export declare function updateForm(headers: any, body: Partial<FormGraphQL>): Promise<AxiosUtilsResponse<FormGraphQL>>;
/**
 * createFormSubmission
 * @param headers
 * @param body
 * @returns
 */
export declare function createFormSubmission(headers: any, body: Partial<FormSubmissionGraphQL>): Promise<AxiosUtilsResponse<FormSubmissionGraphQL>>;
/**
 * updateSubmissionInvoiceFormSubmission
 * @param headers
 * @param body
 * @returns
 */
export declare function updateSubmissionInvoiceFormSubmission(headers: any, body: Partial<SubmissionInvoicesGraphQL>): Promise<AxiosUtilsResponse<FormSubmissionGraphQL>>;
/**
 * deleteFormSubmission
 * @param headers
 * @param body
 */
export declare function deleteFormSubmission(headers: any, id: string | number): Promise<AxiosUtilsResponse<boolean>>;
