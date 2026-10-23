"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkProviderRestrictionValue = exports.validateProviderRestrictionInput = exports.matchReceptionTypeCode = exports.isRestrictionValueAllowed = exports.resolveAllowedRestrictionValues = exports.filterActiveProviderRestrictions = exports.isRestrictionActiveOnDate = exports.restrictionHasDateRange = exports.normalizeProviderRestrictionValues = exports.isProviderRestrictionMode = exports.formatRestrictionTypeValue = exports.normalizeRestrictionValue = exports.PROVIDER_ITEM_RESTRICTIONS_TABLE_VAR = exports.PROVIDER_TYPE_RESTRICTIONS_TABLE_VAR = void 0;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
exports.PROVIDER_TYPE_RESTRICTIONS_TABLE_VAR = "ctl_calidad_admin_restricciones_tipos_proveedor_web_app_table_id";
exports.PROVIDER_ITEM_RESTRICTIONS_TABLE_VAR = "ctl_calidad_admin_restricciones_verduras_proveedor_web_app_table_id";
const normalizeRestrictionValue = (value) => String(value ?? "").replace(/\s+/g, " ").trim();
exports.normalizeRestrictionValue = normalizeRestrictionValue;
const formatRestrictionTypeValue = (type) => [type?.Nombre, type?.Codigo]
    .map((part) => String(part ?? "").trim())
    .filter(Boolean)
    .join(" ");
exports.formatRestrictionTypeValue = formatRestrictionTypeValue;
const assertNever = (value) => {
    throw new Error(`Unexpected restriction mode: ${String(value)}`);
};
const isProviderRestrictionMode = (value) => value === "include" || value === "exclude";
exports.isProviderRestrictionMode = isProviderRestrictionMode;
const normalizeProviderRestrictionValues = (values) => {
    if (Array.isArray(values)) {
        return values.map(exports.normalizeRestrictionValue).filter(Boolean);
    }
    if (typeof values === "string") {
        const trimmed = values.trim();
        if (!trimmed) {
            return [];
        }
        try {
            const parsed = JSON.parse(trimmed);
            if (Array.isArray(parsed)) {
                return parsed.map(exports.normalizeRestrictionValue).filter(Boolean);
            }
        }
        catch {
            return trimmed
                .split(",")
                .map((part) => (0, exports.normalizeRestrictionValue)(part))
                .filter(Boolean);
        }
    }
    return [];
};
exports.normalizeProviderRestrictionValues = normalizeProviderRestrictionValues;
const restrictionHasDateRange = (rule) => Boolean((0, exports.normalizeRestrictionValue)(rule.start_date)) ||
    Boolean((0, exports.normalizeRestrictionValue)(rule.end_date));
