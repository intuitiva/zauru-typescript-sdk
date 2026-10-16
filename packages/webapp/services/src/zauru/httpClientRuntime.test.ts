import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import {
  applyHttpClientTimeout,
  maybeRetryHttpRequest,
} from "./httpClientRuntime.js";

const runtimeSource = readFileSync(
  join(dirname(fileURLToPath(import.meta.url)), "httpClientRuntime.ts"),
  "utf8",
);

describe("httpClientRuntime", () => {
  it("When the module loads, it should not statically import node:async_hooks", () => {
    assert.equal(
      /from\s+["']node:async_hooks["']/.test(runtimeSource),
      false,
    );
    assert.equal(/from\s+["']async_hooks["']/.test(runtimeSource), false);
  });

  it("When a request has no timeout, it should apply the GraphQL policy timeout", () => {
    const request = applyHttpClientTimeout({} as never, "graphql");
    assert.equal(request.timeout, 200_000);
  });

  it("When a request already has a timeout, it should keep it", () => {
    const request = applyHttpClientTimeout(
      { timeout: 5_000 } as never,
      "graphql",
    );
    assert.equal(request.timeout, 5_000);
  });

  it("When the error has no axios config, it should not retry", async () => {
    const retried = await maybeRetryHttpRequest(
      { message: "boom" },
      { request: async () => null } as never,
      "graphql",
    );
    assert.equal(retried, null);
  });
});
