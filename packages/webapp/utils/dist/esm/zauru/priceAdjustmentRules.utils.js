import { handlePossibleAxiosErrors } from "@zauru-sdk/common";
import { createWebAppTableRegister, getVariablesByName, getWebAppTableRegisters, updateWebAppTableRegister, } from "@zauru-sdk/services";
const TABLE_VAR = "price_adjustment_rules_web_app_table_id";
const DEFAULT_FILTERS = {
    itemMode: "all",
    itemIds: [],
    tipoMode: "all",
    tipos: [],
    programaMode: "all",
    providerCategoryIds: [],
};
export const defaultPriceAdjustmentFilters = () => ({
    ...DEFAULT_FILTERS,
    itemIds: [],
    tipos: [],
    providerCategoryIds: [],
});
export const filterActivePriceAdjustmentRules = (rules) => (rules ?? [])
    .filter((rule) => !rule.data?.fechaEliminacion && rule.data?.activa !== false)
    .sort((a, b) => (a.data?.prioridad ?? 0) - (b.data?.prioridad ?? 0) || a.id - b.id);
const getTableId = async (headers, session) => {
    const vars = await getVariablesByName(headers, session, [TABLE_VAR]);
    return vars[TABLE_VAR];
};
export const getPriceAdjustmentRules = (headers, session) => {
    return handlePossibleAxiosErrors(async () => {
        const tableId = await getTableId(headers, session);
        const response = await getWebAppTableRegisters(session, tableId);
        if (response.error) {
            throw new Error(`Ocurrió un error al consultar las reglas de ajuste de precio: ${response.userMsg}`);
        }
        return response.data ?? [];
    });
};
export const createPriceAdjustmentRule = (headers, session, body) => {
    return handlePossibleAxiosErrors(async () => {
        const tableId = await getTableId(headers, session);
        return createWebAppTableRegister(headers, tableId, body);
    });
};
export const updatePriceAdjustmentRule = (headers, session, id, body) => {
    return handlePossibleAxiosErrors(async () => {
        const tableId = await getTableId(headers, session);
        return updateWebAppTableRegister(headers, tableId, Number(id), body);
    });
};
const matchesFilter = (mode, selected, value) => {
    const normalizedMode = mode ?? "all";
    const values = selected ?? [];
    if (normalizedMode === "all") {
        return true;
    }
    if (value === undefined || value === null || value === "") {
        return false;
    }
    const asString = String(value);
    const included = values.some((item) => String(item) === asString);
    if (normalizedMode === "include") {
        return values.length > 0 && included;
    }
    return !included;
};
export const priceAdjustmentRuleMatches = (rule, ctx) => {
    const filtros = rule.filtros ?? defaultPriceAdjustmentFilters();
    return (matchesFilter(filtros.itemMode, filtros.itemIds, ctx.itemId) &&
        matchesFilter(filtros.tipoMode, filtros.tipos, ctx.tipo) &&
        matchesFilter(filtros.programaMode, filtros.providerCategoryIds, ctx.providerCategoryId));
};
const roundMoney = (value) => Math.round((value + Number.EPSILON) * 10000) / 10000;
const formatMoney = (value) => Number.isInteger(value) ? String(value) : String(roundMoney(value));
const formatSignedAmount = (value) => {
    const abs = formatMoney(Math.abs(value));
    return value < 0 ? `- ${abs}` : `+ ${abs}`;
};
const formatRuleEffect = (step) => {
    if (step.valueType === "percentage") {
        const sign = step.operation === "subtract" ? "-" : "+";
        return `${sign} ${formatMoney(step.value)}% (${step.ruleName})`;
    }
    return `${formatSignedAmount(step.appliedAmount)} (${step.ruleName})`;
};
export const formatPriceAdjustmentDescription = (result) => {
    const base = `${formatMoney(result.basePrice)} (base)`;
    if (result.steps.length === 0) {
        return base;
    }
    return `${base} ${result.steps.map(formatRuleEffect).join(" ")} = ${formatMoney(result.finalPrice)}`;
};
export const applyPriceAdjustmentRules = (basePrice, rules, ctx) => {
    const start = Number(basePrice);
    const safeBase = Number.isFinite(start) ? start : 0;
    let runningTotal = safeBase;
    const steps = [];
    const normalized = rules
        .map((rule) => ("data" in rule ? rule.data : rule))
        .filter((rule) => Boolean(rule))
        .filter((rule) => !rule.fechaEliminacion && rule.activa !== false)
        .sort((a, b) => (a.prioridad ?? 0) - (b.prioridad ?? 0));
    for (const rule of normalized) {
        if (!priceAdjustmentRuleMatches(rule, ctx)) {
            continue;
        }
        const value = Number(rule.valor) || 0;
        const previous = runningTotal;
        if (rule.tipoValor === "percentage") {
            const delta = previous * (value / 100);
            runningTotal =
                rule.operacion === "subtract" ? previous - delta : previous + delta;
        }
        else {
            runningTotal =
                rule.operacion === "subtract" ? previous - value : previous + value;
        }
        runningTotal = roundMoney(runningTotal);
        steps.push({
            ruleName: rule.nombre,
            operation: rule.operacion,
            valueType: rule.tipoValor,
            value,
            appliedAmount: roundMoney(runningTotal - previous),
            runningTotal,
        });
    }
    const result = {
        basePrice: roundMoney(safeBase),
        finalPrice: roundMoney(runningTotal),
        description: "",
        steps,
    };
    result.description = formatPriceAdjustmentDescription(result);
    return result;
};
