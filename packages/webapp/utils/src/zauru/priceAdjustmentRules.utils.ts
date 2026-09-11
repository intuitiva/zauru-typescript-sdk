import type { Session } from "@remix-run/node";
import { handlePossibleAxiosErrors } from "@zauru-sdk/common";
import {
  createWebAppTableRegister,
  getVariablesByName,
  getWebAppTableRegisters,
  updateWebAppTableRegister,
} from "@zauru-sdk/services";
import {
  AxiosUtilsResponse,
  PriceAdjustmentContext,
  PriceAdjustmentFilterMode,
  PriceAdjustmentFilters,
  PriceAdjustmentResult,
  PriceAdjustmentRule,
  PriceAdjustmentStep,
  WebAppRowGraphQL,
  WebAppTableUpdateResponse,
} from "@zauru-sdk/types";

const TABLE_VAR = "price_adjustment_rules_web_app_table_id";

const DEFAULT_FILTERS: PriceAdjustmentFilters = {
  itemMode: "all",
  itemIds: [],
  tipoMode: "all",
  tipos: [],
  programaMode: "all",
  providerCategoryIds: [],
};

export const defaultPriceAdjustmentFilters = (): PriceAdjustmentFilters => ({
  ...DEFAULT_FILTERS,
  itemIds: [],
  tipos: [],
  providerCategoryIds: [],
});

export const filterActivePriceAdjustmentRules = (
  rules?: WebAppRowGraphQL<PriceAdjustmentRule>[],
) =>
  (rules ?? [])
    .filter((rule) => !rule.data?.fechaEliminacion && rule.data?.activa !== false)
    .sort(
      (a, b) =>
        (a.data?.prioridad ?? 0) - (b.data?.prioridad ?? 0) || a.id - b.id,
    );

const getTableId = async (headers: any, session: Session) => {
  const vars = await getVariablesByName(headers, session, [TABLE_VAR]);
  return vars[TABLE_VAR];
};

export const getPriceAdjustmentRules = (
  headers: any,
  session: Session,
): Promise<
  AxiosUtilsResponse<WebAppRowGraphQL<PriceAdjustmentRule>[]>
> => {
  return handlePossibleAxiosErrors(async () => {
    const tableId = await getTableId(headers, session);
    const response = await getWebAppTableRegisters<PriceAdjustmentRule>(
      session,
      tableId,
    );

    if (response.error) {
      throw new Error(
        `Ocurrió un error al consultar las reglas de ajuste de precio: ${response.userMsg}`,
      );
    }

    return response.data ?? [];
  });
};

export const createPriceAdjustmentRule = (
  headers: any,
  session: Session,
  body: PriceAdjustmentRule,
): Promise<AxiosUtilsResponse<WebAppTableUpdateResponse>> => {
  return handlePossibleAxiosErrors(async () => {
    const tableId = await getTableId(headers, session);
    return createWebAppTableRegister<PriceAdjustmentRule>(
      headers,
      tableId,
      body,
    );
  });
};

export const updatePriceAdjustmentRule = (
  headers: any,
  session: Session,
  id: string,
  body: Partial<PriceAdjustmentRule>,
): Promise<AxiosUtilsResponse<WebAppTableUpdateResponse>> => {
  return handlePossibleAxiosErrors(async () => {
    const tableId = await getTableId(headers, session);
    return updateWebAppTableRegister(headers, tableId, Number(id), body);
  });
};

export const normalizeComparableValue = (
  value: string | number | undefined | null,
): string => String(value ?? "").replace(/\s+/g, " ").trim();

export const formatReceptionTypeValue = (
  type?: { Nombre?: string; Codigo?: string } | null,
): string =>
  [type?.Nombre, type?.Codigo]
    .map((part) => String(part ?? "").trim())
    .filter(Boolean)
    .join(" ");

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

export const priceAdjustmentRuleMatches = (
  rule: PriceAdjustmentRule,
  ctx: PriceAdjustmentContext,
): boolean => {
  const filtros = rule.filtros ?? defaultPriceAdjustmentFilters();

  return (
    matchesFilter(filtros.itemMode, filtros.itemIds, ctx.itemId) &&
    matchesFilter(filtros.tipoMode, filtros.tipos, ctx.tipo) &&
    matchesFilter(
      filtros.programaMode,
      filtros.providerCategoryIds,
      ctx.providerCategoryId,
    )
  );
};

const roundMoney = (value: number, digits = 4) => {
  const factor = 10 ** digits;
  return Math.round((value + Number.EPSILON) * factor) / factor;
};

const formatMoney = (value: number) =>
  Number.isInteger(value) ? String(value) : String(roundMoney(value));

const formatFinalPrice = (value: number) => roundMoney(value, 2).toFixed(2);

const formatSignedAmount = (value: number) => {
  const abs = formatMoney(Math.abs(value));
  return value < 0 ? `- ${abs}` : `+ ${abs}`;
};

const formatRuleEffect = (step: PriceAdjustmentStep) => {
  if (step.valueType === "percentage") {
    const sign = step.operation === "subtract" ? "-" : "+";
    return `${sign} ${formatMoney(step.value)}% (${step.ruleName})`;
  }
  return `${formatSignedAmount(step.appliedAmount)} (${step.ruleName})`;
};

export const formatPriceAdjustmentDescription = (
  result: Pick<PriceAdjustmentResult, "basePrice" | "finalPrice" | "steps">,
  baseLabel = "base",
): string => {
  const base = `${formatMoney(result.basePrice)} (${baseLabel})`;
  if (result.steps.length === 0) {
    return base;
  }
  return `${base} ${result.steps.map(formatRuleEffect).join(" ")} = ${formatFinalPrice(result.finalPrice)}`;
};

export const applyPriceAdjustmentRules = (
  basePrice: number,
  rules: Array<PriceAdjustmentRule | WebAppRowGraphQL<PriceAdjustmentRule>>,
  ctx: PriceAdjustmentContext,
): PriceAdjustmentResult => {
  const start = Number(basePrice);
  const safeBase = Number.isFinite(start) ? start : 0;
  let runningTotal = safeBase;
  const steps: PriceAdjustmentStep[] = [];

  const normalized = rules
    .map((rule) => ("data" in rule ? rule.data : rule))
    .filter((rule): rule is PriceAdjustmentRule => Boolean(rule))
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
    } else {
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

  const result: PriceAdjustmentResult = {
    basePrice: roundMoney(safeBase),
    finalPrice: roundMoney(runningTotal, 2),
    description: "",
    steps,
  };
  result.description = formatPriceAdjustmentDescription(result);
  return result;
};
