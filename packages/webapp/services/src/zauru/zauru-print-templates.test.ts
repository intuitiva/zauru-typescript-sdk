import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";

const source = readFileSync(
  join(dirname(fileURLToPath(import.meta.url)), "zauru-print-templates.ts"),
  "utf8",
);

describe("zauru-print-templates REST", () => {
  it("When creating a print template, it should POST the Baculo JSON envelope", () => {
    assert.match(source, /\/settings\/templates\/print_templates\.json/);
    assert.match(source, /print_template:\s*body/);
  });

  it("When updating a print template, it should PATCH by id", () => {
    assert.match(
      source,
      /\/settings\/templates\/print_templates\/\$\{id\}\.json/,
    );
  });

  it("When creating a document print, it should POST the Baculo JSON envelope", () => {
    assert.match(source, /\/settings\/templates\/document_prints\.json/);
    assert.match(source, /document_print:\s*body/);
  });
});
