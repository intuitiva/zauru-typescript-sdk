import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  allocateRadicchioBoxesByLine,
  calculateRadicchioConversion,
  getRadicchioOriginalLines,
  validateRadicchioConversion,
} from "./radicchioConversion.js";

describe("radicchio conversion", () => {
  it("calculates boxes, packed units and remainder", () => {
    assert.deepEqual(
      calculateRadicchioConversion(100, { 9: 2, 12: 3, 15: 2 }),
      {
      boxes: { 9: 2, 12: 3, 15: 2 },
      packedUnits: 84,
      remainingUnits: 16,
      totalBoxes: 7,
      },
    );
  });

  it("requires a reason when units remain", () => {
    assert.ok(
      validateRadicchioConversion(100, { 9: 10, 12: 0, 15: 0 }).includes(
        "Indique el motivo de las unidades sin convertir.",
      ),
    );
    assert.deepEqual(
      validateRadicchioConversion(
        100,
        { 9: 10, 12: 0, 15: 0 },
        "Unidades sueltas",
      ),
      [],
    );
  });

  it("rejects over-allocation and non-integer boxes", () => {
    assert.ok(
      validateRadicchioConversion(10, { 9: 0, 12: 1, 15: 0 }).includes(
        "Las cajas ingresadas superan las unidades recibidas.",
      ),
    );
    assert.ok(
      validateRadicchioConversion(100, { 9: 1.5, 12: 0, 15: 0 }).includes(
        "Las cajas de 9 deben ser un entero mayor o igual a cero.",
      ),
    );
  });

  it("allocates boxes by largest residue and preserves the total", () => {
    const result = allocateRadicchioBoxesByLine(10, [50, 30, 20]);
    assert.deepEqual(result, [5, 3, 2]);
    assert.equal(result.reduce((sum, value) => sum + value, 0), 10);
  });

  it("reads the corrected and legacy line keys", () => {
    assert.deepEqual(
      getRadicchioOriginalLines({ originalNetWeightLines: [{ weight: 12 }] }),
      [12],
    );
    assert.deepEqual(
      getRadicchioOriginalLines({ originalNetWeighLines: [{ weight: 15 }] }),
      [15],
    );
  });
});
