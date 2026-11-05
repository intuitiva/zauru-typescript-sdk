import assert from "node:assert/strict";
import { afterEach, describe, it } from "node:test";
import type { Session } from "@remix-run/node";
import type { AxiosAdapter, AxiosResponse } from "axios";
import { httpGraphQLAPI } from "./httpGraphQL.js";
import { httpZauru } from "./httpZauru.js";
import {
  createWebAppTableRegistersBulk,
  getRejectionWebAppTable,
  updateWebAppTableRegistersBulk,
} from "./zauru-web-app-tables.js";

const originalAdapter = httpZauru.defaults.adapter;
const originalGraphqlAdapter = httpGraphQLAPI.defaults.adapter;

afterEach(() => {
  httpZauru.defaults.adapter = originalAdapter;
  httpGraphQLAPI.defaults.adapter = originalGraphqlAdapter;
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

const sessionWithRejectionVars = {
  get: (key: string) => {
    if (key === "graphqlToken") {
      return {
        token: "test-token",
        expires: "2099-01-01T00:00:00.000Z",
      };
    }
    if (key === "variables") {
      return [
        { name: "recepciones_rejections_webapp_table_id", value: "5" },
        { name: "recepciones_rejection_types_webapp_table_id", value: "4" },
      ];
    }
    return undefined;
  },
  set: () => undefined,
  has: () => true,
} as unknown as Session;

const rejectZauruRest = () => {
  const adapter: AxiosAdapter = async (config) => {
    throw new Error(`REST should not be called: ${config.method} ${config.url}`);
  };
  httpZauru.defaults.adapter = adapter;
};

const captureGraphqlRequests = () => {
  const requests: { method?: string; query: string }[] = [];
  const adapter: AxiosAdapter = async (config) => {
    const payload =
      typeof config.data === "string" ? JSON.parse(config.data) : config.data;
    const query = String(payload?.query ?? "");
    requests.push({ method: config.method, query });

    const data = query.includes("webapp_tables")
      ? {
          data: {
            webapp_tables: [
              {
                id: 5,
                structure: {
                  Canastas: "int",
                  Razon_primaria: "string",
                },
              },
            ],
          },
        }
      : {
          data: {
            webapp_rows: [
              { id: 1, data: { Nombre: "Daño" }, created_at: "2026-01-01" },
              { id: 2, data: { Nombre: "Peso" }, created_at: "2026-01-02" },
            ],
          },
        };

    return {
      data,
      status: 200,
      statusText: "OK",
      headers: {},
      config,
    } as AxiosResponse;
  };
  httpGraphQLAPI.defaults.adapter = adapter;
  return () => requests;
};

describe("getRejectionWebAppTable", () => {
  it("When listing rejection types, it should query GraphQL instead of Zauru REST", async () => {
    rejectZauruRest();
    const captured = captureGraphqlRequests();

    const result = await getRejectionWebAppTable(
      {},
      sessionWithRejectionVars,
    );
    const requests = captured();

    assert.equal(result.error, false);
    assert.deepEqual(result.data?.rejection_select, [
      { value: "Daño", label: "Daño" },
      { value: "Peso", label: "Peso" },
    ]);
    assert.deepEqual(result.data?.webapp_table, {
      Canastas: "int",
      Razon_primaria: "string",
    });
    assert.equal(requests.length, 2);
    assert.equal(
      requests.every((request) => request.method === "post"),
      true,
    );
    assert.match(requests[0]?.query ?? "", /webapp_tables/);
    assert.match(requests[1]?.query ?? "", /webapp_rows/);
    assert.equal(
      requests.some((request) => /webapp_tables\/\d+/.test(request.query)),
      false,
    );
  });
});
