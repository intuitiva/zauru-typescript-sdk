"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateMuestraAutomaticNumber = void 0;
const services_1 = require("@zauru-sdk/services");
const common_1 = require("@zauru-sdk/common");
/**
 * updateMuestraAutomaticNumber
 * @param headers
 * @param session
 * @returns
 */
const updateMuestraAutomaticNumber = async (headers, session, current_number) => {
    return (0, common_1.handlePossibleAxiosErrors)(async () => {
        let msg = "";
        const { lab_muestra_automatic_number_id } = await (0, services_1.getVariablesByName)(headers, session, ["lab_muestra_automatic_number_id"]);
        const response = await (0, services_1.updateAutomaticNumber)(headers, {
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
exports.updateMuestraAutomaticNumber = updateMuestraAutomaticNumber;
