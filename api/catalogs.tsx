import type { LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { CATALOGS_NAMES } from "@zauru-sdk/redux";
import {
  getAgencies,
  getAllForms,
  getBookings,
  getClientCategories,
  getCurrencies,
  getFormsByDocumentType,
  getHeaders,
  getInvoiceFormSubmissionsByAgencyId,
  getInvoiceFormSubmissionsByInvoiceId,
  getItems,
  getMotivosRechazo,
  getMyAgencyLotStocks,
  getMyCaseFormSubmissions,
  getPayeeCategories,
  getPayeeCategoriesByNotesMatch,
  getPayees,
  getPaymentMethods,
  getEmployees,
  getPaymentTerms,
  getPrintTemplates,
  getProviderCategories,
  getProviders,
  getSession,
  getSuggestedPrices,
  getInvoicesByAgencyId,
} from "@zauru-sdk/services";
import { AxiosUtilsResponse } from "@zauru-sdk/types";
import {
  TEXT_PAYEE_CATEGORY_NOTES_FOR_PRICE,
  getBitacorasPOMassive,
  getBundlesByLabCategory,
  getBundlesRecipByLabCategory,
  getClientesLaboratorio,
  getEmployeesByCurrentAgency,
  getEmployeesByLabAgency,
  getInvoicesByLabAgency,
  getItemServicesByLabCategory,
  getItemsByLabCategory,
  getItemsByReceptionCategory,
  getLabItemCategories,
  getMyCases,
  getReceptionTypes,
  getShipmentsToMyAgency,
  getTemplates,
  getTipoMuestras,
} from "@zauru-sdk/utils";

export const loader: LoaderFunction = async ({ request }) => {
  try {
    const cookie = request.headers.get("Cookie");
    const session = await getSession(cookie);

    if (!session.has("username")) {
      return redirect("/");
    }

    const headers = await getHeaders(cookie, session);
    const url = new URL(request.url);

    const catalog = url.searchParams.get("catalog") as CATALOGS_NAMES;

    //Wheres personalizados
    const wheresParam = url.searchParams.get("wheres");
    let wheresArray =
      wheresParam?.split("&")?.map((where) => decodeURIComponent(where)) ?? [];
    wheresArray = wheresArray.filter((x) => x !== "");

    if (!catalog) {
      return Response.json({
        description: "No se envió ningún parámetro de catálogo a buscar",
        title: "Ocurrió un error.",
        error: true,
        type: "error",
      });
    }

    function handleError(response: AxiosUtilsResponse<any>, catalog: string) {
      return Response.json({
        [catalog]: [],
        error: true,
        type: "error",
        title: `Ocurrió un error al obtener el catálogo de ${catalog}!.`,
        description: `${response.userMsg}`,
      });
    }

    let response;

    switch (catalog) {
      case "printTemplates":
        response = await getPrintTemplates(session);
        break;

      case "paymentMethods":
        response = await getPaymentMethods(session);
        break;

      case "invoiceFormSubmissions":
        const agency_id =
          url.searchParams.get("agency_id") ?? session.get("agency_id");
        response = await getInvoiceFormSubmissionsByAgencyId(
          session,
          agency_id
        );
        break;

      case "payees":
        response = await getPayees(session);
        break;

      case "items":
        response = await getItems(session);
        break;

      case "payeesForLab":
        response = await getClientesLaboratorio(session);
        break;

      case "currencies":
        response = await getCurrencies(session);
        break;

      case "employees":
        response = await getEmployees(session);
        break;

      case "employeesByLab":
        response = await getEmployeesByLabAgency(headers, session);
        break;

      case "employeesByCurrentAgency":
        response = await getEmployeesByCurrentAgency(session);
        break;

      case "shipmentsToMyAgency":
        response = await getShipmentsToMyAgency(session);
        break;

      case "allForms": {
        const withSubmissions =
          url.searchParams.get("withSubmissions") === "true";
        response = await getAllForms(session, {
          withSubmissions: withSubmissions,
        });
        break;
      }

      case "invoiceForms":
        response = await getFormsByDocumentType(session, "invoice");
        break;

      case "caseForms":
        response = await getFormsByDocumentType(session, "case");
        break;

      case "paymentTerms":
        response = await getPaymentTerms(session);
        break;

      case "invoicesByLab":
        response = await getInvoicesByLabAgency(headers, session);
        break;

      case "invoicesByCurrentAgency":
        const tag_id = url.searchParams.get("tag_id") ?? undefined;
        const invoice_id = url.searchParams.get("invoice_id") ?? undefined;
        response = await getInvoicesByAgencyId(
          session,
          session.get("agency_id"),
          { tag_id, invoice_id }
        );
        break;

      case "payeeCategoriesLabPrices":
        response = await getPayeeCategoriesByNotesMatch(
          session,
          TEXT_PAYEE_CATEGORY_NOTES_FOR_PRICE
        );
        break;

      case "payeeCategories":
        response = await getPayeeCategories(session);
        break;

      case "receptionTypes":
        response = await getReceptionTypes(headers, session);
        break;

      case "bitacoraRechazoMasivo":
        response = await getBitacorasPOMassive(headers, session);
        break;

      case "myCases":
        response = await getMyCases(session, wheresArray);
        break;

      case "myCaseFormSubmissions":
        response = await getMyCaseFormSubmissions(headers, session);
        break;

      case "tiposDeMuestra":
        response = await getTipoMuestras(headers, session);
        break;

      case "myAgencyLotStocks":
        response = await getMyAgencyLotStocks(session);
        break;

      case "motivosRechazo":
        response = await getMotivosRechazo(headers, session);
        break;

      case "itemsByReception":
        response = await getItemsByReceptionCategory(headers, session);
        break;

      case "itemsByLab":
        response = await getItemsByLabCategory(headers, session);
        break;

      case "itemServicesByLab":
        response = await getItemServicesByLabCategory(headers, session);
        break;

      case "itemCategoriesForLab":
        response = await getLabItemCategories(headers, session);
        break;

      case "bundlesRecipForLab":
        response = await getBundlesRecipByLabCategory(headers, session);
        break;

      case "bundlesForLab":
        response = await getBundlesByLabCategory(headers, session);
        break;

      case "templates":
        response = await getTemplates(headers, session);
        break;

      case "bookings":
        response = await getBookings(session, wheresArray);
        break;

      case "suggestedPrices": {
        const withItems = url.searchParams.get("withItems") === "true";

        const withItemCategories =
          url.searchParams.get("withItemCategories") === "true";

        response = await getSuggestedPrices(session, {
          withItems,
          withItemCategories,
        });
        break;
      }

      case "providerCategories":
        response = await getProviderCategories(session);
        break;

      case "clientCategories":
        response = await getClientCategories(session);
        break;

      case "providers":
        response = await getProviders(session);
        break;

      case "agencies":
        response = await getAgencies(session);
        break;

      case "invoiceFormSubmissionsByAgencyId": {
        const agency_id = url.searchParams.get("agency_id");
        if (!agency_id) {
          console.warn({
            description: "No se envió ningún parámetro de agency_id a buscar",
            title: "Ocurrió un error.",
            error: true,
            type: "error",
          });
          return Response.json({});
        }
        response = await getInvoiceFormSubmissionsByAgencyId(
          session,
          agency_id
        );
        break;
      }

      case "invoiceFormSubmissionsByInvoiceId": {
        const withFiles = url.searchParams.get("withFiles") === "true";
        const invoiceId = url.searchParams.get("invoiceId");
        if (!invoiceId) {
          console.warn({
            description: "No se envió ningún parámetro de invoiceId a buscar",
            title: "Ocurrió un error.",
            error: true,
            type: "error",
          });
          return Response.json({});
        }
        response = await getInvoiceFormSubmissionsByInvoiceId(
          headers,
          session,
          invoiceId,
          withFiles
        );
        break;
      }

      default:
        return Response.json({
          description: "No se envió ningún parámetro de catálogo a buscar",
          title: "Ocurrió un error.",
          error: true,
          type: "error",
        });
    }

    if (response.error || !response.data) {
      return handleError(response, catalog);
    }

    return {
      [catalog]: response.data,
    };
  } catch (error) {
    console.error(error);

    const url = new URL(request.url);
    const catalog = url.searchParams.get("catalog") || "catalog";
    return {
      [catalog]: [],
      error: true,
      type: "error",
      title: `Ocurrió un error al obtener el catálogo de ${catalog}!.`,
      description: `${error}`,
    };
  }
};

export default function CatalogsRoute() {
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.4" }}>
      CATALOGS LOAD
    </div>
  );
}
