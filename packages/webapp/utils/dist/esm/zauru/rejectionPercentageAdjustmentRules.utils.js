import { handlePossibleAxiosErrors } from "@zauru-sdk/common";
import { createWebAppTableRegister, getRejectionPercentageAdjustmentRulesByHeaders, getVariablesByName, getWebAppTableRegisters, updateWebAppTableRegister, } from "@zauru-sdk/services";
export { applyRejectionPercentageAdjustmentRules, applyRejectionPercentageRulesToFinancials, filterActiveRejectionPercentageAdjustmentRules, formatRejectionPercentageAdjustmentDescription, rejectionPercentageAdjustmentRuleMatches, resolveRejectionPercentageBase, resolveRejectionPercentageOrigin, REJECTION_PERCENTAGE_ADJUSTMENT_RULES_TABLE_VAR, } from "@zauru-sdk/common";
import { filterActiveRejectionPercentageAdjustmentRules, REJECTION_PERCENTAGE_ADJUSTMENT_RULES_TABLE_VAR, } from "@zauru-sdk/common";
const getTableId = async (headers, session) => {
    const vars = await getVariablesByName(headers, session, [
        REJECTION_PERCENTAGE_ADJUSTMENT_RULES_TABLE_VAR,
    ]);
    return vars[REJECTION_PERCENTAGE_ADJUSTMENT_RULES_TABLE_VAR];
};
export const getRejectionPercentageAdjustmentRules = (headers, session) => {
    return handlePossibleAxiosErrors(async () => {
        const tableId = await getTableId(headers, session);
        const response = await getWebAppTableRegisters(session, tableId);
        if (response.error) {
            throw new Error(`Ocurrió un error al consultar las reglas de ajuste de porcentaje de rechazo: ${response.userMsg}`);
        }
        return response.data ?? [];
    });
};
export const getActiveRejectionPercentageAdjustmentRules = async (headers, session) => {
    try {
        if (session) {
            const response = await getRejectionPercentageAdjustmentRules(headers, session);
            if (response.error) {
                return [];
            }
            return filterActiveRejectionPercentageAdjustmentRules(response.data);
        }
        const response = await getRejectionPercentageAdjustmentRulesByHeaders(headers);
        if (response.error) {
            return [];
        }
        return filterActiveRejectionPercentageAdjustmentRules(response.data);
    }
    catch {
        return [];
    }
};
export const createRejectionPercentageAdjustmentRule = (headers, session, body) => {
    return handlePossibleAxiosErrors(async () => {
        const tableId = await getTableId(headers, session);
        return createWebAppTableRegister(headers, tableId, body);
    });
};
export const updateRejectionPercentageAdjustmentRule = (headers, session, id, body) => {
    return handlePossibleAxiosErrors(async () => {
        const tableId = await getTableId(headers, session);
        return updateWebAppTableRegister(headers, tableId, Number(id), body);
    });
};
