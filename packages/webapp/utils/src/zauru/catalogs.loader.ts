import { createElement, type ReactElement } from "react";
import type { LoaderFunction, Session } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import {
  get4pinosPoDiscountHistory,
  get4pinosSolicitudEliminacionPO,
  get4pinosWeightLimitPerBasket,
  getAgencies,
  getAllForms,
  getAuthorizationUpdateDiscountPO,
  getBookings,
  getCaseFormSubmissionsByCaseId,
  getCases,
  getCCPorcentajesDeRechazo,
  getClientCategories,
  getCurrencies,
  getEmployees,
  getFormsByDocumentType,
  getHeaders,
  getInvoiceFormSubmissionsByAgencyId,
  getInvoiceFormSubmissionsByInvoiceId,
  getInvoicesByAgencyId,
  getItems,
  getMotivosRechazo,
  getMyAgencyLotStocks,
  getMyCaseFormSubmissions,
  getPayeeCategories,
  getPayeeCategoriesByNotesMatch,
  getPayees,
  getPaymentMethods,
  getPaymentTerms,
  getPrintTemplates,
  getProviderCategories,
  getProviders,
  getSession,
  getSuggestedPrices,
} from "@zauru-sdk/services";
import type { AxiosUtilsResponse } from "@zauru-sdk/types";
import { getBitacorasPOMassive } from "./bitacora-edicion-masiva.utils.js";
import { getBundlesByLabCategory, getBundlesRecipByLabCategory } from "./bundles.utils.js";
import { getEmployeesByCurrentAgency, getEmployeesByLabAgency } from "./employees.utils.js";
import { getInvoicesByLabAgency } from "./invoices.utils.js";
import {
  getItemServicesByLabCategory,
  getItemsByLabCategory,
  getItemsByReceptionCategory,
  getLabItemCategories,
} from "./items.utils.js";
import {
  getClientesLaboratorio,
  TEXT_PAYEE_CATEGORY_NOTES_FOR_PRICE,
} from "./payees.utils.js";
import { getProgramaciones } from "./programaciones.utils.js";
import { getShipmentsToMyAgency } from "./shipments.utils.js";
import { getTemplates } from "./templates.utils.js";
import { getTipoMuestras } from "./tiposMuestra.utils.js";
import { getReceptionTypes } from "./webapp-tables.utils.js";

export type CatalogLoaderContext = {
  request: Request;
  session: Session;
  headers: Awaited<ReturnType<typeof getHeaders>>;
  url: URL;
  catalog: string;
  wheres: string[];
};

export type CatalogHandler = (
  ctx: CatalogLoaderContext,
) => Promise<AxiosUtilsResponse<unknown> | Response>;

const missingQueryParam = (param: string): Response => {
  console.warn({
    description: `No se envió ningún parámetro de ${param} a buscar`,
    title: "Ocurrió un error.",
    error: true,
    type: "error",
  });
  return Response.json({});
};

const catalogErrorPayload = (catalog: string, description: string) => ({
  [catalog]: [],
  error: true,
  type: "error",
  title: `Ocurrió un error al obtener el catálogo de ${catalog}!.`,
  description,
});

const unknownCatalogPayload = {
  description: "No se envió ningún parámetro de catálogo a buscar",
  title: "Ocurrió un error.",
  error: true,
  type: "error",
};

