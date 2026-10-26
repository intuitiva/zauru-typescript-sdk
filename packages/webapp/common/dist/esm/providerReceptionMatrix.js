"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.evaluateProviderReceptionMatrix = exports.validateProviderReceptionException = exports.providerReceptionMatrixLeavesNoAllowedCombination = exports.resolveAllowedProviderReceptionTypes = exports.resolveAllowedProviderReceptionItems = exports.PROVIDER_RECEPTION_EXCEPTIONS_TABLE_VAR = exports.PROVIDER_RECEPTION_MATRIX_TABLE_VAR = void 0;
const providerRestrictions_js_1 = require("./providerRestrictions.js");
exports.PROVIDER_RECEPTION_MATRIX_TABLE_VAR = "ctl_calidad_admin_matriz_recepcion_proveedor_web_app_table_id";
exports.PROVIDER_RECEPTION_EXCEPTIONS_TABLE_VAR = "ctl_calidad_admin_excepciones_recepcion_proveedor_web_app_table_id";
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const isActive = (row, date) => {
    if ((0, providerRestrictions_js_1.normalizeRestrictionValue)(row.fechaEliminacion) || !DATE_RE.test(date)) {
        return false;
    }
    const start = (0, providerRestrictions_js_1.normalizeRestrictionValue)(row.start_date);
    const end = (0, providerRestrictions_js_1.normalizeRestrictionValue)(row.end_date);
    return DATE_RE.test(start) && DATE_RE.test(end) && start <= date && date <= end;
};
const matchesProviderAndType = (row, payeeId, receptionTypeCode) => Number(row.payee_id) === Number(payeeId) &&
    (0, providerRestrictions_js_1.normalizeRestrictionValue)(row.reception_type_code) ===
        (0, providerRestrictions_js_1.normalizeRestrictionValue)(receptionTypeCode);
