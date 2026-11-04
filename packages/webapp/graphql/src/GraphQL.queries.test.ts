import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  getInvoicesStringQuery,
  getPayeeByIdStringQuery,
  getPayeesStringQuery,
  getPaymentByIdStringQuery,
  getPurchaseOrdersBetweenDatesStringQuery,
  getShipmentsStringQuery,
  getWebAppRowsByWebAppTableIdStringQuery,
} from "./GraphQL.queries.js";

describe("getPayeeByIdStringQuery", () => {
  it("includes payee_category_id so price rules can match by programa", () => {
    const query = getPayeeByIdStringQuery(1689394);
    assert.match(query, /payees\s*\(where:\s*\{\s*id:\s*\{\s*_eq:\s*1689394/);
    assert.match(query, /payee_category_id/);
    assert.match(query, /payee_category\s*\{/);
  });
});

describe("getPayeesStringQuery", () => {
  it("selects active without filtering when no filters are passed", () => {
    const query = getPayeesStringQuery();
    assert.match(query, /\bactive\b/);
    assert.equal(/where:/.test(query), false);
  });

  it("filters by active and a non-empty id_number", () => {
    const query = getPayeesStringQuery({
      active: true,
      id_number_not_empty: true,
      id_number_not_null: true,
    });
    assert.match(query, /active:\s*\{\s*_eq:\s*true\s*\}/);
    assert.match(query, /id_number:\s*\{\s*_neq:\s*""\s*,\s*_is_null:\s*false\s*\}/);
  });
});

describe("getPurchaseOrdersBetweenDatesStringQuery", () => {
  it("does not request lock_version; Hasura purchase_orders has no such field", () => {
    const query = getPurchaseOrdersBetweenDatesStringQuery(
      "2026-11-01",
      "2026-11-03",
      {
        excludeVoided: true,
        betweenIssueDate: true,
        withPODetails: true,
      },
    );
    assert.equal(/lock_version/.test(query), false);
    assert.match(query, /purchase_orders/);
  });

  it("filters nested lot_stocks by agency and available quantity", () => {
    const query = getPurchaseOrdersBetweenDatesStringQuery(
      "2026-11-01",
      "2026-11-03",
      {
        excludeAgencyId: 10,
        lotStockAgencyId: 22,
        lotStockAvailableGt: 0,
        skipDateFilter: true,
        excludeVoided: true,
        lotItemIdExclusion: 99,
      },
    );
    assert.match(query, /agency_id:\s*\{\s*_neq:\s*10\s*\}/);
    assert.match(
      query,
      /lots:\s*\{\s*item_id:\s*\{\s*_neq:\s*99\s*\},\s*lot_stocks:\s*\{\s*agency_id:\s*\{\s*_eq:\s*22\s*\},\s*available:\s*\{\s*_gt:\s*0\s*\}\s*\}/,
    );
    assert.equal(/issue_date:/.test(query), false);
    assert.equal(/created_at:\s*\{\s*_gte:/.test(query), false);
  });

  it("selects shipment movement fields when withShipmentPurchaseOrders is true", () => {
    const query = getPurchaseOrdersBetweenDatesStringQuery(
      "2026-11-01",
      "2026-11-03",
      {
        withShipmentPurchaseOrders: true,
      },
    );
    assert.match(query, /shipment_purchase_orders\s*\{/);
    assert.match(query, /\bmemo\b/);
    assert.match(query, /\bvoided\b/);
    assert.match(query, /\bshipped\b/);
    assert.match(query, /\bdelivered\b/);
    assert.match(query, /\breturned\b/);
    assert.match(query, /\bcreated_at\b/);
  });
});

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

describe("getPaymentByIdStringQuery", () => {
  it("reads one payment with its detail ids", () => {
    const query = getPaymentByIdStringQuery(9);
    assert.match(query, /payments\s*\(/);
    assert.match(query, /id:\s*\{\s*_eq:\s*9\s*\}/);
    assert.match(query, /payment_details\s*\{/);
    assert.match(query, /\binvoice_id\b/);
    assert.match(query, /\bamount\b/);
  });

  it("rejects a non-numeric payment id", () => {
    assert.throws(() => getPaymentByIdStringQuery(1.5), /Invalid payment id/);
  });
});

describe("getInvoicesStringQuery", () => {
  it("selects due and paginates unpaid issued invoices", () => {
    const query = getInvoicesStringQuery({
      voided: false,
      paid: false,
      issued: true,
      lastId: 10,
      limit: 500,
      payeeIds: [1190849, 2],
    });
    assert.match(query, /invoices\s*\(/);
    assert.match(query, /\bdue\b/);
    assert.match(query, /payee_id/);
    assert.match(query, /voided:\s*\{\s*_eq:\s*false\s*\}/);
    assert.match(query, /paid:\s*\{\s*_eq:\s*false\s*\}/);
    assert.match(query, /issued:\s*\{\s*_eq:\s*true\s*\}/);
    assert.match(query, /id:\s*\{\s*_gt:\s*10\s*\}/);
    assert.match(query, /payee_id:\s*\{\s*_in:\s*\[1190849,\s*2\]\s*\}/);
    assert.match(query, /limit:\s*500/);
    assert.match(query, /order_by:\s*\{\s*id:\s*asc\s*\}/);
  });

  it("rejects a non-numeric payee id", () => {
    assert.throws(
      () => getInvoicesStringQuery({ payeeIds: [1.5] }),
      /Invalid payee id/,
    );
  });
});

describe("getWebAppRowsByWebAppTableIdStringQuery", () => {
  it("paginates with idLt when order is id desc", () => {
    const query = getWebAppRowsByWebAppTableIdStringQuery(227, {
      limit: 1000,
      idLt: 50,
    });
    assert.match(query, /webapp_table_id:\s*\{\s*_eq:\s*227\s*\}/);
    assert.match(query, /id:\s*\{\s*_lt:\s*50\s*\}/);
    assert.match(query, /limit:\s*1000/);
    assert.match(query, /order_by:\s*\{\s*id:\s*desc\s*\}/);
  });
});
