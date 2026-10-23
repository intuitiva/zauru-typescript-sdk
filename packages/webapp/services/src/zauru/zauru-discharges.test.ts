import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";

const source = readFileSync(
  join(dirname(fileURLToPath(import.meta.url)), "zauru-discharges.ts"),
  "utf8",
);

describe("zauru-discharges PDF", () => {
  it("When generating a cheque PDF, it should use discharge_template_id and discharges/gen_print_all", () => {
    assert.match(source, /discharge_template_id/);
    assert.match(source, /\/purchases\/discharges\/gen_print_all\.json/);
    assert.equal(source.includes("consolidated_template_id"), false);
    assert.equal(source.includes("consolidates/gen_print_all"), false);
  });

  it("When polling a cheque PDF, it should hit discharges/check_print_all", () => {
    assert.match(source, /purchases\/discharges\/check_print_all/);
    assert.equal(source.includes("consolidates/check_print_all"), false);
  });
});
