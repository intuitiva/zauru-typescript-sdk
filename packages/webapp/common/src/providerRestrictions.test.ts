import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { ProviderRestrictionRule } from "@zauru-sdk/types";
import {
  checkProviderRestrictionValue,
  filterActiveProviderRestrictions,
  isRestrictionActiveOnDate,
  isRestrictionValueAllowed,
  matchReceptionTypeCode,
  resolveAllowedRestrictionValues,
  validateProviderRestrictionInput,
} from "./providerRestrictions.js";

const rule = (
  partial: Partial<ProviderRestrictionRule> &
    Pick<ProviderRestrictionRule, "payee_id" | "mode" | "values">,
): ProviderRestrictionRule => ({
  ...partial,
});

describe("isRestrictionActiveOnDate", () => {
  it("When there is no date range, it should apply every day", () => {
    assert.equal(
      isRestrictionActiveOnDate(
        rule({ payee_id: 1, mode: "exclude", values: ["A"] }),
        "2026-10-27",
      ),
      true,
    );
  });

  it("When the date is inside the range, it should apply on the boundaries", () => {
    const dated = rule({
      payee_id: 1,
      mode: "exclude",
      values: ["A"],
      start_date: "2026-10-27",
      end_date: "2026-11-02",
    });
    assert.equal(isRestrictionActiveOnDate(dated, "2026-10-27"), true);
    assert.equal(isRestrictionActiveOnDate(dated, "2026-11-02"), true);
    assert.equal(isRestrictionActiveOnDate(dated, "2026-10-26"), false);
    assert.equal(isRestrictionActiveOnDate(dated, "2026-11-03"), false);
  });

  it("When the rule is soft-deleted, it should never apply", () => {
    assert.equal(
      isRestrictionActiveOnDate(
        rule({
          payee_id: 1,
          mode: "exclude",
          values: ["A"],
          fechaEliminacion: "2026-10-01T00:00:00.000Z",
        }),
        "2026-10-27",
      ),
      false,
    );
  });
});

describe("resolveAllowedRestrictionValues", () => {
  const universe = ["Normal", "Certificado 1", "Certificado 2"];

  it("When there are no rules, it should allow the whole universe", () => {
    assert.deepEqual(
      resolveAllowedRestrictionValues({
        payeeId: 10,
        date: "2026-10-27",
        rules: [],
        universe,
      }),
      universe,
    );
  });

  it("When an exclude rule is active, it should remove those codes", () => {
    assert.deepEqual(
      resolveAllowedRestrictionValues({
        payeeId: 10,
        date: "2026-10-28",
        rules: [
          rule({
            payee_id: 10,
            mode: "exclude",
            values: ["Certificado 1", "Certificado 2"],
            start_date: "2026-10-27",
            end_date: "2026-11-02",
          }),
        ],
        universe,
      }),
      ["Normal"],
    );
  });

  it("When the date is outside the exclude range, it should allow everything", () => {
    assert.deepEqual(
      resolveAllowedRestrictionValues({
        payeeId: 10,
        date: "2026-11-10",
        rules: [
          rule({
            payee_id: 10,
            mode: "exclude",
            values: ["Certificado 1"],
            start_date: "2026-10-27",
            end_date: "2026-11-02",
          }),
        ],
        universe,
      }),
      universe,
    );
  });

  it("When an include rule is active, it should keep only those values", () => {
    assert.deepEqual(
      resolveAllowedRestrictionValues({
        payeeId: 10,
        date: "2026-10-28",
        rules: [
          rule({
            payee_id: 10,
            mode: "include",
            values: ["Normal", "Certificado 1"],
          }),
        ],
        universe,
      }),
      ["Normal", "Certificado 1"],
    );
  });

  it("When include and exclude overlap, it should subtract the excluded values", () => {
    assert.deepEqual(
      resolveAllowedRestrictionValues({
        payeeId: 10,
        date: "2026-10-28",
        rules: [
          rule({
            payee_id: 10,
            mode: "include",
            values: ["Normal", "Certificado 1"],
          }),
          rule({
            payee_id: 10,
            mode: "exclude",
            values: ["Certificado 1"],
            start_date: "2026-10-27",
            end_date: "2026-11-02",
          }),
        ],
        universe,
      }),
      ["Normal"],
    );
  });

  it("When the rule belongs to another payee, it should ignore it", () => {
    assert.equal(
      filterActiveProviderRestrictions(
        [
          rule({
            payee_id: 99,
            mode: "exclude",
            values: ["Normal"],
          }),
        ],
        10,
        "2026-10-28",
      ).length,
      0,
    );
  });
});

describe("matchReceptionTypeCode", () => {
  const types = [
    { Nombre: "Certificado", Codigo: "1" },
    { Nombre: "Normal", Codigo: "N" },
  ];

  it("When the form value is Nombre + Codigo, it should return the code", () => {
    assert.equal(matchReceptionTypeCode("Certificado 1", types), "1");
    assert.equal(matchReceptionTypeCode("1", types), "1");
  });
});

describe("isRestrictionValueAllowed", () => {
  it("When the selected type is excluded, it should reject it", () => {
    assert.equal(
      isRestrictionValueAllowed({
        payeeId: 7,
        date: "2026-10-28",
        value: "1",
        universe: ["N", "1"],
        rules: [
          rule({
            payee_id: 7,
            mode: "exclude",
            values: ["1"],
            start_date: "2026-10-27",
            end_date: "2026-11-02",
          }),
        ],
      }),
      false,
    );
  });
});

describe("checkProviderRestrictionValue", () => {
  it("When blocked, it should return a title and description", () => {
    const result = checkProviderRestrictionValue({
      payeeId: 7,
      date: "2026-10-28",
      value: "1",
      valueLabel: "Certificado 1",
      label: "Tipo",
      universe: ["N", "1"],
      rules: [
        rule({
          payee_id: 7,
          mode: "exclude",
          values: ["1"],
          start_date: "2026-10-27",
          end_date: "2026-11-02",
        }),
      ],
    });
    assert.equal(result.allowed, false);
    if (!result.allowed) {
      assert.match(result.description, /no puede usar tipo "Certificado 1"/);
    }
  });
});

describe("validateProviderRestrictionInput", () => {
  it("When dates are set without a reason, it should require motivo", () => {
    const errors = validateProviderRestrictionInput({
      payee_id: 1,
      mode: "exclude",
      values: ["1"],
      start_date: "2026-10-27",
      end_date: "2026-11-02",
      motivo: "",
    });
    assert.equal(
      errors.some((error) => error.field === "motivo"),
      true,
    );
  });

  it("When there is no date range, it should not require motivo", () => {
    const errors = validateProviderRestrictionInput({
      payee_id: 1,
      mode: "include",
      values: ["1"],
    });
    assert.deepEqual(errors, []);
  });

  it("When only one date is set, it should require both", () => {
    const errors = validateProviderRestrictionInput({
      payee_id: 1,
      mode: "exclude",
      values: ["1"],
      start_date: "2026-10-27",
      motivo: "Auditoría",
    });
    assert.equal(
      errors.some((error) => error.field === "start_date"),
      true,
    );
  });
});
