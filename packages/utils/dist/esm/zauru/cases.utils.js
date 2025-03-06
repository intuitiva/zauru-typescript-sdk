import { handlePossibleAxiosErrors } from "@zauru-sdk/common";
import { getCasesByResponsibleId } from "@zauru-sdk/services";
/**
 *
 * @param headers
 * @param session
 * @returns
 */
export const getMyCases = async (session, filters) => {
    return handlePossibleAxiosErrors(async () => {
        const response = await getCasesByResponsibleId(session, filters);
        if (response.error) {
            throw new Error(`Ocurrió un error al consultar los casos asignados a este usuario: ${response.userMsg}`);
        }
        return response?.data ?? [];
    });
};
/**
 * makeCaseSuppliesWithPrice
 * @param case_supplies
 * @returns
 */
export const makeCaseSuppliesWithPrice = (case_supplies, deleted_case_supplies = []) => {
    return [
        ...case_supplies.map((x) => {
            const item_id = Number(x.item_id);
            const id = isNaN(x.id) ? undefined : x.id;
            return {
                id,
                item_id,
                quantity: Number(x.quantity),
                unit_price: Number(x.unit_price),
                reference: x.reference,
                _destroy: false,
            };
        }),
        ...deleted_case_supplies.map((x) => {
            return {
                id: x.id,
                _destroy: true,
            };
        }),
    ];
};
