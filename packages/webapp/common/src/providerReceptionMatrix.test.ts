import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type {
  ProviderReceptionBlockRule,
  ProviderReceptionException,
} from "@zauru-sdk/types";
import {
  evaluateProviderReceptionMatrix,
  providerReceptionMatrixLeavesNoAllowedCombination,
  resolveAllowedProviderReceptionItems,
  resolveAllowedProviderReceptionTypes,
  validateProviderReceptionException,
} from "./providerReceptionMatrix.js";

const block = (
  partial: Partial<ProviderReceptionBlockRule> = {},
): ProviderReceptionBlockRule => ({
  payee_id: 10,
  reception_type_code: "1",
  blocked_item_ids: [],
  ...partial,
});

const exception = (
  partial: Partial<ProviderReceptionException> = {},
): ProviderReceptionException => ({
  payee_id: 10,
  reception_type_code: "1",
  mode: "block",
  item_ids: [100],
  start_date: "2026-10-01",
  end_date: "2026-10-31",
  motivo: "Suspensión temporal",
  ...partial,
});

describe("resolveAllowedProviderReceptionItems", () => {
  it("allows the whole universe when no matrix row exists", () => {
    assert.deepEqual(
      resolveAllowedProviderReceptionItems({
        payeeId: 10,
        receptionTypeCode: "1",
        date: "2026-10-15",
        universe: [100, 200],
      }),
      ["100", "200"],
    );
  });

  it("blocks only the exact provider, type and item combination", () => {
    const rules = [block({ blocked_item_ids: [100] })];
    assert.deepEqual(
      resolveAllowedProviderReceptionItems({
        payeeId: 10,
        receptionTypeCode: "1",
        date: "2026-10-15",
        universe: [100, 200],
        blockRules: rules,
      }),
      ["200"],
    );
    assert.deepEqual(
      resolveAllowedProviderReceptionItems({
        payeeId: 10,
        receptionTypeCode: "Normal",
        date: "2026-10-15",
        universe: [100, 200],
        blockRules: rules,
      }),
      ["100", "200"],
    );
  });

  it("allows a base-blocked item only inside an allow exception range", () => {
    const input = {
      payeeId: 10,
      receptionTypeCode: "1",
      universe: [100, 200],
      blockRules: [block({ blocked_item_ids: [100] })],
      exceptions: [exception({ mode: "allow" as const })],
    };
    assert.deepEqual(
      resolveAllowedProviderReceptionItems({ ...input, date: "2026-10-15" }),
      ["100", "200"],
    );
    assert.deepEqual(
      resolveAllowedProviderReceptionItems({ ...input, date: "2026-11-01" }),
      ["200"],
    );
  });

  it("makes a temporary block win over an overlapping allow", () => {
    assert.deepEqual(
      resolveAllowedProviderReceptionItems({
        payeeId: 10,
        receptionTypeCode: "1",
        date: "2026-10-15",
        universe: [100, 200],
        exceptions: [
          exception({ mode: "allow" }),
          exception({ mode: "block" }),
        ],
      }),
      ["200"],
    );
  });

  it("ignores soft-deleted matrix rows and exceptions", () => {
    assert.deepEqual(
      resolveAllowedProviderReceptionItems({
        payeeId: 10,
        receptionTypeCode: "1",
        date: "2026-10-15",
        universe: [100, 200],
        blockRules: [
          block({ blocked_item_ids: [100], fechaEliminacion: "2026-10-01" }),
        ],
        exceptions: [exception({ fechaEliminacion: "2026-10-01" })],
      }),
      ["100", "200"],
    );
  });
});

describe("provider reception matrix validation", () => {
  it("keeps only reception types with at least one allowed item", () => {
    assert.deepEqual(
      resolveAllowedProviderReceptionTypes({
        payeeId: 10,
        date: "2026-10-15",
        receptionTypeCodes: ["Normal", "1"],
        itemIds: [100],
        blockRules: [block({ blocked_item_ids: [100] })],
      }),
      ["Normal"],
    );
  });

  it("rejects rules whose dated overlap leaves no valid combination", () => {
    assert.equal(
      providerReceptionMatrixLeavesNoAllowedCombination({
        payeeId: 10,
        receptionTypeCodes: ["Normal", "1"],
        itemIds: [100],
        blockRules: [block({ blocked_item_ids: [100] })],
        exceptions: [
          exception({
            reception_type_code: "Normal",
            mode: "block",
            item_ids: [100],
          }),
        ],
      }),
      true,
    );
  });

  it("requires valid dates, items and motivo for exceptions", () => {
    const errors = validateProviderReceptionException(
      exception({ end_date: "2026-09-01", motivo: "", item_ids: [999] }),
      { receptionTypeCodes: ["1"], itemIds: [100, 200] },
    );
    assert.equal(errors.length, 3);
  });
});

describe("evaluateProviderReceptionMatrix", () => {
  it("includes the temporary reason and inclusive range when blocked", () => {
    const result = evaluateProviderReceptionMatrix({
      payeeId: 10,
      receptionTypeCode: "1",
      date: "2026-10-31",
      itemId: 100,
      itemLabel: "Ejote",
      itemIds: [100, 200],
      exceptions: [exception()],
    });
    assert.equal(result.allowed, false);
    if (!result.allowed) {
      assert.match(result.description, /Suspensión temporal/);
      assert.match(result.description, /2026-10-31/);
    }
  });
});
