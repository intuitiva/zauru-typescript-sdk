import {
  DocumentAutomaticNumberGraphQL,
  AxiosUtilsResponse,
} from "@zauru-sdk/types";
import { handlePossibleAxiosErrors } from "@zauru-sdk/common";
import httpZauru from "./httpZauru.server.js";

/**
 * updateAutomaticNumber
 * @param headers
 * @param body
 * @returns
 */
export const updateAutomaticNumber = async (
  headers: any,
  body: Partial<DocumentAutomaticNumberGraphQL>
): Promise<AxiosUtilsResponse<DocumentAutomaticNumberGraphQL>> => {
  return handlePossibleAxiosErrors(async () => {
    const sendBody: any = {
      document_automatic_number: {
        ...body,
      },
    };

    const response = await httpZauru.put<DocumentAutomaticNumberGraphQL>(
      `/settings/templates/document_automatic_numbers/${body.id}.json`,
      sendBody,
      {
        headers,
      }
    );

    return response.data;
  });
};
