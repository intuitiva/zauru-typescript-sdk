import { useFetcher } from "@remix-run/react";
import { useEffect, useState } from "react";
import { AlertType, showAlert } from "./components/index.js";
import type {
  AgencyGraphQL,
  BitacoraPOMassive,
  BundleGraphQL,
  CaseGraphQL,
  CurrencyGraphQL,
  EmployeeGraphQL,
  FormGraphQL,
  InvoiceGraphQL,
  ItemCategoryGraphQL,
  ItemGraphQL,
  LotStockGraphQL,
  MotivoRechazo,
  PayeeCategoryGraphQL,
  PayeeGraphQL,
  PaymentTermGraphQL,
  ReceptionType,
  ShipmentGraphQL,
  SubmissionCasesGraphQL,
  SubmissionInvoicesGraphQL,
  SuggestedPriceGraphQL,
  Template,
  TipoMuestra,
  WebAppRowGraphQL,
  PrintTemplateGraphQL,
  PaymentMethodGraphQL,
} from "@zauru-sdk/types";
import {
  CATALOGS_NAMES,
  ONLINE_CATALOGS_NAMES,
  ReduxParamsConfig,
  catalogsFetchStart,
  catalogsFetchSuccess,
  useAppDispatch,
  useAppSelector,
} from "@zauru-sdk/redux";

type CatalogType<T> = {
  data: T[];
  loading: boolean;
};

const useApiCatalog = <T>(
  CATALOG_NAME: CATALOGS_NAMES | ONLINE_CATALOGS_NAMES,
  otherParams?: { [key: string]: string }
): CatalogType<T> => {
  const fetcher = useFetcher<
    | {
        title: string;
        description: string;
        type: AlertType;
      }
    | { [key: string]: T[] }
  >();
  const [data, setData] = useState<CatalogType<T>>({
    data: [],
    loading: true,
  });

  useEffect(() => {
    if (fetcher.data?.title) {
      showAlert({
        description: fetcher.data?.description?.toString(),
        title: fetcher.data?.title?.toString(),
        type: fetcher.data?.type?.toString() as AlertType,
      });
    }
  }, [fetcher.data]);

  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data != null) {
      const receivedData = fetcher.data as { [key: string]: T[] };
      if (receivedData) {
        setData({ data: receivedData[CATALOG_NAME], loading: false });
      }
    }
  }, [fetcher, CATALOG_NAME]);

  useEffect(() => {
    try {
      setData({ ...data, loading: true });
      // Convert otherParams to query string
      const paramsString = otherParams
        ? Object.entries(otherParams)
            .map(([key, value]) => `${key}=${value}`)
            .join("&")
        : "";

      const url = `/api/catalogs?catalog=${CATALOG_NAME}${
        paramsString ? `&${paramsString}` : ""
      }`;

      fetcher.load(url);
    } catch (ex) {
      showAlert({
        type: "error",
        title: `Ocurrió un error al cargar el catálogo: ${CATALOG_NAME}.`,
        description: "Error: " + ex,
      });
    }
  }, []);

  return data;
};

/**
 * 
 * @param CATALOG_NAME 
 * @param param1 
 * @returns 
 * 
 * otherParams usage example:
 * 
 * otherParams: {
      includeDiscounts: "true",
    }
 */
const useGetReduxCatalog = <T>(
  CATALOG_NAME: CATALOGS_NAMES,
  { online = false, wheres = [], otherParams }: ReduxParamsConfig = {}
): CatalogType<T> => {
  const fetcher = useFetcher<
    | {
        title: string;
        description: string;
        type: AlertType;
      }
    | { [key: string]: T[] }
  >();
  const dispatch = useAppDispatch();
  const catalogData = useAppSelector((state) => state.catalogs[CATALOG_NAME]);
  const [data, setData] = useState<CatalogType<T>>({
    data: catalogData?.data?.length ? (catalogData.data as T[]) : [],
    loading: catalogData.loading,
  });

  useEffect(() => {
    if (fetcher.data?.description) {
      showAlert({
        description: fetcher.data?.description?.toString(),
        title: fetcher.data?.title?.toString(),
        type: fetcher.data?.type?.toString() as AlertType,
      });
    }
  }, [fetcher.data]);

  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data != null) {
      const receivedData = fetcher.data as { [key: string]: T[] };
      if (receivedData) {
        setData({ data: receivedData[CATALOG_NAME], loading: false });
        dispatch(
          catalogsFetchSuccess({
            name: CATALOG_NAME,
            data: receivedData[CATALOG_NAME],
          })
        );
      }
    }
  }, [fetcher, dispatch, CATALOG_NAME]);

  useEffect(() => {
    if (catalogData?.data?.length <= 0 || catalogData?.reFetch || online) {
      try {
        setData({ ...data, loading: true });
        dispatch(catalogsFetchStart(CATALOG_NAME));
        // Convierte cada elemento del array a una cadena codificada para URL
        const encodedWheres = wheres.map((where) => encodeURIComponent(where));
        // Une los elementos codificados con '&'
        const wheresQueryParam = encodedWheres.join("&");

        // Convert otherParams to query string
        const paramsString = otherParams
          ? Object.entries(otherParams)
              .map(([key, value]) => `${key}=${value}`)
              .join("&")
          : "";

        fetcher.load(
          `/api/catalogs?catalog=${CATALOG_NAME}&wheres=${wheresQueryParam}${
            paramsString ? `&${paramsString}` : ""
          }`
        );
      } catch (ex) {
        showAlert({
          type: "error",
          title: `Ocurrió un error al cargar el catálogo: ${CATALOG_NAME}.`,
          description: "Error: " + ex,
        });
      }
    }
  }, []);

  return data;
};

