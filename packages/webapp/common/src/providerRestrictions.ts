import type {
  ProviderRestrictionCheckResult,
  ProviderRestrictionMode,
  ProviderRestrictionRule,
  ReceptionType,
} from "@zauru-sdk/types";

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export const PROVIDER_TYPE_RESTRICTIONS_TABLE_VAR =
  "ctl_calidad_admin_restricciones_tipos_proveedor_web_app_table_id";

export const PROVIDER_ITEM_RESTRICTIONS_TABLE_VAR =
  "ctl_calidad_admin_restricciones_verduras_proveedor_web_app_table_id";

export const normalizeRestrictionValue = (
  value: string | number | undefined | null,
): string => String(value ?? "").replace(/\s+/g, " ").trim();

export const formatRestrictionTypeValue = (
  type?: { Nombre?: string; Codigo?: string } | null,
): string =>
  [type?.Nombre, type?.Codigo]
    .map((part) => String(part ?? "").trim())
    .filter(Boolean)
    .join(" ");

const assertNever = (value: never): never => {
  throw new Error(`Unexpected restriction mode: ${String(value)}`);
};

export const isProviderRestrictionMode = (
  value: unknown,
): value is ProviderRestrictionMode =>
  value === "include" || value === "exclude";

export const normalizeProviderRestrictionValues = (
  values: unknown,
): string[] => {
  if (Array.isArray(values)) {
    return values.map(normalizeRestrictionValue).filter(Boolean);
  }
  if (typeof values === "string") {
    const trimmed = values.trim();
    if (!trimmed) {
      return [];
    }
    try {
      const parsed = JSON.parse(trimmed);
      if (Array.isArray(parsed)) {
        return parsed.map(normalizeRestrictionValue).filter(Boolean);
      }
    } catch {
      return trimmed
        .split(",")
        .map((part) => normalizeRestrictionValue(part))
        .filter(Boolean);
    }
  }
  return [];
};

export const restrictionHasDateRange = (
  rule: Pick<ProviderRestrictionRule, "start_date" | "end_date">,
): boolean =>
  Boolean(normalizeRestrictionValue(rule.start_date)) ||
  Boolean(normalizeRestrictionValue(rule.end_date));

export const isRestrictionActiveOnDate = (
  rule: ProviderRestrictionRule,
  date: string,
): boolean => {
  if (normalizeRestrictionValue(rule.fechaEliminacion)) {
    return false;
  }
  if (!isProviderRestrictionMode(rule.mode)) {
    return false;
  }
  const start = normalizeRestrictionValue(rule.start_date);
  const end = normalizeRestrictionValue(rule.end_date);
  if (!start && !end) {
    return true;
  }
  if (!DATE_RE.test(date)) {
    return false;
  }
  if (start && date < start) {
    return false;
  }
  if (end && date > end) {
    return false;
  }
  return true;
};

export const filterActiveProviderRestrictions = (
  rules: ProviderRestrictionRule[] | undefined,
  payeeId: number,
  date: string,
): ProviderRestrictionRule[] =>
  (rules ?? []).filter(
    (rule) =>
      Number(rule.payee_id) === Number(payeeId) &&
      isRestrictionActiveOnDate(rule, date),
  );

export const resolveAllowedRestrictionValues = (input: {
  payeeId: number;
  date: string;
  rules: ProviderRestrictionRule[] | undefined;
  universe: Array<string | number>;
}): string[] => {
  const universe = input.universe
    .map(normalizeRestrictionValue)
    .filter(Boolean);
  const active = filterActiveProviderRestrictions(
    input.rules,
    input.payeeId,
    input.date,
  );

  if (active.length === 0) {
    return universe;
  }

  const includes = active.filter((rule) => rule.mode === "include");
  const excludes = active.filter((rule) => rule.mode === "exclude");

  let allowed = universe;
  if (includes.length > 0) {
    const union = new Set(
      includes.flatMap((rule) => normalizeProviderRestrictionValues(rule.values)),
    );
    allowed = allowed.filter((value) => union.has(value));
  }

  if (excludes.length > 0) {
    const blocked = new Set(
      excludes.flatMap((rule) => normalizeProviderRestrictionValues(rule.values)),
    );
    allowed = allowed.filter((value) => !blocked.has(value));
  }

  return allowed;
};

