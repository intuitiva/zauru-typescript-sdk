import assert from "node:assert/strict";
import { afterEach, describe, it } from "node:test";
import type { Session } from "@remix-run/node";
import type { AxiosAdapter, AxiosResponse } from "axios";
import { httpGraphQLAPI } from "./httpGraphQL.js";
import { httpZauru } from "./httpZauru.js";
import { getPayment, voidPayment } from "./zauru-payments.js";

const originalZauruAdapter = httpZauru.defaults.adapter;
const originalGraphqlAdapter = httpGraphQLAPI.defaults.adapter;

afterEach(() => {
  httpZauru.defaults.adapter = originalZauruAdapter;
  httpGraphQLAPI.defaults.adapter = originalGraphqlAdapter;
});

const sessionWithGraphqlToken = {
  get: (key: string) => {
    if (key === "graphqlToken") {
      return {
        token: "test-token",
        expires: "2099-01-01T00:00:00.000Z",
      };
    }
    return "user";
  },
  set: () => undefined,
  has: () => true,
} as unknown as Session;

const captureGraphqlRequest = (data: unknown, status = 200) => {
  let request: { method?: string; url?: string; data?: unknown } | undefined;
  const adapter: AxiosAdapter = async (config) => {
    request = {
      method: config.method,
      url: config.url,
      data:
        typeof config.data === "string" ? JSON.parse(config.data) : config.data,
    };
    return {
      data,
      status,
      statusText: "OK",
      headers: {},
      config,
    } as AxiosResponse;
  };
  httpGraphQLAPI.defaults.adapter = adapter;
  return () => request;
};

const captureZauruRequest = (data: unknown, status = 200) => {
  let request: { method?: string; url?: string } | undefined;
  const adapter: AxiosAdapter = async (config) => {
    request = { method: config.method, url: config.url };
    return {
      data,
      status,
      statusText: "OK",
      headers: {},
      config,
    } as AxiosResponse;
  };
  httpZauru.defaults.adapter = adapter;
  return () => request;
};

describe("sales payments", () => {
  it("When reading a payment, it should query GraphQL with its details", async () => {
    const captured = captureGraphqlRequest({
      data: {
        payments: [
          {
            id: 9,
            payment_details: [
              { id: 1, payment_id: 9, invoice_id: 3, amount: 10 },
            ],
          },
        ],
      },
    });

    const result = await getPayment(sessionWithGraphqlToken, 9);
    const request = captured();

    assert.equal(request?.method, "post");
    assert.match(String(request?.data?.query ?? ""), /payments\s*\(/);
    assert.match(String(request?.data?.query ?? ""), /id:\s*\{\s*_eq:\s*9/);
    assert.equal(result.error, false);
    assert.equal(result.data?.payment_details[0]?.invoice_id, 3);
  });

  it("When voiding a payment, it should DELETE the payment", async () => {
    const captured = captureZauruRequest("", 204);

    const result = await voidPayment({}, 9);

    assert.deepEqual(captured(), {
      method: "delete",
      url: "/sales/payments/9.json",
    });
    assert.equal(result.data, true);
  });
});
