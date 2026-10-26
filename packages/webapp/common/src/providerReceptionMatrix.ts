import type {
  ProviderReceptionBlockRule,
  ProviderReceptionException,
  ProviderRestrictionCheckResult,
} from "@zauru-sdk/types";
import {
  normalizeProviderRestrictionValues,
  normalizeRestrictionValue,
  sampleDatesForRestrictionRules,
} from "./providerRestrictions.js";

export const PROVIDER_RECEPTION_MATRIX_TABLE_VAR =
  "ctl_calidad_admin_matriz_recepcion_proveedor_web_app_table_id";

export const PROVIDER_RECEPTION_EXCEPTIONS_TABLE_VAR =
  "ctl_calidad_admin_excepciones_recepcion_proveedor_web_app_table_id";

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

const isActive = (
  row: Pick<ProviderReceptionException, "start_date" | "end_date" | "fechaEliminacion">,
  date: string,
): boolean => {
  if (normalizeRestrictionValue(row.fechaEliminacion) || !DATE_RE.test(date)) {
    return false;
  }
  const start = normalizeRestrictionValue(row.start_date);
  const end = normalizeRestrictionValue(row.end_date);
  return DATE_RE.test(start) && DATE_RE.test(end) && start <= date && date <= end;
};

const matchesProviderAndType = (
  row: { payee_id: number; reception_type_code: string },
  payeeId: number,
  receptionTypeCode: string,
): boolean =>
  Number(row.payee_id) === Number(payeeId) &&
  normalizeRestrictionValue(row.reception_type_code) ===
    normalizeRestrictionValue(receptionTypeCode);