const resolveAllowedProviderReceptionItems = (input) => {
    const universe = input.universe
        .map(providerRestrictions_js_1.normalizeRestrictionValue)
        .filter(Boolean);
    const universeSet = new Set(universe);
    const blocked = new Set((input.blockRules ?? [])
        .filter((row) => !(0, providerRestrictions_js_1.normalizeRestrictionValue)(row.fechaEliminacion) &&
        matchesProviderAndType(row, input.payeeId, input.receptionTypeCode))
        .flatMap((row) => (0, providerRestrictions_js_1.normalizeProviderRestrictionValues)(row.blocked_item_ids)));
    const activeExceptions = (input.exceptions ?? []).filter((row) => matchesProviderAndType(row, input.payeeId, input.receptionTypeCode) && isActive(row, input.date));
    const temporarilyAllowed = new Set(activeExceptions
        .filter((row) => row.mode === "allow")
        .flatMap((row) => (0, providerRestrictions_js_1.normalizeProviderRestrictionValues)(row.item_ids)));
    const temporarilyBlocked = new Set(activeExceptions
        .filter((row) => row.mode === "block")
        .flatMap((row) => (0, providerRestrictions_js_1.normalizeProviderRestrictionValues)(row.item_ids)));
    const allowed = new Set(universe.filter((itemId) => !blocked.has(itemId)));
    for (const itemId of temporarilyAllowed) {
        if (universeSet.has(itemId)) {
            allowed.add(itemId);
        }
    }
    for (const itemId of temporarilyBlocked) {
        allowed.delete(itemId);
    }
    return universe.filter((itemId) => allowed.has(itemId));
};
exports.resolveAllowedProviderReceptionItems = resolveAllowedProviderReceptionItems;
const resolveAllowedProviderReceptionTypes = (input) => input.receptionTypeCodes
    .map(providerRestrictions_js_1.normalizeRestrictionValue)
    .filter(Boolean)
    .filter((receptionTypeCode) => (0, exports.resolveAllowedProviderReceptionItems)({
    ...input,
    receptionTypeCode,
    universe: input.itemIds,
}).length > 0);
exports.resolveAllowedProviderReceptionTypes = resolveAllowedProviderReceptionTypes;
const providerReceptionMatrixLeavesNoAllowedCombination = (input) => {
    const relevantExceptions = (input.exceptions ?? []).filter((row) => Number(row.payee_id) === Number(input.payeeId) &&
        !(0, providerRestrictions_js_1.normalizeRestrictionValue)(row.fechaEliminacion));
    const dates = (0, providerRestrictions_js_1.sampleDatesForRestrictionRules)(relevantExceptions);
    return dates.some((date) => (0, exports.resolveAllowedProviderReceptionTypes)({
        ...input,
        date,
    }).length === 0);
};
exports.providerReceptionMatrixLeavesNoAllowedCombination = providerReceptionMatrixLeavesNoAllowedCombination;
const validateProviderReceptionException = (row, options) => {
    const errors = [];
    const typeCodes = new Set(options.receptionTypeCodes.map(providerRestrictions_js_1.normalizeRestrictionValue).filter(Boolean));
    const itemIds = new Set(options.itemIds.map(providerRestrictions_js_1.normalizeRestrictionValue).filter(Boolean));
    const selectedItems = (0, providerRestrictions_js_1.normalizeProviderRestrictionValues)(row.item_ids);
    if (!Number(row.payee_id) || Number(row.payee_id) < 1) {
        errors.push("Seleccione un proveedor.");
    }
    if (!typeCodes.has((0, providerRestrictions_js_1.normalizeRestrictionValue)(row.reception_type_code))) {
        errors.push("Seleccione un tipo de recepción válido.");
    }
    if (row.mode !== "allow" && row.mode !== "block") {
        errors.push("Seleccione si la excepción permite o bloquea verduras.");
    }
    if (selectedItems.length === 0 ||
        selectedItems.some((itemId) => !itemIds.has(itemId))) {
        errors.push("Seleccione al menos una verdura válida.");
    }
    if (!DATE_RE.test(row.start_date) ||
        !DATE_RE.test(row.end_date) ||
        row.start_date > row.end_date) {
        errors.push("Indique un rango de fechas válido.");
    }
    if (!(0, providerRestrictions_js_1.normalizeRestrictionValue)(row.motivo)) {
        errors.push("Indique el motivo de la excepción.");
    }
    return errors;
};
exports.validateProviderReceptionException = validateProviderReceptionException;
const evaluateProviderReceptionMatrix = (input) => {
    const itemId = (0, providerRestrictions_js_1.normalizeRestrictionValue)(input.itemId);
    const allowed = (0, exports.resolveAllowedProviderReceptionItems)({
        ...input,
        universe: input.itemIds,
    });
    if (allowed.includes(itemId)) {
        return { allowed: true };
    }
    const blockingException = (input.exceptions ?? []).find((row) => row.mode === "block" &&
        matchesProviderAndType(row, input.payeeId, input.receptionTypeCode) &&
        isActive(row, input.date) &&
        (0, providerRestrictions_js_1.normalizeProviderRestrictionValues)(row.item_ids).includes(itemId));
    const itemLabel = (0, providerRestrictions_js_1.normalizeRestrictionValue)(input.itemLabel) || itemId;
    if (blockingException) {
        return {
            allowed: false,
            mode: "exclude",
            matchedValues: [itemLabel],
            title: "Verdura no permitida para este proveedor",
            description: `Del ${blockingException.start_date} al ${blockingException.end_date}, la verdura "${itemLabel}" está bloqueada para el tipo ${(0, providerRestrictions_js_1.normalizeRestrictionValue)(input.receptionTypeCode)}. Motivo: ${(0, providerRestrictions_js_1.normalizeRestrictionValue)(blockingException.motivo)}.`,
        };
    }
    return {
        allowed: false,
        mode: "exclude",
        matchedValues: [itemLabel],
        title: "Verdura no permitida para este proveedor",
        description: `La combinación de tipo ${(0, providerRestrictions_js_1.normalizeRestrictionValue)(input.receptionTypeCode)} y verdura "${itemLabel}" está desmarcada en la matriz del proveedor.`,
    };
};
exports.evaluateProviderReceptionMatrix = evaluateProviderReceptionMatrix;
