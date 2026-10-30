import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  ZAURU_SESSION_REAUTH_URL,
  createZauruSessionReauthPayload,
  hasZauruOauthReauthCookie,
  isZauruSessionExpiredError,
  isZauruSessionReauthPayload,
} from "./sessionReauth.js";

describe("isZauruSessionExpiredError", () => {
  it("When a Zauru webapp table returns HTTP 401, it should detect an expired session", () => {
    const message =
      "Error: HTTP 401 Unauthorized - URI: https://app.zauru.com/apps/webapp_tables/58/webapp_rows.json - <title>Your session expired</title>";

    assert.equal(isZauruSessionExpiredError(message), true);
  });

  it("When a Response-like value has status 401, it should detect an expired session", () => {
    assert.equal(isZauruSessionExpiredError({ status: 401 }), true);
  });

  it("When an unrelated Zauru error occurs, it should not request reauthentication", () => {
    assert.equal(
      isZauruSessionExpiredError(
        "HTTP 500 Internal Server Error - URI: https://app.zauru.com/apps/webapp_tables/58/webapp_rows.json",
      ),
      false,
    );
  });
});

describe("Zauru session reauthentication", () => {
  it("When the reauth marker cookie is present, it should recognize the refresh flow", () => {
    assert.equal(
      hasZauruOauthReauthCookie("foo=bar; zauru_oauth_reauth=1; theme=dark"),
      true,
    );
  });

  it("When building a payload, it should keep the standard contract and custom copy", () => {
    const payload = createZauruSessionReauthPayload({
      description: "El registro local se conservará.",
    });

    assert.equal(payload.reauthUrl, ZAURU_SESSION_REAUTH_URL);
    assert.equal(payload.description, "El registro local se conservará.");
    assert.equal(isZauruSessionReauthPayload(payload), true);
  });
});
