import { handlePossibleAxiosErrors } from "@zauru-sdk/common";
import { AxiosUtilsResponse } from "@zauru-sdk/types";
import httpZauru from "./httpZauru.server.js";

/**
 *
 * @param headers
 * @returns
 */
export const getReceptionTemplate = async (
  headers: any,
  id: string | number
): Promise<AxiosUtilsResponse<string>> => {
  return handlePossibleAxiosErrors(async () => {
    const response = await httpZauru.get<string>(
      `/settings/templates/print_templates/${id}/preview_with_vars`,
      {
        headers,
      }
    );

    return response.data;
  });
};