/**
 *
 * ======================= HOOKS
 */
export const useGetItems = (
  config?: ReduxParamsConfig
): {
  loading: boolean;
  data: ItemGraphQL[];
} => useGetReduxCatalog<ItemGraphQL>("items", config);

export const useGetItemsByReception = (
  config?: ReduxParamsConfig
): {
  loading: boolean;
  data: ItemGraphQL[];
} => useGetReduxCatalog<ItemGraphQL>("itemsByReception", config);

export const useGetItemsByLab = (
  config?: ReduxParamsConfig
): {
  loading: boolean;
  data: ItemGraphQL[];
} => useGetReduxCatalog<ItemGraphQL>("itemsByLab", config);

export const useGetMyAgencyLotStocks = (
  config?: ReduxParamsConfig
): {
  loading: boolean;
  data: LotStockGraphQL[];
} => useGetReduxCatalog<LotStockGraphQL>("myAgencyLotStocks", config);

export const useGetItemServicesByLab = (
  config?: ReduxParamsConfig
): {
  loading: boolean;
  data: ItemGraphQL[];
} => useGetReduxCatalog<ItemGraphQL>("itemServicesByLab", config);

export const useGetItemCategoriesForLab = (
  config?: ReduxParamsConfig
): {
  loading: boolean;
  data: ItemCategoryGraphQL[];
} => useGetReduxCatalog<ItemCategoryGraphQL>("itemCategoriesForLab", config);

export const useGetBookings = (
  config?: ReduxParamsConfig
): {
  loading: boolean;
  data: ShipmentGraphQL[];
} => useGetReduxCatalog<ShipmentGraphQL>("bookings", config);

export const useGetTemplates = (
  config?: ReduxParamsConfig
): {
  loading: boolean;
  data: WebAppRowGraphQL<Template>[];
} => useGetReduxCatalog<WebAppRowGraphQL<Template>>("templates", config);

export const useGetPayeeCategories = (
  config?: ReduxParamsConfig
): {
  loading: boolean;
  data: PayeeCategoryGraphQL[];
} => useGetReduxCatalog<PayeeCategoryGraphQL>("payeeCategories", config);

export const useGetPayeeCategoriesLabPrices = (
  config: {
    withPriceListIdNull: boolean;
  } = { withPriceListIdNull: false }
): {
  loading: boolean;
  data: PayeeCategoryGraphQL[];
} => {
  const data = useGetReduxCatalog<PayeeCategoryGraphQL>(
    "payeeCategoriesLabPrices"
  );

  let tempData = data.data;
  if (!config.withPriceListIdNull) {
    tempData = data.data.filter((x) => x.price_list_id);
  }

  return { ...data, data: tempData };
};

export const useGetBundlesRecipForLab = (
  config?: ReduxParamsConfig
): {
  loading: boolean;
  data: BundleGraphQL[];
} => useGetReduxCatalog<BundleGraphQL>("bundlesRecipForLab", config);

export const useGetBundlesForLab = (
  config?: ReduxParamsConfig
): {
  loading: boolean;
  data: BundleGraphQL[];
} => useGetReduxCatalog<BundleGraphQL>("bundlesForLab", config);

export const useGetCurrencies = (
  config?: ReduxParamsConfig
): {
  loading: boolean;
  data: CurrencyGraphQL[];
} => useGetReduxCatalog<CurrencyGraphQL>("currencies", config);

export const useGetReceptionTypes = (
  config?: ReduxParamsConfig
): {
  loading: boolean;
  data: WebAppRowGraphQL<ReceptionType>[];
} =>
  useGetReduxCatalog<WebAppRowGraphQL<ReceptionType>>("receptionTypes", config);