exports.restrictionHasDateRange = restrictionHasDateRange;
const isRestrictionActiveOnDate = (rule, date) => {
    if ((0, exports.normalizeRestrictionValue)(rule.fechaEliminacion)) {
        return false;
    }
    if (!(0, exports.isProviderRestrictionMode)(rule.mode)) {
        return false;
    }
    const start = (0, exports.normalizeRestrictionValue)(rule.start_date);
    const end = (0, exports.normalizeRestrictionValue)(rule.end_date);
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
exports.isRestrictionActiveOnDate = isRestrictionActiveOnDate;
const filterActiveProviderRestrictions = (rules, payeeId, date) => (rules ?? []).filter((rule) => Number(rule.payee_id) === Number(payeeId) &&
    (0, exports.isRestrictionActiveOnDate)(rule, date));
exports.filterActiveProviderRestrictions = filterActiveProviderRestrictions;
const resolveAllowedRestrictionValues = (input) => {
    const universe = input.universe
        .map(exports.normalizeRestrictionValue)
        .filter(Boolean);
    const active = (0, exports.filterActiveProviderRestrictions)(input.rules, input.payeeId, input.date);
    if (active.length === 0) {
        return universe;
    }
    const includes = active.filter((rule) => rule.mode === "include");
    const excludes = active.filter((rule) => rule.mode === "exclude");
    let allowed = universe;
    if (includes.length > 0) {
        const union = new Set(includes.flatMap((rule) => (0, exports.normalizeProviderRestrictionValues)(rule.values)));
        allowed = allowed.filter((value) => union.has(value));
    }
    if (excludes.length > 0) {
        const blocked = new Set(excludes.flatMap((rule) => (0, exports.normalizeProviderRestrictionValues)(rule.values)));
        allowed = allowed.filter((value) => !blocked.has(value));
    }
    return allowed;
};
exports.resolveAllowedRestrictionValues = resolveAllowedRestrictionValues;
const isRestrictionValueAllowed = (input) => {
    const allowed = (0, exports.resolveAllowedRestrictionValues)(input);
    return allowed.includes((0, exports.normalizeRestrictionValue)(input.value));
};
exports.isRestrictionValueAllowed = isRestrictionValueAllowed;
const matchReceptionTypeCode = (formValue, types) => {
    const wanted = (0, exports.normalizeRestrictionValue)(formValue);
    if (!wanted) {
        return "";
    }
    for (const entry of types ?? []) {
        const type = entry && typeof entry === "object" && "data" in entry
            ? entry.data
            : entry;
        if (!type) {
            continue;
        }
        const code = (0, exports.normalizeRestrictionValue)(type.Codigo);
        const formatted = (0, exports.formatRestrictionTypeValue)(type);
        if (wanted === code || wanted === formatted) {
            return code || formatted;
        }
    }
    return wanted;
};
exports.matchReceptionTypeCode = matchReceptionTypeCode;
const validateProviderRestrictionInput = (input) => {
    const errors = [];
    if (!Number(input.payee_id) || Number(input.payee_id) < 1) {
        errors.push({ field: "payee_id", message: "Seleccione un proveedor." });
    }
    if (!(0, exports.isProviderRestrictionMode)(input.mode)) {
        errors.push({
            field: "mode",
            message: "Seleccione si se permiten o se bloquean esos valores.",
        });
    }
    if ((0, exports.normalizeProviderRestrictionValues)(input.values).length === 0) {
        errors.push({
            field: "values",
            message: "Seleccione al menos un valor.",
        });
    }
    const start = (0, exports.normalizeRestrictionValue)(input.start_date);
    const end = (0, exports.normalizeRestrictionValue)(input.end_date);
    if (start || end) {
        if (!start || !end) {
            errors.push({
                field: "start_date",
                message: "Si usa fechas, indique inicio y fin.",
            });
        }
        else {
            if (!DATE_RE.test(start) || !DATE_RE.test(end)) {
                errors.push({
                    field: "start_date",
                    message: "Las fechas deben ir en formato YYYY-MM-DD.",
                });
            }
            else if (start > end) {
                errors.push({
                    field: "end_date",
                    message: "La fecha fin no puede ser anterior a la fecha inicio.",
                });
            }
        }
        if (!(0, exports.normalizeRestrictionValue)(input.motivo)) {
            errors.push({
                field: "motivo",
                message: "Indique el motivo de la excepción con rango de fechas.",
            });
        }
    }
    return errors;
};
exports.validateProviderRestrictionInput = validateProviderRestrictionInput;
const describeMode = (mode) => {
    switch (mode) {
        case "include":
            return "solo puede usar";
        case "exclude":
            return "no puede usar";
        default:
            return assertNever(mode);
    }
};
const checkProviderRestrictionValue = (input) => {
    const allowed = (0, exports.isRestrictionValueAllowed)(input);
    if (allowed) {
        return { allowed: true };
    }
    const active = (0, exports.filterActiveProviderRestrictions)(input.rules, input.payeeId, input.date);
    const includes = active.filter((rule) => rule.mode === "include");
    const mode = includes.length > 0 ? "include" : "exclude";
    const valueLabel = (0, exports.normalizeRestrictionValue)(input.valueLabel) ||
        (0, exports.normalizeRestrictionValue)(input.value);
    return {
        allowed: false,
        mode,
        matchedValues: [valueLabel],
        title: `${input.label} no permitido para este proveedor`,
        description: `En la fecha ${input.date} este proveedor ${describeMode(mode)} ${input.label.toLowerCase()} "${valueLabel}".`,
    };
};
exports.checkProviderRestrictionValue = checkProviderRestrictionValue;
