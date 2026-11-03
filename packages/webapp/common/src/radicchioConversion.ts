import type {
  JsonMemoType,
  RadicchioBoxes,
  RadicchioConversionMemo,
} from "@zauru-sdk/types";

export type RadicchioConversionCalculation = {
  boxes: RadicchioBoxes;
  packedUnits: number;
  remainingUnits: number;
  totalBoxes: number;
};

const boxSizes = [9, 12, 15] as const;

export const emptyRadicchioBoxes = (): RadicchioBoxes => ({
  9: 0,
  12: 0,
  15: 0,
});

export const calculateRadicchioConversion = (
  receivedUnits: number,
  boxes: RadicchioBoxes,
): RadicchioConversionCalculation => {
  const normalized = Object.fromEntries(
    boxSizes.map((size) => [size, Number(boxes[size])]),
  ) as RadicchioBoxes;
  const packedUnits = boxSizes.reduce(
    (total, size) => total + size * normalized[size],
    0,
  );
  return {
    boxes: normalized,
    packedUnits,
    remainingUnits: Number(receivedUnits) - packedUnits,
    totalBoxes: boxSizes.reduce(
      (total, size) => total + normalized[size],
      0,
    ),
  };
};

export const validateRadicchioConversion = (
  receivedUnits: number,
  boxes: RadicchioBoxes,
  remainderReason?: string,
): string[] => {
  const errors: string[] = [];
  if (!Number.isInteger(receivedUnits) || receivedUnits <= 0) {
    errors.push("Las unidades recibidas deben ser un entero mayor que cero.");
  }
  for (const size of boxSizes) {
    if (!Number.isInteger(Number(boxes[size])) || Number(boxes[size]) < 0) {
      errors.push(`Las cajas de ${size} deben ser un entero mayor o igual a cero.`);
    }
  }
  if (errors.length) return errors;

  const calculation = calculateRadicchioConversion(receivedUnits, boxes);
  if (calculation.totalBoxes <= 0) {
    errors.push("Ingrese al menos una caja.");
  }
  if (calculation.remainingUnits < 0) {
    errors.push("Las cajas ingresadas superan las unidades recibidas.");
  }
  if (
    calculation.remainingUnits > 0 &&
    !String(remainderReason ?? "").trim()
  ) {
    errors.push("Indique el motivo de las unidades sin convertir.");
  }
  return errors;
};

/**
 * Splits a converted box total across original weighing lines while preserving
 * the exact total. Floors every proportional share, then assigns the remaining
 * boxes to the largest fractional residues (stable by original line order).
 */
export const allocateRadicchioBoxesByLine = (
  totalBoxes: number,
  lineUnits: number[],
): number[] => {
  if (!Number.isInteger(totalBoxes) || totalBoxes < 0) {
    throw new Error("El total de cajas debe ser un entero mayor o igual a cero.");
  }
  if (!lineUnits.length) return [];
  const normalized = lineUnits.map((value) => Math.max(0, Number(value) || 0));
  const unitTotal = normalized.reduce((sum, value) => sum + value, 0);
  if (unitTotal <= 0) {
    return normalized.map((_, index) => (index === 0 ? totalBoxes : 0));
  }

  const ideals = normalized.map((value) => (totalBoxes * value) / unitTotal);
  const allocated = ideals.map(Math.floor);
  let remaining = totalBoxes - allocated.reduce((sum, value) => sum + value, 0);
  const order = ideals
    .map((value, index) => ({ index, residue: value - Math.floor(value) }))
    .sort((a, b) => b.residue - a.residue || a.index - b.index);
  for (let index = 0; index < remaining; index += 1) {
    allocated[order[index].index] += 1;
  }
  return allocated;
};

export const getRadicchioOriginalLines = (memo: JsonMemoType): number[] => {
  const lines = memo.originalNetWeightLines ?? memo.originalNetWeighLines ?? [];
  if (lines.length) return lines.map((line) => Number(line.weight) || 0);
  const total = Number(
    memo.radicchioConversion?.receivedUnits ?? memo.originalNetWeight ?? 0,
  );
  return total > 0 ? [total] : [];
};

export const isRadicchioConversionMemo = (
  value: unknown,
): value is RadicchioConversionMemo => {
  if (!value || typeof value !== "object") return false;
  const memo = value as Partial<RadicchioConversionMemo>;
  return (
    memo.schemaVersion === 1 &&
    (memo.status === "pending" || memo.status === "converted") &&
    Number.isInteger(memo.sourceItemId) &&
    Number.isInteger(memo.targetItemId) &&
    Number.isFinite(memo.receivedUnits)
  );
};
