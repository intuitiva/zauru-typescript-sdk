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
  CCPorcentajeRechazo,
} from "@zauru-sdk/types";
import {
  CATALOGS_NAMES,
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

type FetcherErrorType = {
  error?: boolean;
  title?: string;
  description?: string;
  type?: AlertType;
};

type CatalogsData<T> = {
  [key: string]: T[];
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
export function useGetReduxCatalog<T>(
  CATALOG_NAME: CATALOGS_NAMES,
  { online = false, wheres = [], otherParams }: ReduxParamsConfig = {}
): CatalogType<T> {
  const dispatch = useAppDispatch();
  const fetcher = useFetcher<FetcherErrorType | CatalogsData<T>>();
  const [fetchTriggered, setFetchTriggered] = useState(false);

  const catalogData = useAppSelector((state) => state.catalogs[CATALOG_NAME]);
  // Verifica si ya tenemos algo en Redux
  const hasLocalData = Boolean(catalogData?.data?.length);

  const [data, setData] = useState<CatalogType<T>>({
    data: hasLocalData ? (catalogData.data as T[]) : [],
    loading: false,
  });

  try {
    /**
     * Efecto que decide si llamar o no a la API.
     *
     * Lógica:
     * - Si `online: true`, forzamos el fetch.
     * - Si `reFetch: true`, también forzamos el fetch.
     * - Si `online: false` y SÍ tenemos data local, NO hacemos fetch (solo mostramos lo que hay).
     * - Si `online: false` y NO hay data local, SÍ hacemos fetch (porque no hay nada que mostrar).
     */
    useEffect(() => {
      const mustFetch = online || catalogData?.reFetch || !hasLocalData;

      if (mustFetch) {
        setData((prev) => ({ ...prev, loading: true }));
        dispatch(catalogsFetchStart(CATALOG_NAME));

        // Construimos el query para `wheres` y `otherParams`
        const encodedWheres = (wheres || []).map((where) =>
          encodeURIComponent(where)
        );
        const wheresQueryParam = encodedWheres.join("&");

        const paramsString = otherParams
          ? Object.entries(otherParams)
              .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
              .join("&")
          : "";

        const queryStringParts = [];
        if (wheresQueryParam)
          queryStringParts.push(`wheres=${wheresQueryParam}`);
        if (paramsString) queryStringParts.push(paramsString);

        const queryString = queryStringParts.length
          ? `&${queryStringParts.join("&")}`
          : "";

        // Disparamos la carga a través de fetcher
        try {
          setFetchTriggered(true);
          fetcher.load(`/api/catalogs?catalog=${CATALOG_NAME}${queryString}`);
        } catch (error) {
          // Si hay datos locales, mostramos los datos locales
          if (hasLocalData) {
            console.error(
              "Hubo un error pero hay datos locales en la consulta de",
              CATALOG_NAME,
              " Error: ",
              error
            );
            setData({
              data: catalogData?.data || [],
              loading: false,
            });
          } else {
            console.error(
              "Hubo un error y no hay datos locales en la consulta de",
              CATALOG_NAME,
              " Error: ",
              error
            );
            showAlert({
              type: "error",
              title: "Error al cargar el catálogo",
              description: `Error al cargar el catálogo ${CATALOG_NAME}, por favor intente nuevamente. Error: ${error}`,
            });
          }
        }
      } else {
        // Si no vamos a hacer fetch, asegurarnos de que loading esté en false
        // y mantener lo que ya tengamos en Redux
        setData({
          data: catalogData?.data || [],
          loading: false,
        });
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [online, catalogData?.reFetch, hasLocalData]);

    /**
     * Efecto que observa la finalización del fetch (fetcher.state === "idle")
     * y decide qué hacer con la data o error recibidos.
     */
    useEffect(() => {
      // Solo ejecuto la lógica si ya disparé al menos un fetch
      if (!fetchTriggered) return;
      // Cuando fetcher se pone en "idle", significa que ya terminó la petición.
      if (fetcher.state === "idle") {
        // Caso: tenemos algo en fetcher.data
        if (fetcher.data) {
          const possibleError = fetcher.data as FetcherErrorType;
          const possibleData = fetcher.data as CatalogsData<T>;

          // Si es un error "clásico", lo manejamos
          if (possibleError?.error) {
            // Pero OJO: si ya teníamos datos locales, no mostramos error "fatal" para no romper el fallback
            if (hasLocalData) {
              console.log(
                "Hay error en la respuesta pero hay datos locales en la consulta de",
                CATALOG_NAME
              );
            } else {
              console.log(
                "Hay error en la respuesta y no hay datos locales en la consulta de",
                CATALOG_NAME
              );
              // No hay datos locales -> mostramos error y no tenemos fallback
              showAlert({
                type: "error",
                title: possibleError.title || "Error",
                description: possibleError.description,
              });
            }
            setData((prev) => ({ ...prev, loading: false }));
          } else {
            // Caso: la respuesta sí es data real
            const newData = possibleData[CATALOG_NAME];
            if (Array.isArray(newData)) {
              // Guardamos en redux y en el state local
              dispatch(
                catalogsFetchSuccess({
                  name: CATALOG_NAME,
                  data: newData,
                })
              );
              setData({
                data: newData,
                loading: false,
              });
            } else {
              // Por alguna razón no llegó el array esperado
              // Revisamos si hay fallback local
              if (hasLocalData) {
                console.log(
                  "Hubo un error en el parseo de la respuesta pero hay datos locales en la consulta de",
                  CATALOG_NAME,
                  " retornó: ",
                  newData
                );
                // No reportar error: usamos lo local
                setData((prev) => ({ ...prev, loading: false }));
              } else {
                // No hay nada local -> error
                showAlert({
                  type: "error",
                  title: "Error al recibir el catálogo",
                  description: `No se obtuvo la propiedad "${CATALOG_NAME}" en la respuesta.`,
                });
                console.log(
                  "Hubo un error en parseo de la respuesta y no hay datos locales en la consulta de",
                  CATALOG_NAME,
                  " retornó: ",
                  newData
                );
                setData((prev) => ({ ...prev, loading: false }));
              }
            }
          }
        } else {
          // fetcher.state === "idle" pero fetcher.data es null/undefined => seguramente hubo error global
          if (hasLocalData) {
            // Fallback a datos locales
            console.log(
              "No hay datos en la respuesta pero hay datos locales en la consulta de",
              CATALOG_NAME
            );
          } else {
            // Ni API ni local data => error
            console.log(
              "No hay datos en la respuesta y no hay datos locales en la consulta de",
              CATALOG_NAME
            );
            showAlert({
              type: "error",
              title: "Error al cargar el catálogo",
              description: `No se obtuvo respuesta y no hay datos locales para ${CATALOG_NAME}`,
            });
          }
          setData((prev) => ({ ...prev, loading: false }));
        }
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [fetcher.state]);
  } catch (error) {
    console.error(error);
    showAlert({
      type: "error",
      title: "Error al cargar el catálogo",
      description: `Error al cargar el catálogo ${CATALOG_NAME}, por favor intente nuevamente. Error: ${error}`,
    });
  }

  return data;
}

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

export const useGetInvoicesByCurrentAgency = (
  config?: ReduxParamsConfig
): {
  loading: boolean;
  data: InvoiceGraphQL[];
} => useGetReduxCatalog<InvoiceGraphQL>("invoicesByCurrentAgency", config);

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

export const useGetCCPorcentajesDeRechazo = (
  config?: ReduxParamsConfig
): {
  loading: boolean;
  data: WebAppRowGraphQL<CCPorcentajeRechazo>[];
} =>
  useGetReduxCatalog<WebAppRowGraphQL<CCPorcentajeRechazo>>(
    "ccPorcentajesDeRechazo",
    config
  );

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
  config?: ReduxParamsConfig
): {
  loading: boolean;
  data: SubmissionInvoicesGraphQL[];
} => {
  const agencyId = config?.otherParams?.agency_id;

  const data = useGetReduxCatalog<SubmissionInvoicesGraphQL>(
    "invoiceFormSubmissionsByAgencyId",
    {
      otherParams: {
        agency_id: `${agencyId}`,
      },
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
  config?: ReduxParamsConfig
): {
  loading: boolean;
  data: SubmissionInvoicesGraphQL[];
} => {
  const invoiceId = config?.otherParams?.invoiceId;
  const withFiles = config?.otherParams?.withFiles;

  const data = useGetReduxCatalog<SubmissionInvoicesGraphQL>(
    "invoiceFormSubmissionsByInvoiceId",
    {
      otherParams: {
        invoiceId: `${invoiceId}`,
        withFiles: `${withFiles}`,
      },
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
