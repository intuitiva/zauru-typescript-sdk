import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  getPayeeByIdStringQuery,
  getPurchaseOrdersBetweenDatesStringQuery,
  getShipmentsStringQuery,
} from "./GraphQL.queries.js";

describe("getPayeeByIdStringQuery", () => {
  it("includes payee_category_id so price rules can match by programa", () => {
    const query = getPayeeByIdStringQuery(1689394);
    assert.match(query, /payees\s*\(where:\s*\{\s*id:\s*\{\s*_eq:\s*1689394/);
    assert.match(query, /payee_category_id/);
    assert.match(query, /payee_category\s*\{/);
  });
});

describe("getPurchaseOrdersBetweenDatesStringQuery", () => {
  it("does not request lock_version; Hasura purchase_orders has no such field", () => {
    const query = getPurchaseOrdersBetweenDatesStringQuery(
      "2026-11-01",
      "2026-11-03",
      {
        excludeVoided: true,
        betweenIssueDate: true,
        withPODetails: true,
      },
    );
    assert.equal(/lock_version/.test(query), false);
    assert.match(query, /purchase_orders/);
  });
});

describe("getShipmentsStringQuery", () => {
  it("When withMovements is omitted, it should include movements", () => {
    const query = getShipmentsStringQuery({ id_number: "TN0TEST-1" });
    assert.match(query, /movements\s*\{/);
    assert.match(query, /limit:\s*1000/);
  });

  it("When withMovements is false, it should omit movements", () => {
    const query = getShipmentsStringQuery({
      id_number: "TN0TEST-1",
      withMovements: false,
      limit: 1,
    });
    assert.equal(/movements\s*\{/.test(query), false);
    assert.match(query, /limit:\s*1/);
    assert.match(query, /id_number:\s*\{\s*_eq:\s*"TN0TEST-1"/);
  });
});
