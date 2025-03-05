import { handlePossibleAxiosErrors } from "@zauru-sdk/common";
import { httpZauru } from "./httpZauru.js";
/**
 * createSerial
 * @param headers
 * @param body
 */
export async function createSerial(headers, body) {
    return handlePossibleAxiosErrors(async () => {
        const response = await httpZauru.post(`/support/serials_attended.json`, { serial: body }, { headers });
        return response.data;
    });
}
