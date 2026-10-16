import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { getShipmentsStringQuery } from "./GraphQL.queries.js";

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
