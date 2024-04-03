import { handlePossibleAxiosErrors } from "@zauru-sdk/common";
import { createInvoiceOrder, getInvoicesByAgencyId, getVariablesByName, } from "@zauru-sdk/services";
/**
 *
 * @param headers
 * @param session
 * @returns
 */
export const getInvoicesByLabAgency = async (headers, session) => {
    return handlePossibleAxiosErrors(async () => {
        const { lab_agency_id } = await getVariablesByName(headers, session, [
            "lab_agency_id",
        ]);
        const response = await getInvoicesByAgencyId(session, lab_agency_id);
        if (response.error) {
            const msg = `Ocurrió un error al consultar las órdenes/facturas por agencia de laboratorio: ${response.userMsg}`;
            console.error(msg);
            throw new Error(msg);
        }
        return response?.data ?? [];
    });
};
/**
 * createNewLabInvoiceOrder
 * @param headers
 * @param session
 * @returns
 */
export const createNewLabInvoiceOrder = async (headers, session, body) => {
    return handlePossibleAxiosErrors(async () => {
        const { lab_agency_id, laboratory_proyect_id } = await getVariablesByName(headers, session, ["lab_agency_id", "laboratory_proyect_id"]);
        const sendBody = {
            ...body,
            agency_id: Number(lab_agency_id),
            tagging_invoices: [
                { tag_id: Number(laboratory_proyect_id), id: 0, invoice_id: 0 },
            ],
        };
        const bundleResponse = await createInvoiceOrder(headers, sendBody);
        if (bundleResponse.error) {
            const msg = `Ocurrió un error al intentar crear (invoice-order): ${bundleResponse.userMsg}`;
            console.error(msg);
            throw new Error(msg);
        }
        return true;
    });
};
/**
 * makeInvoiceDetailsWithPrice
 * @param invoice_details
 * @returns
 */
export const makeInvoiceDetailsWithPrice = (invoice_details, deleted_invoice_details = []) => {
    return [
        ...invoice_details.map((x) => {
            //Si trae una B al inicio, es un bundleID, de lo contrario, es un item_id
            const bundle_id = x.item_id?.startsWith("B")
                ? Number(x.item_id.replace("B", ""))
                : undefined;
            const item_id = !bundle_id ? Number(x.item_id) : undefined;
            const id = isNaN(x.id) ? undefined : x.id;
            return {
                id,
                bundle_id,
                item_id,
                quantity: Number(x.quantity),
                //unit_price: Number(x.price),
                //price: Number(x.total),
                _destroy: false,
            };
        }),
        ...deleted_invoice_details.map((x) => {
            return {
                id: x.id,
                _destroy: true,
            };
        }),
    ];
};
