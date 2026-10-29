import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  buildPurchaseOrderDetailsCostAttributes,
  calculatePurchaseOrderFinancials,
} from "./common.js";

describe("buildPurchaseOrderDetailsCostAttributes", () => {
  it("sends cost as qty × unit_cost so Baculo can refresh subtotal", () => {
    const attributes = buildPurchaseOrderDetailsCostAttributes(
      [
        {
          id: 2827653,
          item_id: 490543,
          booked_quantity: 14,
          delivered_quantity: 14,
          unit_cost: 8.2,
        },
      ],
      new Map([[2827653, 7.7]]),
    );

    assert.deepEqual(attributes, {
      "0": {
        id: 2827653,
        item_id: 490543,
        unit_cost: 7.7,
        cost: 107.8,
      },
    });
  });

  it("keeps current unit_cost when there is no override", () => {
    const attributes = buildPurchaseOrderDetailsCostAttributes([
      {
        id: 1,
        item_id: 2,
        booked_quantity: 10,
        unit_cost: 4.5,
      },
    ]);

    assert.equal(attributes["0"].unit_cost, 4.5);
    assert.equal(attributes["0"].cost, 45);
  });
});

describe("calculatePurchaseOrderFinancials", () => {
  it("uses the new unit cost as the rejection discount base", () => {
    const financials = calculatePurchaseOrderFinancials({
      details: [
        {
          booked_quantity: 14,
          delivered_quantity: 14,
          unit_cost: 7.7,
        },
      ],
      rejectionPercentage: 7,
    });

    assert.equal(financials.subtotal, 107.8);
    assert.equal(financials.discount, 7.55);
  });
});
