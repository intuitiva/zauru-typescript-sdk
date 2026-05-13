import type { Session } from "@remix-run/node";
import { handlePossibleAxiosErrors } from "@zauru-sdk/webapp-common";
import { AxiosUtilsResponse, PrintTemplateGraphQL } from "@zauru-sdk/webapp-types";
import { httpGraphQLAPI } from "./httpGraphQL.js";
import { getGraphQLAPIHeaders } from "../common.js";
import { getPrintTemplatesStringQuery } from "@zauru-sdk/webapp-graphql";

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
