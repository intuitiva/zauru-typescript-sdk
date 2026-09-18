import type {
  PriceAdjustmentFilterMode,
  PriceAdjustmentFilters,
  RejectionCalculationMemo,
  RejectionPercentageAdjustmentContext,
  RejectionPercentageAdjustmentResult,
  RejectionPercentageAdjustmentRule,
  RejectionPercentageAdjustmentStep,
  RejectionPercentageApplication,
  RejectionPercentageLayers,
  WebAppRowGraphQL,
} from "@zauru-sdk/types";

export const REJECTION_PERCENTAGE_ADJUSTMENT_RULES_TABLE_VAR =
  "rejection_percentage_adjustment_rules_web_app_table_id";

export const REJECTION_PERCENTAGE_RULE_HISTORY_TYPE =
  "rechazo_regla_automatica" as const;

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

const toLayerNumber = (value: unknown): number => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

export const normalizeRejectionPercentageLayers = (
  layers?: Partial<RejectionPercentageLayers> | null,
): RejectionPercentageLayers => ({
  additive: clampPercentage(roundPercentage(toLayerNumber(layers?.additive))),
  successive: Array.isArray(layers?.successive)
    ? layers.successive.map((value) => toLayerNumber(value))
    : [],
});

export const applyRejectionPercentageLayers = (
  layers: RejectionPercentageLayers,
  application: RejectionPercentageApplication,
): RejectionPercentageLayers => {
  const current = normalizeRejectionPercentageLayers(layers);
  const value = toLayerNumber(application.value);

  switch (application.mode) {
    case "add":
      return {
        additive: clampPercentage(roundPercentage(current.additive + value)),
        successive: [...current.successive],
      };
    case "replace":
      return {
        additive: clampPercentage(roundPercentage(value)),
        successive: [],
      };
    case "successive":
      return {
        additive: current.additive,
        successive: [...current.successive, value],
      };
    default: {
      const _exhaustive: never = application.mode;
      return _exhaustive;
    }
  }
};

/**
 * Effective rejection % after additive then each successive rate on the remainder.
 * 10% then 10% successive → 19, not 20.
 */
export const computeEffectiveRejectionPercentage = (
  layers: RejectionPercentageLayers,
  digits = 2,
): number => {
  const normalized = normalizeRejectionPercentageLayers(layers);
  let remainingFactor = 1 - normalized.additive / 100;
  for (const rate of normalized.successive) {
    remainingFactor *= 1 - rate / 100;
  }
  return roundPercentage((1 - remainingFactor) * 100, digits);
};

export const hasSuccessiveRejectionLayers = (
  layers?: Partial<RejectionPercentageLayers> | null,
): boolean =>
  Array.isArray(layers?.successive) && layers.successive.length > 0;

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

/**
 * Callers may pass the origin % or the previously stored final %. With the
 * previous calculations we go back to the origin so the rules never stack twice.
 */
export const resolveRejectionPercentageOrigin = (
  passedPercentage: number,
  previousCalculations?: RejectionCalculationMemo | null,
): number => {
  const passed = clampPercentage(
    Number.isFinite(Number(passedPercentage)) ? Number(passedPercentage) : 0,
  );
  const calc = previousCalculations;
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

export const rejectionRuleStepKey = (
  step: Pick<
    RejectionPercentageAdjustmentStep,
    "ruleName" | "operation" | "value"
  >,
): string => `${step.ruleName}|${step.operation}|${step.value}`;

/**
 * Rules already stored in the memo are skipped so a later edit does not
 * create a second history line (or a second +2%) for the same rule.
 */
export const getNewlyAppliedRejectionRuleSteps = (
  previous?: RejectionCalculationMemo | null,
  next?: RejectionCalculationMemo | null,
): RejectionPercentageAdjustmentStep[] => {
  if (!next?.steps?.length) {
    return [];
  }
  const previousKeys = new Set(
    (previous?.steps ?? []).map(rejectionRuleStepKey),
  );
  return next.steps.filter(
    (step) => !previousKeys.has(rejectionRuleStepKey(step)),
  );
};

export const formatAutomaticRejectionRuleHistoryDescription = (
  step: RejectionPercentageAdjustmentStep,
): string => {
  const sign = step.operation === "subtract" ? "-" : "+";
  return `% Rechazo aplicado automáticamente por regla "${step.ruleName}": ${sign}${formatPercentage(step.value)}%.`;
};

export const isAutomaticRejectionRuleHistoryType = (
  type: string | undefined,
): boolean => type === REJECTION_PERCENTAGE_RULE_HISTORY_TYPE;

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
