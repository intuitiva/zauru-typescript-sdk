import { getVariablesByName } from "../common.js";
import { handlePossibleAxiosErrors } from "@zauru-sdk/common";
import { httpZauru } from "./httpZauru.js";
/**
 *
 * @param headers
 * @returns
 */
export const createDischarge = async (session, headers, body) => {
    return handlePossibleAxiosErrors(async () => {
        const { id_check_discharge_method } = await getVariablesByName(headers, session, ["id_check_discharge_method"]);
        body.discharge.discharge_method_id = id_check_discharge_method;
        const response = await httpZauru.post(`/purchases/discharges.json`, body, {
            headers,
        });
        return response.data;
    });
};
/**
 * generateDischargePDF
 * @param headers
 * @param body
 */
export const generateDischargePDF = async (headers, session, body) => {
    return handlePossibleAxiosErrors(async () => {
        const { consolidated_template_id } = await getVariablesByName(headers, session, ["consolidated_template_id"]);
        body.print_template = consolidated_template_id;
        const response = await httpZauru.post("/purchases/consolidates/gen_print_all.json", body, { headers });
        return response.data;
    });
};
/**
 * getDischargePDFResult
 * @param headers
 * @param zid
 * @returns
 */
export const getDischargePDFResult = async (headers, zid) => {
    return handlePossibleAxiosErrors(async () => {
        const response = await httpZauru.get("purchases/consolidates/check_print_all", {
            headers,
            params: { zid },
        });
        return response.data;
    });
};