export const isRestrictionValueAllowed = (input: {
  payeeId: number;
  date: string;
  value: string | number;
  rules: ProviderRestrictionRule[] | undefined;
  universe: Array<string | number>;
}): boolean => {
  const allowed = resolveAllowedRestrictionValues(input);
  return allowed.includes(normalizeRestrictionValue(input.value));
};

export const matchReceptionTypeCode = (
  formValue: string,
  types: Array<ReceptionType | { data?: ReceptionType }> | undefined,
): string => {
  const wanted = normalizeRestrictionValue(formValue);
  if (!wanted) {
    return "";
  }

  for (const entry of types ?? []) {
    const type =
      entry && typeof entry === "object" && "data" in entry
        ? entry.data
        : (entry as ReceptionType);
    if (!type) {
      continue;
    }
    const code = normalizeRestrictionValue(type.Codigo);
    const formatted = formatRestrictionTypeValue(type);
    if (wanted === code || wanted === formatted) {
      return code || formatted;
    }
  }

  return wanted;
};

export type ProviderRestrictionInput = {
  payee_id: number;
  mode: ProviderRestrictionMode | string;
  values: unknown;
  start_date?: string;
  end_date?: string;
  motivo?: string;
};

export type ProviderRestrictionInputError = {
  field: string;
  message: string;
};

export type ValidateProviderRestrictionOptions = {
  universe?: Array<string | number>;
  otherRules?: ProviderRestrictionRule[];
  valueNoun?: string;
};

const shiftYmd = (ymd: string, days: number): string => {
  const [year, month, day] = ymd.split("-").map(Number);
  const utc = new Date(Date.UTC(year, month - 1, day + days));
  const nextYear = utc.getUTCFullYear();
  const nextMonth = String(utc.getUTCMonth() + 1).padStart(2, "0");
  const nextDay = String(utc.getUTCDate()).padStart(2, "0");
  return `${nextYear}-${nextMonth}-${nextDay}`;
};

export const sampleDatesForRestrictionRules = (
  rules: Array<Pick<ProviderRestrictionRule, "start_date" | "end_date">>,
): string[] => {
  const dates = new Set<string>(["1970-01-01", "2999-12-31"]);
  for (const rule of rules) {
    const start = normalizeRestrictionValue(rule.start_date);
    const end = normalizeRestrictionValue(rule.end_date);
    if (DATE_RE.test(start)) {
      dates.add(start);
      dates.add(shiftYmd(start, -1));
    }
    if (DATE_RE.test(end)) {
      dates.add(end);
      dates.add(shiftYmd(end, 1));
    }
  }
  return [...dates].sort();
};

export const restrictionLeavesNoAllowedValues = (input: {
  payeeId: number;
  rules: ProviderRestrictionRule[] | undefined;
  universe: Array<string | number>;
}): boolean => {
  const universe = input.universe
    .map(normalizeRestrictionValue)
    .filter(Boolean);
  if (universe.length === 0) {
    return false;
  }
  return sampleDatesForRestrictionRules(input.rules ?? []).some(
    (date) =>
      resolveAllowedRestrictionValues({
        payeeId: input.payeeId,
        date,
        rules: input.rules,
        universe,
      }).length === 0,
  );
};

