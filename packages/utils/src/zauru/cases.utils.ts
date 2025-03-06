import type { Session } from "@remix-run/node";
import { handlePossibleAxiosErrors } from "@zauru-sdk/common";
import { getCasesByResponsibleId } from "@zauru-sdk/services";
import { AxiosUtilsResponse, CaseGraphQL } from "@zauru-sdk/types";

/**
 *
 * @param headers
 * @param session
 * @returns
 */
export const getMyCases = async (
  session: Session,
  filters?: {
    responsible_id?: number;
    closed?: boolean;
    client_id?: number;
  }
): Promise<AxiosUtilsResponse<CaseGraphQL[]>> => {
  return handlePossibleAxiosErrors(async () => {
    const response = await getCasesByResponsibleId(session, filters);

    if (response.error) {
      throw new Error(
        `Ocurrió un error al consultar los casos asignados a este usuario: ${response.userMsg}`
      );
    }

    return response?.data ?? [];
  });
};
