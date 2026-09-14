import { getRejectionPercentage, handlePossibleAxiosErrors, parseJsonMemo, } from "@zauru-sdk/common";
import { createWebAppTableRegister, getVariablesByName, getWebAppTableRegisters, updateWebAppTableRegister, } from "@zauru-sdk/services";
import { defaultPriceAdjustmentFilters, priceAdjustmentRuleMatches, } from "./priceAdjustmentRules.utils.js";
const TABLE_VAR = "rejection_percentage_adjustment_rules_web_app_table_id";
const asPriceAdjustmentRule = (rule) => ({
    ...rule,
    tipoValor: "percentage",
});
export const filterActiveRejectionPercentageAdjustmentRules = (rules) => (rules ?? [])
    .filter((rule) => !rule.data?.fechaEliminacion && rule.data?.activa !== false)
    .sort((a, b) => (a.data?.prioridad ?? 0) - (b.data?.prioridad ?? 0) || a.id - b.id);
const getTableId = async (headers, session) => {
    const vars = await getVariablesByName(headers, session, [TABLE_VAR]);
    return vars[TABLE_VAR];
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
export const rejectionPercentageAdjustmentRuleMatches = (rule, ctx) => {
    const filtros = rule.filtros ?? defaultPriceAdjustmentFilters();
    const priceRule = asPriceAdjustmentRule(rule);
    const itemIds = ctx.itemIds ?? [];
    if (filtros.itemMode === "all") {
        return priceAdjustmentRuleMatches(priceRule, {
            itemId: 0,
            tipo: ctx.tipo,
            providerCategoryId: ctx.providerCategoryId,
        });
    }
    if (itemIds.length === 0) {
        return false;
    }
    return itemIds.some((itemId) => priceAdjustmentRuleMatches(priceRule, {
        itemId,
        tipo: ctx.tipo,
        providerCategoryId: ctx.providerCategoryId,
    }));
};
const roundPercentage = (value, digits = 4) => {
    const factor = 10 ** digits;
    return Math.round((value + Number.EPSILON) * factor) / factor;
};
const clampPercentage = (value) => Math.min(100, Math.max(0, value));
const formatPercentage = (value) => Number.isInteger(value) ? String(value) : String(roundPercentage(value));
const formatFinalPercentage = (value) => roundPercentage(value, 2).toFixed(2);
const formatRuleEffect = (step) => {
    const sign = step.operation === "subtract" ? "-" : "+";
    return `${sign} ${formatPercentage(step.value)}% (${step.ruleName})`;
};
export const formatRejectionPercentageAdjustmentDescription = (result, baseLabel = "origen") => {
    const base = `${formatPercentage(result.basePercentage)} (${baseLabel})`;
    if (result.steps.length === 0) {
        return base;
    }
    return `${base} ${result.steps.map(formatRuleEffect).join(" ")} = ${formatFinalPercentage(result.finalPercentage)}`;
};
export const resolveRejectionPercentageBase = (memo) => {
    const parsed = parseJsonMemo(memo);
    const current = clampPercentage(getRejectionPercentage(parsed));
    const calc = parsed.rejectionCalculations;
    if (calc &&
        Number.isFinite(Number(calc.finalPercentage)) &&
        roundPercentage(current, 2) ===
            roundPercentage(Number(calc.finalPercentage), 2)) {
        const base = Number(calc.basePercentage);
        return Number.isFinite(base) ? clampPercentage(base) : current;
    }
    return current;
};
export const applyRejectionPercentageAdjustmentRules = (basePercentage, rules, ctx) => {
    const start = Number(basePercentage);
    const safeBase = Number.isFinite(start) ? clampPercentage(start) : 0;
    let runningTotal = safeBase;
    const steps = [];
    const normalized = rules
        .map((rule) => ("data" in rule ? rule.data : rule))
        .filter((rule) => Boolean(rule))
        .filter((rule) => !rule.fechaEliminacion && rule.activa !== false)
        .sort((a, b) => (a.prioridad ?? 0) - (b.prioridad ?? 0));
    for (const rule of normalized) {
        if (!rejectionPercentageAdjustmentRuleMatches(rule, ctx)) {
            continue;
        }
        const value = Number(rule.valor) || 0;
        const previous = runningTotal;
        runningTotal =
            rule.operacion === "subtract" ? previous - value : previous + value;
        runningTotal = clampPercentage(roundPercentage(runningTotal));
        steps.push({
            ruleName: rule.nombre,
            operation: rule.operacion,
            value,
            appliedAmount: roundPercentage(runningTotal - previous),
            runningTotal,
        });
    }
    const result = {
        basePercentage: roundPercentage(safeBase),
        finalPercentage: roundPercentage(runningTotal, 2),
        description: "",
        steps,
    };
    result.description = formatRejectionPercentageAdjustmentDescription(result);
    return result;
};