const sdkCatalogHandlers: Record<string, CatalogHandler> = {
  printTemplates: ({ session }) => getPrintTemplates(session),
  paymentMethods: ({ session }) => getPaymentMethods(session),
  invoiceFormSubmissions: ({ session, url }) => {
    const agency_id =
      url.searchParams.get("agency_id") ?? session.get("agency_id");
    return getInvoiceFormSubmissionsByAgencyId(session, agency_id);
  },
  payees: ({ session }) => getPayees(session),
  items: ({ session }) => getItems(session),
  payeesForLab: ({ session }) => getClientesLaboratorio(session),
  currencies: ({ session }) => getCurrencies(session),
  employees: ({ session }) => getEmployees(session),
  employeesByLab: ({ headers, session }) =>
    getEmployeesByLabAgency(headers, session),
  employeesByCurrentAgency: ({ session }) =>
    getEmployeesByCurrentAgency(session),
  shipmentsToMyAgency: ({ session }) => getShipmentsToMyAgency(session),
  allForms: ({ session, url }) => {
    const withSubmissions = url.searchParams.get("withSubmissions") === "true";
    return getAllForms(session, { withSubmissions });
  },
  invoiceForms: ({ session }) => getFormsByDocumentType(session, "invoice"),
  caseForms: ({ session }) => getFormsByDocumentType(session, "case"),
  paymentTerms: ({ session }) => getPaymentTerms(session),
  invoicesByLab: ({ headers, session }) =>
    getInvoicesByLabAgency(headers, session),
  invoicesByCurrentAgency: ({ session, url }) => {
    const tag_id = url.searchParams.get("tag_id") ?? undefined;
    const invoice_id = url.searchParams.get("invoice_id") ?? undefined;
    return getInvoicesByAgencyId(session, session.get("agency_id"), {
      tag_id,
      invoice_id,
    });
  },
  payeeCategoriesLabPrices: ({ session }) =>
    getPayeeCategoriesByNotesMatch(
      session,
      TEXT_PAYEE_CATEGORY_NOTES_FOR_PRICE,
    ),
  payeeCategories: ({ session }) => getPayeeCategories(session),
  receptionTypes: ({ headers, session }) => getReceptionTypes(headers, session),
  bitacoraRechazoMasivo: ({ headers, session }) =>
    getBitacorasPOMassive(headers, session),
  cases: ({ session, url }) => {
    const tag_id = url.searchParams.get("tag_id") ?? undefined;
    const assignedToMe = url.searchParams.get("assignedToMe") === "true";
    return getCases(session, {
      tag_id,
      ...(assignedToMe
        ? { responsible_id: Number(session.get("employee_id")) }
        : {}),
    });
  },
  myCases: ({ session }) =>
    getCases(session, {
      responsible_id: Number(session.get("employee_id")),
    }),
  myCaseFormSubmissions: ({ headers, session }) =>
    getMyCaseFormSubmissions(headers, session),
  tiposDeMuestra: ({ headers, session }) => getTipoMuestras(headers, session),
  myAgencyLotStocks: ({ session }) => getMyAgencyLotStocks(session),
  motivosRechazo: ({ headers, session }) => getMotivosRechazo(headers, session),
  ccPorcentajesDeRechazo: ({ headers, session }) =>
    getCCPorcentajesDeRechazo(headers, session),
  programaciones4pinos: ({ headers, session }) =>
    getProgramaciones(headers, session),
  solicitudesEliminacionPO: ({ headers, session }) =>
    get4pinosSolicitudEliminacionPO(headers, session),
  pesoMaximoPorCanasta: ({ headers, session }) =>
    get4pinosWeightLimitPerBasket(headers, session),
  poDiscountHistory: ({ headers, session }) =>
    get4pinosPoDiscountHistory(headers, session),
  authorizationUpdateDiscountPO: ({ headers, session }) =>
    getAuthorizationUpdateDiscountPO(headers, session),
  itemsByReception: ({ headers, session }) =>
    getItemsByReceptionCategory(headers, session),
  itemsByLab: ({ headers, session }) => getItemsByLabCategory(headers, session),
  itemServicesByLab: ({ headers, session }) =>
    getItemServicesByLabCategory(headers, session),
  itemCategoriesForLab: ({ headers, session }) =>
    getLabItemCategories(headers, session),
  bundlesRecipForLab: ({ headers, session }) =>
    getBundlesRecipByLabCategory(headers, session),
  bundlesForLab: ({ headers, session }) =>
    getBundlesByLabCategory(headers, session),
  templates: ({ headers, session }) => getTemplates(headers, session),
  bookings: ({ session, wheres }) => getBookings(session, wheres),
  suggestedPrices: ({ session, url }) => {
    const withItems = url.searchParams.get("withItems") === "true";
    const withItemCategories =
      url.searchParams.get("withItemCategories") === "true";
    return getSuggestedPrices(session, { withItems, withItemCategories });
  },
  providerCategories: ({ session }) => getProviderCategories(session),
  clientCategories: ({ session }) => getClientCategories(session),
  providers: ({ session }) => getProviders(session),
  agencies: ({ session }) => getAgencies(session),
  invoiceFormSubmissionsByAgencyId: async ({ session, url }) => {
    const agency_id = url.searchParams.get("agency_id");
    if (!agency_id) {
      return missingQueryParam("agency_id");
    }
    return getInvoiceFormSubmissionsByAgencyId(session, agency_id);
  },
  invoiceFormSubmissionsByInvoiceId: async ({ headers, session, url }) => {
    const withFiles = url.searchParams.get("withFiles") === "true";
    const invoiceId = url.searchParams.get("invoiceId");
    if (!invoiceId) {
      return missingQueryParam("invoiceId");
    }
    return getInvoiceFormSubmissionsByInvoiceId(
      headers,
      session,
      invoiceId,
      withFiles,
    );
  },
  caseFormSubmissionsByCaseId: async ({ headers, session, url }) => {
    const withFiles = url.searchParams.get("withFiles") === "true";
    const caseId = url.searchParams.get("caseId");
    if (!caseId) {
      return missingQueryParam("caseId");
    }
    return getCaseFormSubmissionsByCaseId(headers, session, caseId, withFiles);
  },
};

/**
 * Remix loader for `/api/catalogs`. Shared catalog names live in the SDK;
 * pass `extras` to add or override handlers for a single webapp.
 */
export function createCatalogsLoader(
  extras?: Record<string, CatalogHandler>,
): LoaderFunction {
  return async ({ request }) => {
    try {
      const cookie = request.headers.get("Cookie");
      const session = await getSession(cookie);

      if (!session.has("username")) {
        return redirect("/");
      }

      const headers = await getHeaders(cookie, session);
      const url = new URL(request.url);
      const catalog = url.searchParams.get("catalog") ?? "";
      const wheres =
        url.searchParams
          .get("wheres")
          ?.split("&")
          .map((where) => decodeURIComponent(where))
          .filter((where) => where !== "") ?? [];

      if (!catalog) {
        return Response.json(unknownCatalogPayload);
      }

      const handler = extras?.[catalog] ?? sdkCatalogHandlers[catalog];
      if (!handler) {
        return Response.json(unknownCatalogPayload);
      }

      const result = await handler({
        request,
        session,
        headers,
        url,
        catalog,
        wheres,
      });

      if (result instanceof Response) {
        return result;
      }

      if (result.error || !result.data) {
        return Response.json(
          catalogErrorPayload(catalog, `${result.userMsg ?? ""}`),
        );
      }

      return { [catalog]: result.data };
    } catch (error) {
      console.error(error);
      const catalog =
        new URL(request.url).searchParams.get("catalog") || "catalog";
      return catalogErrorPayload(catalog, `${error}`);
    }
  };
}

export function CatalogsRoute(): ReactElement {
  return createElement(
    "div",
    { style: { fontFamily: "system-ui, sans-serif", lineHeight: "1.4" } },
    "CATALOGS LOAD",
  );
}
