import type { Session } from "@remix-run/node";
import { AxiosUtilsResponse, SubmissionInvoicesGraphQL, TransformedObject } from "@zauru-sdk/types";
export declare function transformFormSubmitObject(input: {
    [key: string]: any;
}): TransformedObject;
type OutputData = {
    index: number;
    item_id: number;
    form_id?: number;
    document_id: number;
    reference?: string;
    zid?: string;
    fields: {
        [field_id: number]: string;
    }[];
};
export declare function transformResultadosFormData(input: {
    [key: string]: string;
}, document_id: number): OutputData[];
/**
 *
 * @param data
 * @returns
 */
export declare const createRespuestaFormSubmission: (headers: any, data: OutputData) => Promise<AxiosUtilsResponse<any>>;
/**
 *
 * @param headers
 * @param session
 * @returns
 */
export declare const getLastMuestra: (headers: any, session: Session) => Promise<AxiosUtilsResponse<SubmissionInvoicesGraphQL>>;
export declare const getMuestrasByInvoiceId: (headers: any, session: Session, invoice_id: string) => Promise<AxiosUtilsResponse<SubmissionInvoicesGraphQL[]>>;
export {};
