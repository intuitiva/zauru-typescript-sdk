import type { Session } from "@remix-run/node";
import { updateAutomaticNumber, getVariablesByName } from "@zauru-sdk/services";
import { AxiosUtilsResponse } from "@zauru-sdk/types";
import { handlePossibleAxiosErrors } from "@zauru-sdk/common";

/**
 * updateMuestraAutomaticNumber
 * @param headers
 * @param session
 * @returns
 */
export const updateMuestraAutomaticNumber = async (
  headers: any,
  session: Session,
  current_number: number
): Promise<AxiosUtilsResponse<boolean>> => {
  return handlePossibleAxiosErrors(async () => {
    let msg = "";
    const { lab_muestra_automatic_number_id } = await getVariablesByName(
      headers,
      session,
      ["lab_muestra_automatic_number_id"]
    );

    const response = await updateAutomaticNumber(headers, {
      id: Number(lab_muestra_automatic_number_id),
      variable_doc_number: current_number,
    });

    if (response.error) {
      msg = `Ocurrió un error al intentar actualizar el número automático de muestras: ${response.userMsg}`;
      console.error(msg);
      throw new Error(msg);
    }

    return true;
  });
};
