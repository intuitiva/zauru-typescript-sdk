import type { Session } from "@remix-run/node";
import { AxiosUtilsResponse, DocumentPrint, NewDocumentPrintBody, NewPrintTemplateBody, PrintTemplate, PrintTemplateGraphQL } from "@zauru-sdk/types";
/**
 * getPayees
 * @param headers
 * @returns
 */
export declare function getPrintTemplates(session: Session): Promise<AxiosUtilsResponse<PrintTemplateGraphQL[]>>;
export declare const getPrintTemplate: (headers: any, id: number | string) => Promise<AxiosUtilsResponse<PrintTemplate>>;
export declare const createPrintTemplate: (headers: any, body: NewPrintTemplateBody) => Promise<AxiosUtilsResponse<PrintTemplate>>;
export declare const updatePrintTemplate: (headers: any, id: number | string, body: Partial<NewPrintTemplateBody>) => Promise<AxiosUtilsResponse<PrintTemplate>>;
export declare const createDocumentPrint: (headers: any, body: NewDocumentPrintBody) => Promise<AxiosUtilsResponse<DocumentPrint>>;
