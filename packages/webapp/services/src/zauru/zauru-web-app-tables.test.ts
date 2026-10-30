import assert from "node:assert/strict";
import { afterEach, describe, it } from "node:test";
import type { AxiosAdapter, AxiosResponse } from "axios";
import { httpZauru } from "./httpZauru.js";
import {
  createWebAppTableRegistersBulk,
  updateWebAppTableRegistersBulk,
} from "./zauru-web-app-tables.js";

const originalAdapter = httpZauru.defaults.adapter;

afterEach(() => {
  httpZauru.defaults.adapter = originalAdapter;
});

const captureRequest = () => {
  let request: { method?: string; url?: string; data?: unknown } | undefined;
  const adapter: AxiosAdapter = async (config) => {
    request = {
      method: config.method,
      url: config.url,
      data:
        typeof config.data === "string" ? JSON.parse(config.data) : config.data,
    };
    return {
      data: { webapp_rows: [], count: 0 },
      status: 200,
      statusText: "OK",
      headers: {},
      config,
    } as AxiosResponse;
  };
  httpZauru.defaults.adapter = adapter;
  return () => request;
};

describe("webapp table bulk REST", () => {
  it("creates rows with one POST request and the Baculo bulk envelope", async () => {
    const captured = captureRequest();

    await createWebAppTableRegistersBulk(
      { Authorization: "Bearer token" },
      "123",
      [{ code: "A" }, { code: "B" }],
    );

    assert.deepEqual(captured(), {
      method: "post",
      url: "/apps/webapp_tables/123/webapp_rows/bulk.json",
      data: {
        webapp_rows: [{ data: { code: "A" } }, { data: { code: "B" } }],
      },
    });
  });

  it("updates rows with one PATCH request and partial data", async () => {
    const captured = captureRequest();

    await updateWebAppTableRegistersBulk<{ code: string; enabled: boolean }>(
      { Authorization: "Bearer token" },
      "123",
      [
        { id: 10, data: { enabled: false } },
        { id: 11, data: { code: "B" } },
      ],
    );

    assert.deepEqual(captured(), {
      method: "patch",
      url: "/apps/webapp_tables/123/webapp_rows/bulk.json",
      data: {
        webapp_rows: [
          { id: 10, data: { enabled: false } },
          { id: 11, data: { code: "B" } },
        ],
      },
    });
  });
});
