"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.applyRejectionPercentageRulesToFinancials = exports.applyRejectionPercentageAdjustmentRules = exports.resolveRejectionPercentageBase = exports.resolveRejectionPercentageOrigin = exports.formatRejectionPercentageAdjustmentDescription = exports.rejectionPercentageAdjustmentRuleMatches = exports.filterActiveRejectionPercentageAdjustmentRules = exports.REJECTION_PERCENTAGE_ADJUSTMENT_RULES_TABLE_VAR = void 0;
const common_js_1 = require("./common.js");
exports.REJECTION_PERCENTAGE_ADJUSTMENT_RULES_TABLE_VAR = "rejection_percentage_adjustment_rules_web_app_table_id";
const defaultFilters = () => ({
    itemMode: "all",
    itemIds: [],
    tipoMode: "all",
    tipos: [],
    programaMode: "all",
    providerCategoryIds: [],
});
const normalizeComparableValue = (value) => String(value ?? "").replace(/\s+/g, " ").trim();
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
const filterActiveRejectionPercentageAdjustmentRules = (rules) => (rules ?? [])
    .filter((rule) => !rule.data?.fechaEliminacion && rule.data?.activa !== false)
    .sort((a, b) => (a.data?.prioridad ?? 0) - (b.data?.prioridad ?? 0) || a.id - b.id);
exports.filterActiveRejectionPercentageAdjustmentRules = filterActiveRejectionPercentageAdjustmentRules;
const rejectionPercentageAdjustmentRuleMatches = (rule, ctx) => {
    const filtros = rule.filtros ?? defaultFilters();
    const itemIds = ctx.itemIds ?? [];
    const tipoAndPrograma = matchesFilter(filtros.tipoMode, filtros.tipos, ctx.tipo) &&
        matchesFilter(filtros.programaMode, filtros.providerCategoryIds, ctx.providerCategoryId);
    if (!tipoAndPrograma) {
        return false;
    }
    if (filtros.itemMode === "all") {
        return true;
    }
    if (itemIds.length === 0) {
        return false;
    }
    return itemIds.some((itemId) => matchesFilter(filtros.itemMode, filtros.itemIds, itemId));
};
exports.rejectionPercentageAdjustmentRuleMatches = rejectionPercentageAdjustmentRuleMatches;
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
const formatRejectionPercentageAdjustmentDescription = (result, baseLabel = "origen") => {
    const base = `${formatPercentage(result.basePercentage)} (${baseLabel})`;
    if (result.steps.length === 0) {
        return base;
    }
    return `${base} ${result.steps.map(formatRuleEffect).join(" ")} = ${formatFinalPercentage(result.finalPercentage)}`;
};
exports.formatRejectionPercentageAdjustmentDescription = formatRejectionPercentageAdjustmentDescription;
const resolveRejectionPercentageOrigin = (passedPercentage, memo) => {
    const parsed = (0, common_js_1.parseJsonMemo)(memo);
    const passed = clampPercentage(Number.isFinite(Number(passedPercentage)) ? Number(passedPercentage) : 0);
    const calc = parsed.rejectionCalculations;
    if (!calc || !Number.isFinite(Number(calc.finalPercentage))) {
        return passed;
    }
    const previousFinal = roundPercentage(Number(calc.finalPercentage), 2);
    const previousBase = Number(calc.basePercentage);
    const safePreviousBase = Number.isFinite(previousBase)
        ? clampPercentage(previousBase)
        : passed;
    if (roundPercentage(passed, 2) === previousFinal) {
        return safePreviousBase;
    }
    return clampPercentage(safePreviousBase + (passed - previousFinal));
};
exports.resolveRejectionPercentageOrigin = resolveRejectionPercentageOrigin;
const resolveRejectionPercentageBase = (memo) => (0, exports.resolveRejectionPercentageOrigin)((0, common_js_1.getRejectionPercentage)(memo), memo);
exports.resolveRejectionPercentageBase = resolveRejectionPercentageBase;
const applyRejectionPercentageAdjustmentRules = (basePercentage, rules, ctx) => {
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
        if (!(0, exports.rejectionPercentageAdjustmentRuleMatches)(rule, ctx)) {
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
    result.description = (0, exports.formatRejectionPercentageAdjustmentDescription)(result);
    return result;
};
exports.applyRejectionPercentageAdjustmentRules = applyRejectionPercentageAdjustmentRules;
const applyRejectionPercentageRulesToFinancials = (input) => {
    const origin = (0, exports.resolveRejectionPercentageOrigin)(input.originPercentage, input.memo);
    const result = (0, exports.applyRejectionPercentageAdjustmentRules)(origin, input.rules, input.ctx);
    const { discount } = (0, common_js_1.calculatePurchaseOrderFinancials)({
        details: input.details,
        rejectionPercentage: result.finalPercentage,
    });
    return {
        memo: (0, common_js_1.mergeJsonMemo)(input.memo, {
            rejectionPercentage: result.finalPercentage,
            rejectionCalculations: {
                basePercentage: result.basePercentage,
                finalPercentage: result.finalPercentage,
                description: result.description,
                steps: result.steps,
            },
        }),
        discount,
        finalPercentage: result.finalPercentage,
    };
};
exports.applyRejectionPercentageRulesToFinancials = applyRejectionPercentageRulesToFinancials;
