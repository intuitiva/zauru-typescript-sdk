import { handlePossibleAxiosErrors } from "@zauru-sdk/common";
import { AxiosUtilsResponse } from "@zauru-sdk/types";
import { getCMSHeaders } from "../common.js";
import { httpCMSAPI } from "../zauru/httpCMS.js";

export type CMSGeneralQueryResponse<T> = {
  docs: T[];
  hasNextPage: boolean;
  hasPrevPage: boolean;
  limit: number;
  nextPage: number | null;
  offset: number;
  page: number;
  pagingCounter: number;
  prevPage: number | null;
  totalDocs: number;
  totalPages: number;
};

/**
 * getCMSGeneralQuery
 * @param query
 * @returns
 */
export const getCMSGeneralQuery = async <T>(
  query: string
): Promise<
  AxiosUtilsResponse<{
    [key: string]: CMSGeneralQueryResponse<T>;
  }>
> => {
  return handlePossibleAxiosErrors(async () => {
    const headers = await getCMSHeaders();

    // Respuesta con clave dinámica basada en query
    const response = await httpCMSAPI.post<{
      data?: {
        [key: string]: CMSGeneralQueryResponse<T>;
      };
      errors?: {
        message: string;
        extensions: { path: string; code: string };
      }[];
    }>(
      "/api/graphql",
      {
        query,
      },
      { headers }
    );

    if (response.data.errors) {
      throw new Error(response.data.errors?.map((x) => x.message).join(";"));
    }

    if (!response.data.data) {
      throw new Error("No data found");
    }

    // Retorna los datos según la clave dinámica proporcionada
    return response.data.data;
  });
};
