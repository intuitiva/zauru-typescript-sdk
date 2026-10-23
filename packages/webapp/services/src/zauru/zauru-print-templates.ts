import type { Session } from "@remix-run/node";
import { handlePossibleAxiosErrors } from "@zauru-sdk/common";
import {
  AxiosUtilsResponse,
  DocumentPrint,
  NewDocumentPrintBody,
  NewPrintTemplateBody,
  PrintTemplate,
  PrintTemplateGraphQL,
} from "@zauru-sdk/types";
import { httpGraphQLAPI } from "./httpGraphQL.js";
import { getGraphQLAPIHeaders } from "../common.js";
import { getPrintTemplatesStringQuery } from "@zauru-sdk/graphql";
import { httpZauru } from "./httpZauru.js";

/**
 * getPayees
 * @param headers
 * @returns
 */
export async function getPrintTemplates(
  session: Session
): Promise<AxiosUtilsResponse<PrintTemplateGraphQL[]>> {
  return handlePossibleAxiosErrors(async () => {
    const headers = await getGraphQLAPIHeaders(session);
    const response = await httpGraphQLAPI.post<{
      data: { print_templates: PrintTemplateGraphQL[] };
    }>(
      ``,
      {
        query: getPrintTemplatesStringQuery,
      },
      {
        headers,
      }
    );

    return response.data?.data.print_templates;
  });
}

export const getPrintTemplate = async (
  headers: any,
  id: number | string
): Promise<AxiosUtilsResponse<PrintTemplate>> => {
  return handlePossibleAxiosErrors(async () => {
    const response = await httpZauru.get<PrintTemplate>(
      `/settings/templates/print_templates/${id}.json`,
      { headers }
    );
    return response.data;
  });
};

export const createPrintTemplate = async (
  headers: any,
  body: NewPrintTemplateBody
): Promise<AxiosUtilsResponse<PrintTemplate>> => {
  return handlePossibleAxiosErrors(async () => {
    const response = await httpZauru.post<PrintTemplate>(
      `/settings/templates/print_templates.json`,
      { print_template: body },
      { headers }
    );
    return response.data;
  });
};

export const updatePrintTemplate = async (
  headers: any,
  id: number | string,
  body: Partial<NewPrintTemplateBody>
): Promise<AxiosUtilsResponse<PrintTemplate>> => {
  return handlePossibleAxiosErrors(async () => {
    const response = await httpZauru.patch<PrintTemplate>(
      `/settings/templates/print_templates/${id}.json`,
      { print_template: body },
      { headers }
    );
    return response.data;
  });
};

export const createDocumentPrint = async (
  headers: any,
  body: NewDocumentPrintBody
): Promise<AxiosUtilsResponse<DocumentPrint>> => {
  return handlePossibleAxiosErrors(async () => {
    const response = await httpZauru.post<DocumentPrint>(
      `/settings/templates/document_prints.json`,
      { document_print: body },
      { headers }
    );
    return response.data;
  });
};
