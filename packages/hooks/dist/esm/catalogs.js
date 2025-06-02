"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useGetInvoiceFormSubmissionsByInvoiceId = exports.useGetCaseFormSubmissionsByCaseId = exports.useGetMyCaseFormSubmissions = exports.useGetInvoiceFormSubmissionsByAgencyId = exports.useGetCaseForms = exports.useGetInvoiceForms = exports.useGetAllForms = exports.useGetBitacoraRechazoMasivo = exports.useGetAuthorizationsUpdateDiscountPO = exports.useGet4pinosPoDiscountHistory = exports.useGet4pinosSolicitudEliminacionPO = exports.useGetCCPorcentajesDeRechazo = exports.useGetMotivosDeRechazo = exports.useGetTiposDeMuestra = exports.useGetInvoicesByCurrentAgency = exports.useGetInvoicesByLab = exports.useGetShipmentsToMyAgency = exports.useGetEmployees = exports.useGetEmployeesByCurrentAgency = exports.useGetEmployeesByLab = exports.useGetPaymentMethods = exports.useGetPaymentTerms = exports.useGetSuggestedPrices = exports.useGetAgencies = exports.useGetPrintTemplates = exports.useGetPayeesForLab = exports.useGetPayees = exports.useGetClientCategories = exports.useGetProviderCategories = exports.useGetCases = exports.useGetProviders = exports.useGetReceptionTypes = exports.useGetCurrencies = exports.useGetBundlesForLab = exports.useGetBundlesRecipForLab = exports.useGetPayeeCategoriesLabPrices = exports.useGetPayeeCategories = exports.useGetTemplates = exports.useGetBookings = exports.useGetItemCategoriesForLab = exports.useGetItemServicesByLab = exports.useGetMyAgencyLotStocks = exports.useGetItemsByLab = exports.useGetItemsByReception = exports.useGetItems = void 0;
exports.useGetReduxCatalog = useGetReduxCatalog;
const react_1 = require("@remix-run/react");
const react_2 = require("react");
const index_js_1 = require("./components/index.js");
const redux_1 = require("@zauru-sdk/redux");
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
function useGetReduxCatalog(CATALOG_NAME, { online = false, wheres = [], otherParams } = {}) {
    const dispatch = (0, redux_1.useAppDispatch)();
    const fetcher = (0, react_1.useFetcher)();
    const [fetchTriggered, setFetchTriggered] = (0, react_2.useState)(false);
    const catalogData = (0, redux_1.useAppSelector)((state) => state.catalogs[CATALOG_NAME]);
    // Verifica si ya tenemos algo en Redux
    const hasLocalData = Boolean(catalogData?.data?.length);
    const [data, setData] = (0, react_2.useState)({
        data: hasLocalData ? catalogData.data : [],
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
        (0, react_2.useEffect)(() => {
            const mustFetch = online || catalogData?.reFetch || !hasLocalData;
            if (mustFetch) {
                setData((prev) => ({ ...prev, loading: true }));
                dispatch((0, redux_1.catalogsFetchStart)(CATALOG_NAME));
                // Construimos el query para `wheres` y `otherParams`
                const encodedWheres = (wheres || []).map((where) => encodeURIComponent(where));
                const wheresQueryParam = encodedWheres.join("&");
                const paramsString = otherParams
                    ? Object.entries(otherParams)
                        .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
                        .join("&")
                    : "";
                const queryStringParts = [];
                if (wheresQueryParam)
                    queryStringParts.push(`wheres=${wheresQueryParam}`);
                if (paramsString)
                    queryStringParts.push(paramsString);
                const queryString = queryStringParts.length
                    ? `&${queryStringParts.join("&")}`
                    : "";
                // Disparamos la carga a través de fetcher
                try {
                    setFetchTriggered(true);
                    fetcher.load(`/api/catalogs?catalog=${CATALOG_NAME}${queryString}`);
                }
                catch (error) {
                    // Si hay datos locales, mostramos los datos locales
                    if (hasLocalData) {
                        console.error("Hubo un error pero hay datos locales en la consulta de", CATALOG_NAME, " Error: ", error);
                        setData({
                            data: catalogData?.data || [],
                            loading: false,
                        });
                    }
                    else {
                        console.error("Hubo un error y no hay datos locales en la consulta de", CATALOG_NAME, " Error: ", error);
                        (0, index_js_1.showAlert)({
                            type: "error",
                            title: "Error al cargar el catálogo",
                            description: `Error al cargar el catálogo ${CATALOG_NAME}, por favor intente nuevamente. Error: ${error}`,
                        });
                    }
                }
            }
            else {
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
        (0, react_2.useEffect)(() => {
            // Solo ejecuto la lógica si ya disparé al menos un fetch
            if (!fetchTriggered)
                return;
            // Cuando fetcher se pone en "idle", significa que ya terminó la petición.
            if (fetcher.state === "idle") {
                // Caso: tenemos algo en fetcher.data
                if (fetcher.data) {
                    const possibleError = fetcher.data;
                    const possibleData = fetcher.data;
                    // Si es un error "clásico", lo manejamos
                    if (possibleError?.error) {
                        // Pero OJO: si ya teníamos datos locales, no mostramos error "fatal" para no romper el fallback
                        if (hasLocalData) {
                            console.log("Hay error en la respuesta pero hay datos locales en la consulta de", CATALOG_NAME);
                        }
                        else {
                            console.log("Hay error en la respuesta y no hay datos locales en la consulta de", CATALOG_NAME);
                            // No hay datos locales -> mostramos error y no tenemos fallback
                            (0, index_js_1.showAlert)({
                                type: "error",
                                title: possibleError.title || "Error",
                                description: possibleError.description,
                            });
                        }
                        setData((prev) => ({ ...prev, loading: false }));
                    }
                    else {
                        // Caso: la respuesta sí es data real
                        const newData = possibleData[CATALOG_NAME];
                        if (Array.isArray(newData)) {
                            // Guardamos en redux y en el state local
                            dispatch((0, redux_1.catalogsFetchSuccess)({
                                name: CATALOG_NAME,
                                data: newData,
                            }));
                            setData({
                                data: newData,
                                loading: false,
                            });
                        }
                        else {
                            // Por alguna razón no llegó el array esperado
                            // Revisamos si hay fallback local
                            if (hasLocalData) {
                                console.log("Hubo un error en el parseo de la respuesta pero hay datos locales en la consulta de", CATALOG_NAME, " retornó: ", newData);
                                // No reportar error: usamos lo local
                                setData((prev) => ({ ...prev, loading: false }));
                            }
                            else {
                                // No hay nada local -> error
                                (0, index_js_1.showAlert)({
                                    type: "error",
                                    title: "Error al recibir el catálogo",
                                    description: `No se obtuvo la propiedad "${CATALOG_NAME}" en la respuesta.`,
                                });
                                console.log("Hubo un error en parseo de la respuesta y no hay datos locales en la consulta de", CATALOG_NAME, " retornó: ", newData);
                                setData((prev) => ({ ...prev, loading: false }));
                            }
                        }
                    }
                }
                else {
                    // fetcher.state === "idle" pero fetcher.data es null/undefined => seguramente hubo error global
                    if (hasLocalData) {
                        // Fallback a datos locales
                        console.log("No hay datos en la respuesta pero hay datos locales en la consulta de", CATALOG_NAME);
                    }
                    else {
                        // Ni API ni local data => error
                        console.log("No hay datos en la respuesta y no hay datos locales en la consulta de", CATALOG_NAME);
                        (0, index_js_1.showAlert)({
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
    }
    catch (error) {
        console.error(error);
        (0, index_js_1.showAlert)({
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
const useGetItems = (config) => useGetReduxCatalog("items", config);
exports.useGetItems = useGetItems;
const useGetItemsByReception = (config) => useGetReduxCatalog("itemsByReception", config);
exports.useGetItemsByReception = useGetItemsByReception;
const useGetItemsByLab = (config) => useGetReduxCatalog("itemsByLab", config);
exports.useGetItemsByLab = useGetItemsByLab;
const useGetMyAgencyLotStocks = (config) => useGetReduxCatalog("myAgencyLotStocks", config);
exports.useGetMyAgencyLotStocks = useGetMyAgencyLotStocks;
const useGetItemServicesByLab = (config) => useGetReduxCatalog("itemServicesByLab", config);
exports.useGetItemServicesByLab = useGetItemServicesByLab;
const useGetItemCategoriesForLab = (config) => useGetReduxCatalog("itemCategoriesForLab", config);
exports.useGetItemCategoriesForLab = useGetItemCategoriesForLab;
const useGetBookings = (config) => useGetReduxCatalog("bookings", config);
exports.useGetBookings = useGetBookings;
const useGetTemplates = (config) => useGetReduxCatalog("templates", config);
exports.useGetTemplates = useGetTemplates;
const useGetPayeeCategories = (config) => useGetReduxCatalog("payeeCategories", config);
exports.useGetPayeeCategories = useGetPayeeCategories;
const useGetPayeeCategoriesLabPrices = (config = { withPriceListIdNull: false }) => {
    const data = useGetReduxCatalog("payeeCategoriesLabPrices");
    let tempData = data.data;
    if (!config.withPriceListIdNull) {
        tempData = data.data.filter((x) => x.price_list_id);
    }
    return { ...data, data: tempData };
};
exports.useGetPayeeCategoriesLabPrices = useGetPayeeCategoriesLabPrices;
const useGetBundlesRecipForLab = (config) => useGetReduxCatalog("bundlesRecipForLab", config);
exports.useGetBundlesRecipForLab = useGetBundlesRecipForLab;
const useGetBundlesForLab = (config) => useGetReduxCatalog("bundlesForLab", config);
exports.useGetBundlesForLab = useGetBundlesForLab;
const useGetCurrencies = (config) => useGetReduxCatalog("currencies", config);
exports.useGetCurrencies = useGetCurrencies;
const useGetReceptionTypes = (config) => useGetReduxCatalog("receptionTypes", config);
exports.useGetReceptionTypes = useGetReceptionTypes;
const useGetProviders = (config) => useGetReduxCatalog("providers", config);
exports.useGetProviders = useGetProviders;
const useGetCases = (config) => useGetReduxCatalog("cases", config);
exports.useGetCases = useGetCases;
const useGetProviderCategories = (config) => useGetReduxCatalog("providerCategories", config);
exports.useGetProviderCategories = useGetProviderCategories;
const useGetClientCategories = (config) => useGetReduxCatalog("clientCategories", config);
exports.useGetClientCategories = useGetClientCategories;
const useGetPayees = (config) => useGetReduxCatalog("payees", config);
exports.useGetPayees = useGetPayees;
const useGetPayeesForLab = (config) => useGetReduxCatalog("payeesForLab", config);
exports.useGetPayeesForLab = useGetPayeesForLab;
const useGetPrintTemplates = (config) => useGetReduxCatalog("printTemplates", config);
exports.useGetPrintTemplates = useGetPrintTemplates;
const useGetAgencies = (config) => useGetReduxCatalog("agencies", config);
exports.useGetAgencies = useGetAgencies;
const useGetSuggestedPrices = (config) => useGetReduxCatalog("suggestedPrices", config);
exports.useGetSuggestedPrices = useGetSuggestedPrices;
const useGetPaymentTerms = (config) => useGetReduxCatalog("paymentTerms", config);
exports.useGetPaymentTerms = useGetPaymentTerms;
const useGetPaymentMethods = (config) => useGetReduxCatalog("paymentMethods", config);
exports.useGetPaymentMethods = useGetPaymentMethods;
const useGetEmployeesByLab = (config) => useGetReduxCatalog("employeesByLab", config);
exports.useGetEmployeesByLab = useGetEmployeesByLab;
const useGetEmployeesByCurrentAgency = (config) => useGetReduxCatalog("employeesByCurrentAgency", config);
exports.useGetEmployeesByCurrentAgency = useGetEmployeesByCurrentAgency;
const useGetEmployees = (config) => useGetReduxCatalog("employees", config);
exports.useGetEmployees = useGetEmployees;
const useGetShipmentsToMyAgency = (config) => useGetReduxCatalog("shipmentsToMyAgency", config);
exports.useGetShipmentsToMyAgency = useGetShipmentsToMyAgency;
const useGetInvoicesByLab = (config) => useGetReduxCatalog("invoicesByLab", config);
exports.useGetInvoicesByLab = useGetInvoicesByLab;
const useGetInvoicesByCurrentAgency = (config) => useGetReduxCatalog("invoicesByCurrentAgency", config);
exports.useGetInvoicesByCurrentAgency = useGetInvoicesByCurrentAgency;
const useGetTiposDeMuestra = (config) => useGetReduxCatalog("tiposDeMuestra", config);
exports.useGetTiposDeMuestra = useGetTiposDeMuestra;
const useGetMotivosDeRechazo = (config) => useGetReduxCatalog("motivosRechazo", config);
exports.useGetMotivosDeRechazo = useGetMotivosDeRechazo;
const useGetCCPorcentajesDeRechazo = (config) => useGetReduxCatalog("ccPorcentajesDeRechazo", config);
exports.useGetCCPorcentajesDeRechazo = useGetCCPorcentajesDeRechazo;
const useGet4pinosSolicitudEliminacionPO = (config) => useGetReduxCatalog("solicitudesEliminacionPO", config);
exports.useGet4pinosSolicitudEliminacionPO = useGet4pinosSolicitudEliminacionPO;
const useGet4pinosPoDiscountHistory = (config) => useGetReduxCatalog("poDiscountHistory", config);
exports.useGet4pinosPoDiscountHistory = useGet4pinosPoDiscountHistory;
const useGetAuthorizationsUpdateDiscountPO = (config) => useGetReduxCatalog("authorizationUpdateDiscountPO", config);
exports.useGetAuthorizationsUpdateDiscountPO = useGetAuthorizationsUpdateDiscountPO;
const useGetBitacoraRechazoMasivo = (config) => useGetReduxCatalog("bitacoraRechazoMasivo", config);
exports.useGetBitacoraRechazoMasivo = useGetBitacoraRechazoMasivo;
const useGetAllForms = (config) => {
    const data = useGetReduxCatalog("allForms", config);
    // Filtrar los registros para obtener sólo los de la versión más alta.
    const groupedByVersion = (data.data || []).reduce((acc, record) => {
        const zid = record.zid;
        if (!acc[zid]) {
            acc[zid] = record;
        }
        return acc;
    }, {});
    const latestVersionRecords = Object.values(groupedByVersion);
    return {
        loading: data.loading,
        data: latestVersionRecords.filter((x) => x.active),
    };
};
exports.useGetAllForms = useGetAllForms;
const useGetInvoiceForms = (config) => {
    const data = useGetReduxCatalog("invoiceForms", config);
    // Filtrar los registros para obtener sólo los de la versión más alta.
    const groupedByVersion = (data.data || []).reduce((acc, record) => {
        const zid = record.zid;
        if (!acc[zid]) {
            acc[zid] = record;
        }
        return acc;
    }, {});
    const latestVersionRecords = Object.values(groupedByVersion);
    return {
        loading: data.loading,
        data: latestVersionRecords.filter((x) => x.active),
    };
};
exports.useGetInvoiceForms = useGetInvoiceForms;
const useGetCaseForms = (config) => {
    const data = useGetReduxCatalog("caseForms", config);
    // Filtrar los registros para obtener sólo el primero de cada zid.
    const firstRecordByZid = (data.data || []).reduce((acc, record) => {
        const zid = record.zid;
        if (!acc[zid]) {
            acc[zid] = record;
        }
        return acc;
    }, {});
    const firstRecords = Object.values(firstRecordByZid);
    return {
        loading: data.loading,
        data: firstRecords.filter((x) => x.active),
    };
};
exports.useGetCaseForms = useGetCaseForms;
const useGetInvoiceFormSubmissionsByAgencyId = (config) => {
    const agencyId = config?.otherParams?.agency_id;
    const data = useGetReduxCatalog("invoiceFormSubmissionsByAgencyId", {
        otherParams: {
            agency_id: `${agencyId}`,
        },
    });
    // Filtrar los registros para obtener sólo los de la versión más alta.
    const groupedByVersion = (data.data || []).reduce((acc, record) => {
        const zid = record.settings_form_submission.zid;
        if (!acc[zid]) {
            acc[zid] = record;
        }
        return acc;
    }, {});
    const latestVersionRecords = Object.values(groupedByVersion);
    return {
        loading: data.loading,
        data: latestVersionRecords,
    };
};
exports.useGetInvoiceFormSubmissionsByAgencyId = useGetInvoiceFormSubmissionsByAgencyId;
const useGetMyCaseFormSubmissions = (config) => {
    const data = useGetReduxCatalog("myCaseFormSubmissions", config);
    // Filtrar los registros para obtener sólo los de la versión más alta.
    const groupedByVersion = (data.data || []).reduce((acc, record) => {
        const zid = record.settings_form_submission.zid;
        if (!acc[zid]) {
            acc[zid] = record;
        }
        return acc;
    }, {});
    const latestVersionRecords = Object.values(groupedByVersion);
    return {
        loading: data.loading,
        data: latestVersionRecords,
    };
};
exports.useGetMyCaseFormSubmissions = useGetMyCaseFormSubmissions;
const useGetCaseFormSubmissionsByCaseId = (config) => {
    const caseId = config?.otherParams?.caseId;
    const withFiles = config?.otherParams?.withFiles;
    const data = useGetReduxCatalog("caseFormSubmissionsByCaseId", {
        otherParams: {
            caseId: `${caseId}`,
            withFiles: `${withFiles}`,
        },
    });
    // Filtrar los registros para obtener sólo los de la versión más alta.
    const groupedByVersion = (data.data || []).reduce((acc, record) => {
        const zid = record.settings_form_submission.zid;
        if (!acc[zid]) {
            acc[zid] = record;
        }
        return acc;
    }, {});
    const latestVersionRecords = Object.values(groupedByVersion);
    return {
        loading: data.loading,
        data: latestVersionRecords,
    };
};
exports.useGetCaseFormSubmissionsByCaseId = useGetCaseFormSubmissionsByCaseId;
const useGetInvoiceFormSubmissionsByInvoiceId = (config) => {
    const invoiceId = config?.otherParams?.invoiceId;
    const withFiles = config?.otherParams?.withFiles;
    const data = useGetReduxCatalog("invoiceFormSubmissionsByInvoiceId", {
        otherParams: {
            invoiceId: `${invoiceId}`,
            withFiles: `${withFiles}`,
        },
    });
    // Filtrar los registros para obtener sólo los de la versión más alta.
    const groupedByVersion = (data.data || []).reduce((acc, record) => {
        const zid = record.settings_form_submission.zid;
        if (!acc[zid]) {
            acc[zid] = record;
        }
        return acc;
    }, {});
    const latestVersionRecords = Object.values(groupedByVersion);
    return {
        loading: data.loading,
        data: latestVersionRecords,
    };
};
exports.useGetInvoiceFormSubmissionsByInvoiceId = useGetInvoiceFormSubmissionsByInvoiceId;
