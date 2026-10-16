import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { handlePossibleAxiosErrors } from "./common.js";
import {
  BACKGROUND_HTTP_CLIENT_POLICY,
  DEFAULT_HTTP_CLIENT_POLICY,
  getHttpClientPolicy,
  isRetryableHttpError,
  mergeHttpClientPolicies,
  runWithHttpClientPolicy,
} from "./httpClientPolicy.js";

describe("mergeHttpClientPolicies", () => {
  it("When merging an empty override, it should keep the defaults", () => {
    assert.deepEqual(
      mergeHttpClientPolicies(undefined, {}),
      DEFAULT_HTTP_CLIENT_POLICY,
    );
  });

  it("When merging a background policy, it should disable the action race and set 30s + 1 retry", () => {
    const merged = mergeHttpClientPolicies(
      undefined,
      BACKGROUND_HTTP_CLIENT_POLICY,
    );
    assert.equal(merged.actionTimeoutSeconds, false);
    assert.equal(merged.zauruTimeoutSeconds, 30);
    assert.equal(merged.graphqlTimeoutSeconds, 30);
    assert.equal(merged.retries, 1);
  });

  it("When nesting policies, it should let the inner override win", () => {
    const merged = mergeHttpClientPolicies(
      BACKGROUND_HTTP_CLIENT_POLICY,
      { graphqlTimeoutSeconds: 15, retries: 2 },
    );
    assert.equal(merged.actionTimeoutSeconds, false);
    assert.equal(merged.graphqlTimeoutSeconds, 15);
    assert.equal(merged.zauruTimeoutSeconds, 30);
    assert.equal(merged.retries, 2);
  });
});

describe("runWithHttpClientPolicy", () => {
  it("When running a policy, it should apply inside the callback and restore after", () => {
    assert.equal(getHttpClientPolicy().retries, 0);
    const inside = runWithHttpClientPolicy({ retries: 1 }, () =>
      getHttpClientPolicy().retries,
    );
    assert.equal(inside, 1);
    assert.equal(getHttpClientPolicy().retries, 0);
  });

  it("When the callback is async, it should restore the policy after it settles", async () => {
    await runWithHttpClientPolicy(
      { actionTimeoutSeconds: false },
      async () => {
        assert.equal(getHttpClientPolicy().actionTimeoutSeconds, false);
      },
    );
    assert.equal(getHttpClientPolicy().actionTimeoutSeconds, 25);
  });
});

describe("isRetryableHttpError", () => {
  it("When GraphQL times out, it should retry", () => {
    assert.equal(
      isRetryableHttpError(
        { code: "ECONNABORTED", message: "timeout of 30000ms exceeded" },
        "graphql",
      ),
      true,
    );
  });

  it("When GraphQL returns 503, it should retry", () => {
    assert.equal(
      isRetryableHttpError({ response: { status: 503 } }, "graphql"),
      true,
    );
  });

  it("When Zauru GET times out, it should retry", () => {
    assert.equal(
      isRetryableHttpError(
        { code: "ETIMEDOUT", config: { method: "get" } },
        "zauru",
      ),
      true,
    );
  });

  it("When Zauru POST times out, it should not retry", () => {
    assert.equal(
      isRetryableHttpError(
        { code: "ECONNABORTED", config: { method: "post" } },
        "zauru",
      ),
      false,
    );
  });

  it("When Zauru POST gets 422, it should not retry", () => {
    assert.equal(
      isRetryableHttpError(
        { response: { status: 422 }, config: { method: "post" } },
        "zauru",
      ),
      false,
    );
  });
});

describe("handlePossibleAxiosErrors", () => {
  it("When the action timeout is disabled, it should wait for a slow callback", async () => {
    const result = await runWithHttpClientPolicy(
      { actionTimeoutSeconds: false },
      () =>
        handlePossibleAxiosErrors(async () => {
          await new Promise((resolve) => setTimeout(resolve, 80));
          return "ok";
        }),
    );
    assert.equal(result.error, false);
    assert.equal(result.data, "ok");
  });

  it("When the action exceeds the timeout, it should return Timeout skipped", async () => {
    const result = await handlePossibleAxiosErrors(async () => {
      await new Promise((resolve) => setTimeout(resolve, 80));
      return "ok";
    }, 0.05);
    assert.equal(result.error, true);
    assert.match(result.userMsg ?? "", /Timeout skipped after 0.05 seconds/);
  });
});