export const useGetProviders = (
  config?: ReduxParamsConfig
): {
  loading: boolean;
  data: PayeeGraphQL[];
} => useGetReduxCatalog<PayeeGraphQL>("providers", config);

export const useGetMyCases = (
  config?: ReduxParamsConfig
): {
  loading: boolean;
  data: CaseGraphQL[];
} => useGetReduxCatalog<CaseGraphQL>("myCases", config);

export const useGetProviderCategories = (
  config?: ReduxParamsConfig
): {
  loading: boolean;
  data: PayeeCategoryGraphQL[];
} => useGetReduxCatalog<PayeeCategoryGraphQL>("providerCategories", config);

export const useGetClientCategories = (
  config?: ReduxParamsConfig
): {
  loading: boolean;
  data: PayeeCategoryGraphQL[];
} => useGetReduxCatalog<PayeeCategoryGraphQL>("clientCategories", config);

export const useGetPayees = (
  config?: ReduxParamsConfig
): {
  loading: boolean;
  data: PayeeGraphQL[];
} => useGetReduxCatalog<PayeeGraphQL>("payees", config);

export const useGetPayeesForLab = (
  config?: ReduxParamsConfig
): {
  loading: boolean;
  data: PayeeGraphQL[];
} => useGetReduxCatalog<PayeeGraphQL>("payeesForLab", config);

export const useGetPrintTemplates = (
  config?: ReduxParamsConfig
): {
  loading: boolean;
  data: PrintTemplateGraphQL[];
} => useGetReduxCatalog<PrintTemplateGraphQL>("printTemplates", config);

export const useGetAgencies = (
  config?: ReduxParamsConfig
): {
  loading: boolean;
  data: AgencyGraphQL[];
} => useGetReduxCatalog<AgencyGraphQL>("agencies", config);

export const useGetSuggestedPrices = (
  config?: ReduxParamsConfig
): {
  loading: boolean;
  data: SuggestedPriceGraphQL[];
} => useGetReduxCatalog<SuggestedPriceGraphQL>("suggestedPrices", config);

export const useGetPaymentTerms = (
  config?: ReduxParamsConfig
): {
  loading: boolean;
  data: PaymentTermGraphQL[];
} => useGetReduxCatalog<PaymentTermGraphQL>("paymentTerms", config);

export const useGetPaymentMethods = (
  config?: ReduxParamsConfig
): {
  loading: boolean;
  data: PaymentMethodGraphQL[];
} => useGetReduxCatalog<PaymentMethodGraphQL>("paymentMethods", config);

export const useGetEmployeesByLab = (
  config?: ReduxParamsConfig
): {
  loading: boolean;
  data: EmployeeGraphQL[];
} => useGetReduxCatalog<EmployeeGraphQL>("employeesByLab", config);

export const useGetEmployeesByCurrentAgency = (
  config?: ReduxParamsConfig
): {
  loading: boolean;
  data: EmployeeGraphQL[];
} => useGetReduxCatalog<EmployeeGraphQL>("employeesByCurrentAgency", config);

export const useGetEmployees = (
  config?: ReduxParamsConfig
): {
  loading: boolean;
  data: EmployeeGraphQL[];
} => useGetReduxCatalog<EmployeeGraphQL>("employees", config);

export const useGetShipmentsToMyAgency = (
  config?: ReduxParamsConfig
): {
  loading: boolean;
  data: ShipmentGraphQL[];
} => useGetReduxCatalog<ShipmentGraphQL>("shipmentsToMyAgency", config);

export const useGetInvoicesByLab = (
  config?: ReduxParamsConfig
): {
  loading: boolean;
  data: InvoiceGraphQL[];
} => useGetReduxCatalog<InvoiceGraphQL>("invoicesByLab", config);

export const useGetTiposDeMuestra = (
  config?: ReduxParamsConfig
): {
  loading: boolean;
  data: WebAppRowGraphQL<TipoMuestra>[];
} =>
  useGetReduxCatalog<WebAppRowGraphQL<TipoMuestra>>("tiposDeMuestra", config);

export const useGetMotivosDeRechazo = (
  config?: ReduxParamsConfig
): {
  loading: boolean;
  data: WebAppRowGraphQL<MotivoRechazo>[];
} =>
  useGetReduxCatalog<WebAppRowGraphQL<MotivoRechazo>>("motivosRechazo", config);

export const useGetBitacoraRechazoMasivo = (
  config?: ReduxParamsConfig
): {
  loading: boolean;
  data: WebAppRowGraphQL<BitacoraPOMassive>[];
} =>
  useGetReduxCatalog<WebAppRowGraphQL<BitacoraPOMassive>>(
    "bitacoraRechazoMasivo",
    config
  );

