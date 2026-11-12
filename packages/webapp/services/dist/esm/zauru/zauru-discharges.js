import { getGraphQLAPIHeaders, getVariablesByName } from "../common.js";
import { handlePossibleAxiosErrors } from "@zauru-sdk/common";
import { getDischargeDetailsByPurchaseOrderIdsStringQuery } from "@zauru-sdk/graphql";
import { httpGraphQLAPI } from "./httpGraphQL.js";
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
        const { discharge_template_id } = await getVariablesByName(headers, session, ["discharge_template_id"]);
        body.print_template = discharge_template_id;
        const response = await httpZauru.post("/purchases/discharges/gen_print_all.json", body, { headers });
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
        const response = await httpZauru.get("purchases/discharges/check_print_all", {
            headers,
            params: { zid },
        });
        return response.data;
    });
};
const dischargeDetailsFromRestPurchaseOrder = (purchaseOrder) => (purchaseOrder.discharge_details ?? []).map((detail) => ({
    id: Number(detail.id),
    amount: Number(detail.amount ?? 0),
    exchange_amount: detail.exchange_amount ?? null,
    purchase_order_id: Number(detail.purchase_order_id ?? purchaseOrder.id),
    discharge_id: Number(detail.discharge_id ?? detail.discharge?.id ?? 0),
    discharge: detail.discharge,
}));
export const getDischargeDetailsByPurchaseOrderIds = (session, restHeaders, purchaseOrderIds) => {
    return handlePossibleAxiosErrors(async () => {
        const ids = [
            ...new Set(purchaseOrderIds
                .map((id) => Number(id))
                .filter((id) => Number.isFinite(id) && id > 0)),
        ];
        if (ids.length === 0) {
            return [];
        }
        try {
            const graphqlHeaders = await getGraphQLAPIHeaders(session);
            const collected = [];
            const chunkSize = 200;
            for (let index = 0; index < ids.length; index += chunkSize) {
                const chunk = ids.slice(index, index + chunkSize);
                const response = await httpGraphQLAPI.post("", {
                    query: getDischargeDetailsByPurchaseOrderIdsStringQuery(chunk),
                }, { headers: graphqlHeaders });
                if (response.data?.errors?.length) {
                    throw new Error(response.data.errors.map((error) => error.message).join(";"));
                }
                collected.push(...(response.data?.data?.discharge_details ?? []));
            }
            return collected;
        }
        catch {
            const collected = [];
            for (const id of ids) {
                const response = await httpZauru.get(`/purchases/purchase_orders/${id}.json`, { headers: restHeaders });
                collected.push(...dischargeDetailsFromRestPurchaseOrder(response.data));
            }
            return collected;
        }
    });
};