export const resolveAllowedProviderReceptionItems = (input: {
  payeeId: number;
  receptionTypeCode: string;
  date: string;
  universe: Array<string | number>;
  blockRules?: ProviderReceptionBlockRule[];
  exceptions?: ProviderReceptionException[];
}): string[] => {
  const universe = input.universe
    .map(normalizeRestrictionValue)
    .filter(Boolean);
  const universeSet = new Set(universe);
  const blocked = new Set(
    (input.blockRules ?? [])
      .filter(
        (row) =>
          !normalizeRestrictionValue(row.fechaEliminacion) &&
          matchesProviderAndType(
            row,
            input.payeeId,
            input.receptionTypeCode,
          ),
      )
      .flatMap((row) =>
        normalizeProviderRestrictionValues(row.blocked_item_ids),
      ),
  );

  const activeExceptions = (input.exceptions ?? []).filter(
    (row) =>
      matchesProviderAndType(
        row,
        input.payeeId,
        input.receptionTypeCode,
      ) && isActive(row, input.date),
  );

  const temporarilyAllowed = new Set(
    activeExceptions
      .filter((row) => row.mode === "allow")
      .flatMap((row) => normalizeProviderRestrictionValues(row.item_ids)),
  );
  const temporarilyBlocked = new Set(
    activeExceptions
      .filter((row) => row.mode === "block")
      .flatMap((row) => normalizeProviderRestrictionValues(row.item_ids)),
  );

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

export const resolveAllowedProviderReceptionTypes = (input: {
  payeeId: number;
  date: string;
  receptionTypeCodes: Array<string | number>;
  itemIds: Array<string | number>;
  blockRules?: ProviderReceptionBlockRule[];
  exceptions?: ProviderReceptionException[];
}): string[] =>
  input.receptionTypeCodes
    .map(normalizeRestrictionValue)
    .filter(Boolean)
    .filter(
      (receptionTypeCode) =>
        resolveAllowedProviderReceptionItems({
          ...input,
          receptionTypeCode,
          universe: input.itemIds,
        }).length > 0,
    );

export const providerReceptionMatrixLeavesNoAllowedCombination = (input: {
  payeeId: number;
  receptionTypeCodes: Array<string | number>;
  itemIds: Array<string | number>;
  blockRules?: ProviderReceptionBlockRule[];
  exceptions?: ProviderReceptionException[];
}): boolean => {
  const relevantExceptions = (input.exceptions ?? []).filter(
    (row) =>
      Number(row.payee_id) === Number(input.payeeId) &&
      !normalizeRestrictionValue(row.fechaEliminacion),
  );
  const dates = sampleDatesForRestrictionRules(relevantExceptions);
  return dates.some(
    (date) =>
      resolveAllowedProviderReceptionTypes({
        ...input,
        date,
      }).length === 0,
  );
};

export const validateProviderReceptionException = (
  row: ProviderReceptionException,
  options: {
    receptionTypeCodes: Array<string | number>;
    itemIds: Array<string | number>;
  },
): string[] => {
  const errors: string[] = [];
  const typeCodes = new Set(
    options.receptionTypeCodes.map(normalizeRestrictionValue).filter(Boolean),
  );
  const itemIds = new Set(
    options.itemIds.map(normalizeRestrictionValue).filter(Boolean),
  );
  const selectedItems = normalizeProviderRestrictionValues(row.item_ids);

  if (!Number(row.payee_id) || Number(row.payee_id) < 1) {
    errors.push("Seleccione un proveedor.");
  }
  if (!typeCodes.has(normalizeRestrictionValue(row.reception_type_code))) {
    errors.push("Seleccione un tipo de recepción válido.");
  }
  if (row.mode !== "allow" && row.mode !== "block") {
    errors.push("Seleccione si la excepción permite o bloquea verduras.");
  }
  if (
    selectedItems.length === 0 ||
    selectedItems.some((itemId) => !itemIds.has(itemId))
  ) {
    errors.push("Seleccione al menos una verdura válida.");
  }
  if (
    !DATE_RE.test(row.start_date) ||
    !DATE_RE.test(row.end_date) ||
    row.start_date > row.end_date
  ) {
    errors.push("Indique un rango de fechas válido.");
  }
  if (!normalizeRestrictionValue(row.motivo)) {
    errors.push("Indique el motivo de la excepción.");
  }
  return errors;
};

export const evaluateProviderReceptionMatrix = (input: {
  payeeId: number;
  receptionTypeCode: string;
  date: string;
  itemId: string | number;
  itemLabel?: string;
  itemIds: Array<string | number>;
  blockRules?: ProviderReceptionBlockRule[];
  exceptions?: ProviderReceptionException[];
}): ProviderRestrictionCheckResult => {
  const itemId = normalizeRestrictionValue(input.itemId);
  const allowed = resolveAllowedProviderReceptionItems({
    ...input,
    universe: input.itemIds,
  });
  if (allowed.includes(itemId)) {
    return { allowed: true };
  }

  const blockingException = (input.exceptions ?? []).find(
    (row) =>
      row.mode === "block" &&
      matchesProviderAndType(
        row,
        input.payeeId,
        input.receptionTypeCode,
      ) &&
      isActive(row, input.date) &&
      normalizeProviderRestrictionValues(row.item_ids).includes(itemId),
  );
  const itemLabel = normalizeRestrictionValue(input.itemLabel) || itemId;

  if (blockingException) {
    return {
      allowed: false,
      mode: "exclude",
      matchedValues: [itemLabel],
      title: "Verdura no permitida para este proveedor",
      description: `Del ${blockingException.start_date} al ${blockingException.end_date}, la verdura "${itemLabel}" está bloqueada para el tipo ${normalizeRestrictionValue(input.receptionTypeCode)}. Motivo: ${normalizeRestrictionValue(blockingException.motivo)}.`,
    };
  }

  return {
    allowed: false,
    mode: "exclude",
    matchedValues: [itemLabel],
    title: "Verdura no permitida para este proveedor",
    description: `La combinación de tipo ${normalizeRestrictionValue(input.receptionTypeCode)} y verdura "${itemLabel}" está desmarcada en la matriz del proveedor.`,
  };
};
