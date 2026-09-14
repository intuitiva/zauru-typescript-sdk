import type {
  PriceAdjustmentFilterMode,
  PriceAdjustmentFilters,
  PurchaseOrderFinancialDetail,
  RejectionPercentageAdjustmentContext,
  RejectionPercentageAdjustmentResult,
  RejectionPercentageAdjustmentRule,
  RejectionPercentageAdjustmentStep,
  WebAppRowGraphQL,
} from "@zauru-sdk/types";
import {
  calculatePurchaseOrderFinancials,
  getRejectionPercentage,
  mergeJsonMemo,
  parseJsonMemo,
} from "./common.js";

export const REJECTION_PERCENTAGE_ADJUSTMENT_RULES_TABLE_VAR =
  "rejection_percentage_adjustment_rules_web_app_table_id";

const defaultFilters = (): PriceAdjustmentFilters => ({
  itemMode: "all",
  itemIds: [],
  tipoMode: "all",
  tipos: [],
  programaMode: "all",
  providerCategoryIds: [],
});

const normalizeComparableValue = (
  value: string | number | undefined | null,
): string => String(value ?? "").replace(/\s+/g, " ").trim();

const matchesFilter = (
  mode: PriceAdjustmentFilterMode | undefined,
  selected: Array<string | number> | undefined,
  value: string | number | undefined,
): boolean => {
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

  const included = values.some(
    (item) => normalizeComparableValue(item) === asString,
  );

  if (normalizedMode === "include") {
    return values.length > 0 && included;
  }

  return !included;
};

export const filterActiveRejectionPercentageAdjustmentRules = (
  rules?: WebAppRowGraphQL<RejectionPercentageAdjustmentRule>[],
) =>
  (rules ?? [])
    .filter(
      (rule) => !rule.data?.fechaEliminacion && rule.data?.activa !== false,
    )
    .sort(
      (a, b) =>
        (a.data?.prioridad ?? 0) - (b.data?.prioridad ?? 0) || a.id - b.id,
    );

export const rejectionPercentageAdjustmentRuleMatches = (
  rule: RejectionPercentageAdjustmentRule,
  ctx: RejectionPercentageAdjustmentContext,
): boolean => {
  const filtros = rule.filtros ?? defaultFilters();
  const itemIds = ctx.itemIds ?? [];

  const tipoAndPrograma =
    matchesFilter(filtros.tipoMode, filtros.tipos, ctx.tipo) &&
    matchesFilter(
      filtros.programaMode,
      filtros.providerCategoryIds,
      ctx.providerCategoryId,
    );

  if (!tipoAndPrograma) {
    return false;
  }

  if (filtros.itemMode === "all") {
    return true;
  }

  if (itemIds.length === 0) {
    return false;
  }

  return itemIds.some((itemId) =>
    matchesFilter(filtros.itemMode, filtros.itemIds, itemId),
  );
};

const roundPercentage = (value: number, digits = 4) => {
  const factor = 10 ** digits;
  return Math.round((value + Number.EPSILON) * factor) / factor;
};

const clampPercentage = (value: number) => Math.min(100, Math.max(0, value));

const formatPercentage = (value: number) =>
  Number.isInteger(value) ? String(value) : String(roundPercentage(value));

const formatFinalPercentage = (value: number) =>
  roundPercentage(value, 2).toFixed(2);

const formatRuleEffect = (step: RejectionPercentageAdjustmentStep) => {
  const sign = step.operation === "subtract" ? "-" : "+";
  return `${sign} ${formatPercentage(step.value)}% (${step.ruleName})`;
};

export const formatRejectionPercentageAdjustmentDescription = (
  result: Pick<
    RejectionPercentageAdjustmentResult,
    "basePercentage" | "finalPercentage" | "steps"
  >,
  baseLabel = "origen",
): string => {
  const base = `${formatPercentage(result.basePercentage)} (${baseLabel})`;
  if (result.steps.length === 0) {
    return base;
  }
  return `${base} ${result.steps.map(formatRuleEffect).join(" ")} = ${formatFinalPercentage(result.finalPercentage)}`;
};

export const resolveRejectionPercentageOrigin = (
  passedPercentage: number,
  memo?: string | object,
): number => {
  const parsed = parseJsonMemo(memo);
  const passed = clampPercentage(
    Number.isFinite(Number(passedPercentage)) ? Number(passedPercentage) : 0,
  );
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

export const resolveRejectionPercentageBase = (
  memo?: string | object,
): number =>
  resolveRejectionPercentageOrigin(getRejectionPercentage(memo), memo);

export const applyRejectionPercentageAdjustmentRules = (
  basePercentage: number,
  rules: Array<
    | RejectionPercentageAdjustmentRule
    | WebAppRowGraphQL<RejectionPercentageAdjustmentRule>
  >,
  ctx: RejectionPercentageAdjustmentContext,
): RejectionPercentageAdjustmentResult => {
  const start = Number(basePercentage);
  const safeBase = Number.isFinite(start) ? clampPercentage(start) : 0;
  let runningTotal = safeBase;
  const steps: RejectionPercentageAdjustmentStep[] = [];

  const normalized = rules
    .map((rule) => ("data" in rule ? rule.data : rule))
    .filter((rule): rule is RejectionPercentageAdjustmentRule => Boolean(rule))
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

  const result: RejectionPercentageAdjustmentResult = {
    basePercentage: roundPercentage(safeBase),
    finalPercentage: roundPercentage(runningTotal, 2),
    description: "",
    steps,
  };
  result.description = formatRejectionPercentageAdjustmentDescription(result);
  return result;
};

export const applyRejectionPercentageRulesToFinancials = (input: {
  memo?: string | object;
  originPercentage: number;
  details: PurchaseOrderFinancialDetail[];
  rules: Array<
    | RejectionPercentageAdjustmentRule
    | WebAppRowGraphQL<RejectionPercentageAdjustmentRule>
  >;
  ctx: RejectionPercentageAdjustmentContext;
}): { memo: string; discount: number; finalPercentage: number } => {
  const origin = resolveRejectionPercentageOrigin(
    input.originPercentage,
    input.memo,
  );
  const result = applyRejectionPercentageAdjustmentRules(
    origin,
    input.rules,
    input.ctx,
  );
  const { discount } = calculatePurchaseOrderFinancials({
    details: input.details,
    rejectionPercentage: result.finalPercentage,
  });

  return {
    memo: mergeJsonMemo(input.memo, {
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
