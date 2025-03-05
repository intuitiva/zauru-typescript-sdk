import { handlePossibleAxiosErrors } from "@zauru-sdk/common";
import { AxiosUtilsResponse, SerialGraphQL } from "@zauru-sdk/types";
import { httpZauru } from "./httpZauru.js";

/**
 * createSerial
 * @param headers
 * @param body
 */
export async function createSerial(
  headers: any,
  body: Partial<SerialGraphQL>
): Promise<AxiosUtilsResponse<SerialGraphQL>> {
  return handlePossibleAxiosErrors(async () => {
    const response = await httpZauru.post<SerialGraphQL>(
      `/support/serials_attended.json`,
      { serial: body },
      { headers }
    );
    return response.data;
  });
}
