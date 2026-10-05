import { handlePossibleAxiosErrors } from "@zauru-sdk/common";
import { createWebAppTableRegister, getVariablesByName, getWebAppTableRegisters, updateWebAppTableRegister, } from "@zauru-sdk/services";
const TABLE_VAR = "price_adjustment_rules_web_app_table_id";
export const PRICE_ADJUSTMENT_REVERSAL_RULES_TABLE_VAR = "price_adjustment_reversal_rules_web_app_table_id";
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
const getReversalTableId = async (headers, session) => {
    const vars = await getVariablesByName(headers, session, [
        PRICE_ADJUSTMENT_REVERSAL_RULES_TABLE_VAR,
    ]);
    return vars[PRICE_ADJUSTMENT_REVERSAL_RULES_TABLE_VAR];
};
export const filterActivePriceAdjustmentReversalRules = (rules) => (rules ?? []).filter((rule) => !rule.data?.fechaEliminacion && rule.data?.activa !== false);
export const getPriceAdjustmentReversalRules = (headers, session) => handlePossibleAxiosErrors(async () => {
    const tableId = await getReversalTableId(headers, session);
    const response = await getWebAppTableRegisters(session, tableId);
    if (response.error) {
        throw new Error(`Ocurrió un error al consultar las reglas de reversión de precio: ${response.userMsg}`);
    }
    return response.data ?? [];
});
export const createPriceAdjustmentReversalRule = (headers, session, body) => handlePossibleAxiosErrors(async () => {
    const tableId = await getReversalTableId(headers, session);
    return createWebAppTableRegister(headers, tableId, body);
});
export const updatePriceAdjustmentReversalRule = (headers, session, id, body) => handlePossibleAxiosErrors(async () => {
    const tableId = await getReversalTableId(headers, session);
    return updateWebAppTableRegister(headers, tableId, Number(id), body);
});
export const normalizeComparableValue = (value) => String(value ?? "").replace(/\s+/g, " ").trim();
export const formatReceptionTypeValue = (type) => [type?.Nombre, type?.Codigo]
    .map((part) => String(part ?? "").trim())
    .filter(Boolean)
    .join(" ");
const matchesFilter = (mode, selected, value) => {
    const normalizedMode = mode ?? "all";
    const values = selected ?? [];
    if (normalizedMode === "all") {
        return true;
    }
    if (value === undefined || value === null) {
        return false;
    }
    const asString = normalizeComparableValue(value);
    if (!asString) {
        return false;
    }
    const included = values.some((item) => normalizeComparableValue(item) === asString);
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
const roundMoney = (value, digits = 4) => {
    const factor = 10 ** digits;
    return Math.round((value + Number.EPSILON) * factor) / factor;
};
const formatMoney = (value) => Number.isInteger(value) ? String(value) : String(roundMoney(value));
const formatFinalPrice = (value) => roundMoney(value, 2).toFixed(2);
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
export const formatPriceAdjustmentDescription = (result, baseLabel = "base") => {
    const base = `${formatMoney(result.basePrice)} (${baseLabel})`;
    if (result.steps.length === 0) {
        return base;
    }
    return `${base} ${result.steps.map(formatRuleEffect).join(" ")} = ${formatFinalPrice(result.finalPrice)}`;
};
export const applyPriceAdjustmentRules = (basePrice, rules, ctx) => {
    const start = Number(basePrice);
    const safeBase = Number.isFinite(start) ? start : 0;
    let runningTotal = safeBase;
    const steps = [];
    const normalized = rules
        .map((rule) => ({
        rule: "data" in rule ? rule.data : rule,
        ruleId: "data" in rule ? rule.id : undefined,
    }))
        .filter((entry) => Boolean(entry.rule));
    const activeRules = normalized
        .filter(({ rule }) => !rule.fechaEliminacion && rule.activa !== false)
        .sort((a, b) => (a.rule.prioridad ?? 0) - (b.rule.prioridad ?? 0));
    for (const { rule, ruleId } of activeRules) {
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
            ...(ruleId !== undefined ? { ruleId } : {}),
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
        finalPrice: roundMoney(runningTotal, 2),
        description: "",
        steps,
    };
    result.description = formatPriceAdjustmentDescription(result);
    return result;
};
const sameMoney = (left, right) => Math.abs(roundMoney(left, 2) - roundMoney(right, 2)) < 0.000001;
export const buildPriceAdjustmentReversalPlan = ({ calculation, currentPrice, reversalRules, history, }) => {
    const base = {
        calculationId: calculation.calculationId,
        detailId: calculation.detailId,
        itemId: calculation.itemId,
        previousPrice: roundMoney(currentPrice, 2),
        finalPrice: roundMoney(currentPrice, 2),
        penaltyAmount: 0,
        matches: [],
    };
    if (!calculation.calculationId || calculation.detailId == null) {
        return {
            ...base,
            status: "ineligible",
            reason: "El cálculo no contiene calculationId y detailId.",
        };
    }
    const activeRules = filterActivePriceAdjustmentReversalRules(reversalRules);
    const reversalBySource = new Map(activeRules.map((entry) => [entry.data.sourceRuleId, entry]));
    const applicable = calculation.steps.flatMap((step) => {
        if (step.ruleId == null ||
            step.operation !== "add" ||
            step.appliedAmount <= 0) {
            return [];
        }
        const reversal = reversalBySource.get(step.ruleId);
        if (!reversal)
            return [];
        return [
            {
                sourceRuleId: step.ruleId,
                sourceRuleName: step.ruleName,
                reversalRuleId: reversal.id,
                reversalRuleName: reversal.data.nombre,
                appliedAmount: roundMoney(step.appliedAmount),
            },
        ];
    });
    if (applicable.length === 0) {
        return {
            ...base,
            status: "ineligible",
            reason: "Ningún paso del cálculo tiene una regla de reversión activa.",
        };
    }
    const calculationHistory = (history ?? []).filter((entry) => entry.calculationId === calculation.calculationId &&
        entry.detailId === calculation.detailId);
    const alreadyAppliedSourceIds = new Set(calculationHistory.map((entry) => entry.sourceRuleId));
    const pending = applicable.filter((match) => !alreadyAppliedSourceIds.has(match.sourceRuleId));
    if (pending.length === 0) {
        return {
            ...base,
            status: "already_applied",
            reason: "Todas las reglas vinculadas ya fueron penalizadas.",
        };
    }
    const expectedCurrentPrice = roundMoney(Number(calculation.finalPrice) +
        calculationHistory.reduce((sum, entry) => sum + entry.amount, 0), 2);
    if (!sameMoney(currentPrice, expectedCurrentPrice)) {
        return {
            ...base,
            status: "price_changed",
            reason: `El precio actual ${roundMoney(currentPrice, 2)} no coincide con el precio esperado ${expectedCurrentPrice}.`,
        };
    }
    const penaltyAmount = roundMoney(-pending.reduce((sum, match) => sum + match.appliedAmount, 0));
    return {
        ...base,
        status: "eligible",
        finalPrice: roundMoney(currentPrice + penaltyAmount, 2),
        penaltyAmount,
        matches: pending,
    };
};
