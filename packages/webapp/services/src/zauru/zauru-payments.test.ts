import assert from "node:assert/strict";
import { afterEach, describe, it } from "node:test";
import type { AxiosAdapter, AxiosResponse } from "axios";
import { httpZauru } from "./httpZauru.js";
import { getPayment, voidPayment } from "./zauru-payments.js";

const originalAdapter = httpZauru.defaults.adapter;

afterEach(() => {
  httpZauru.defaults.adapter = originalAdapter;
});

const captureRequest = (data: unknown, status = 200) => {
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

describe("sales payments REST", () => {
  it("When reading a payment, it should GET the show JSON with its details", async () => {
    const captured = captureRequest({
      id: 9,
      payment_details: [{ id: 1, payment_id: 9, invoice_id: 3, amount: 10 }],
    });

    const result = await getPayment({}, 9);

    assert.deepEqual(captured(), {
      method: "get",
      url: "/sales/payments/9.json",
    });
    assert.equal(result.error, false);
    assert.equal(result.data?.payment_details[0]?.invoice_id, 3);
  });

  it("When voiding a payment, it should DELETE the payment", async () => {
    const captured = captureRequest("", 204);

    const result = await voidPayment({}, 9);

    assert.deepEqual(captured(), {
      method: "delete",
      url: "/sales/payments/9.json",
    });
    assert.equal(result.data, true);
  });
});