export const validateProviderRestrictionInput = (
  input: ProviderRestrictionInput,
  options?: ValidateProviderRestrictionOptions,
): ProviderRestrictionInputError[] => {
  const errors: ProviderRestrictionInputError[] = [];
  if (!Number(input.payee_id) || Number(input.payee_id) < 1) {
    errors.push({ field: "payee_id", message: "Seleccione un proveedor." });
  }
  if (!isProviderRestrictionMode(input.mode)) {
    errors.push({
      field: "mode",
      message: "Seleccione si se permiten o se bloquean esos valores.",
    });
  }
  if (normalizeProviderRestrictionValues(input.values).length === 0) {
    errors.push({
      field: "values",
      message: "Seleccione al menos un valor.",
    });
  }

  const start = normalizeRestrictionValue(input.start_date);
  const end = normalizeRestrictionValue(input.end_date);
  if (start || end) {
    if (!start || !end) {
      errors.push({
        field: "start_date",
        message: "Si usa fechas, indique inicio y fin.",
      });
    } else {
      if (!DATE_RE.test(start) || !DATE_RE.test(end)) {
        errors.push({
          field: "start_date",
          message: "Las fechas deben ir en formato YYYY-MM-DD.",
        });
      } else if (start > end) {
        errors.push({
          field: "end_date",
          message: "La fecha fin no puede ser anterior a la fecha inicio.",
        });
      }
    }
    if (!normalizeRestrictionValue(input.motivo)) {
      errors.push({
        field: "motivo",
        message: "Indique el motivo de la excepción con rango de fechas.",
      });
    }
  }

  const universe = (options?.universe ?? [])
    .map(normalizeRestrictionValue)
    .filter(Boolean);
  if (
    universe.length > 0 &&
    Number(input.payee_id) > 0 &&
    isProviderRestrictionMode(input.mode) &&
    normalizeProviderRestrictionValues(input.values).length > 0
  ) {
    const proposed: ProviderRestrictionRule = {
      payee_id: Number(input.payee_id),
      mode: input.mode,
      values: normalizeProviderRestrictionValues(input.values),
      start_date: start,
      end_date: end,
      motivo: normalizeRestrictionValue(input.motivo),
    };
    const otherRules = (options?.otherRules ?? []).filter(
      (rule) =>
        Number(rule.payee_id) === Number(input.payee_id) &&
        !normalizeRestrictionValue(rule.fechaEliminacion),
    );
    if (
      restrictionLeavesNoAllowedValues({
        payeeId: Number(input.payee_id),
        rules: [...otherRules, proposed],
        universe,
      })
    ) {
      const noun =
        normalizeRestrictionValue(options?.valueNoun) || "opciones";
      errors.push({
        field: "values",
        message: `Esta regla dejaría al proveedor sin ${noun} para escoger. Debe quedar al menos uno.`,
      });
    }
  }

  return errors;
};

const describeMode = (mode: ProviderRestrictionMode): string => {
  switch (mode) {
    case "include":
      return "solo puede usar";
    case "exclude":
      return "no puede usar";
    default:
      return assertNever(mode);
  }
};

export const checkProviderRestrictionValue = (input: {
  payeeId: number;
  date: string;
  value: string | number;
  rules: ProviderRestrictionRule[] | undefined;
  universe: Array<string | number>;
  label: string;
  valueLabel?: string;
}): ProviderRestrictionCheckResult => {
  const allowed = isRestrictionValueAllowed(input);
  if (allowed) {
    return { allowed: true };
  }

  const active = filterActiveProviderRestrictions(
    input.rules,
    input.payeeId,
    input.date,
  );
  const includes = active.filter((rule) => rule.mode === "include");
  const mode: ProviderRestrictionMode =
    includes.length > 0 ? "include" : "exclude";
  const valueLabel =
    normalizeRestrictionValue(input.valueLabel) ||
    normalizeRestrictionValue(input.value);

  return {
    allowed: false,
    mode,
    matchedValues: [valueLabel],
    title: `${input.label} no permitido para este proveedor`,
    description: `En la fecha ${input.date} este proveedor ${describeMode(mode)} ${input.label.toLowerCase()} "${valueLabel}".`,
  };
};
