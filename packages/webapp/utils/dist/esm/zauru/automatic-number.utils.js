import { updateAutomaticNumber, getVariablesByName } from "@zauru-sdk/services";
import { handlePossibleAxiosErrors } from "@zauru-sdk/common";
/**
 * updateMuestraAutomaticNumber
 * @param headers
 * @param session
 * @returns
 */
export const updateMuestraAutomaticNumber = async (headers, session, current_number) => {
    return handlePossibleAxiosErrors(async () => {
        let msg = "";
        const { lab_muestra_automatic_number_id } = await getVariablesByName(headers, session, ["lab_muestra_automatic_number_id"]);
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