export const useGetAllForms = (
  config?: ReduxParamsConfig
): {
  loading: boolean;
  data: FormGraphQL[];
} => {
  const data = useGetReduxCatalog<FormGraphQL>("allForms", config);

  // Filtrar los registros para obtener sólo los de la versión más alta.
  const groupedByVersion = (data.data || []).reduce((acc, record) => {
    const zid = record.zid;

    if (!acc[zid]) {
      acc[zid] = record;
    }

    return acc;
  }, {} as { [key: string]: FormGraphQL });

  const latestVersionRecords = Object.values(groupedByVersion);

  return {
    loading: data.loading,
    data: latestVersionRecords.filter((x) => x.active),
  };
};

export const useGetInvoiceForms = (
  config?: ReduxParamsConfig
): {
  loading: boolean;
  data: FormGraphQL[];
} => {
  const data = useGetReduxCatalog<FormGraphQL>("invoiceForms", config);

  // Filtrar los registros para obtener sólo los de la versión más alta.
  const groupedByVersion = (data.data || []).reduce((acc, record) => {
    const zid = record.zid;

    if (!acc[zid]) {
      acc[zid] = record;
    }

    return acc;
  }, {} as { [key: string]: FormGraphQL });

  const latestVersionRecords = Object.values(groupedByVersion);

  return {
    loading: data.loading,
    data: latestVersionRecords.filter((x) => x.active),
  };
};

export const useGetCaseForms = (
  config?: ReduxParamsConfig
): {
  loading: boolean;
  data: FormGraphQL[];
} => {
  const data = useGetReduxCatalog<FormGraphQL>("caseForms", config);

  // Filtrar los registros para obtener sólo el primero de cada zid.
  const firstRecordByZid = (data.data || []).reduce((acc, record) => {
    const zid = record.zid;

    if (!acc[zid]) {
      acc[zid] = record;
    }

    return acc;
  }, {} as { [key: string]: FormGraphQL });

  const firstRecords = Object.values(firstRecordByZid);

  return {
    loading: data.loading,
    data: firstRecords.filter((x) => x.active),
  };
};

export const useGetInvoiceFormSubmissionsByAgencyId = (
  agency_id: number | string
): {
  loading: boolean;
  data: SubmissionInvoicesGraphQL[];
} => {
  const data = useApiCatalog<SubmissionInvoicesGraphQL>(
    "invoiceFormSubmissionsByAgencyId",
    {
      agency_id: `${agency_id}`,
    }
  );
  // Filtrar los registros para obtener sólo los de la versión más alta.
  const groupedByVersion = (data.data || []).reduce((acc, record) => {
    const zid = record.settings_form_submission.zid;

    if (!acc[zid]) {
      acc[zid] = record;
    }

    return acc;
  }, {} as { [key: string]: SubmissionInvoicesGraphQL });

  const latestVersionRecords = Object.values(groupedByVersion);

  return {
    loading: data.loading,
    data: latestVersionRecords,
  };
};

export const useGetMyCaseFormSubmissions = (
  config?: ReduxParamsConfig
): {
  loading: boolean;
  data: SubmissionCasesGraphQL[];
} => {
  const data = useGetReduxCatalog<SubmissionCasesGraphQL>(
    "myCaseFormSubmissions",
    config
  );
  // Filtrar los registros para obtener sólo los de la versión más alta.
  const groupedByVersion = (data.data || []).reduce((acc, record) => {
    const zid = record.settings_form_submission.zid;

    if (!acc[zid]) {
      acc[zid] = record;
    }

    return acc;
  }, {} as { [key: string]: SubmissionCasesGraphQL });

  const latestVersionRecords = Object.values(groupedByVersion);

  return {
    loading: data.loading,
    data: latestVersionRecords,
  };
};

export const useGetInvoiceFormSubmissionsByInvoiceId = (
  invoice_id: number | string
): {
  loading: boolean;
  data: SubmissionInvoicesGraphQL[];
} => {
  const data = useApiCatalog<SubmissionInvoicesGraphQL>(
    "invoiceFormSubmissionsByInvoiceId",
    {
      invoice_id: `${invoice_id}`,
    }
  );

  // Filtrar los registros para obtener sólo los de la versión más alta.
  const groupedByVersion = (data.data || []).reduce((acc, record) => {
    const zid = record.settings_form_submission.zid;

    if (!acc[zid]) {
      acc[zid] = record;
    }

    return acc;
  }, {} as { [key: string]: SubmissionInvoicesGraphQL });

  const latestVersionRecords = Object.values(groupedByVersion);

  return {
    loading: data.loading,
    data: latestVersionRecords,
  };
};
