"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useGetInvoiceFormSubmissionsByInvoiceId = exports.useGetMyCaseFormSubmissions = exports.useGetInvoiceFormSubmissionsByAgencyId = exports.useGetCaseForms = exports.useGetInvoiceForms = exports.useGetAllForms = exports.useGetBitacoraRechazoMasivo = exports.useGetMotivosDeRechazo = exports.useGetTiposDeMuestra = exports.useGetInvoicesByLab = exports.useGetShipmentsToMyAgency = exports.useGetEmployees = exports.useGetEmployeesByCurrentAgency = exports.useGetEmployeesByLab = exports.useGetPaymentMethods = exports.useGetPaymentTerms = exports.useGetSuggestedPrices = exports.useGetAgencies = exports.useGetPrintTemplates = exports.useGetPayeesForLab = exports.useGetPayees = exports.useGetClientCategories = exports.useGetProviderCategories = exports.useGetMyCases = exports.useGetProviders = exports.useGetReceptionTypes = exports.useGetCurrencies = exports.useGetBundlesForLab = exports.useGetBundlesRecipForLab = exports.useGetPayeeCategoriesLabPrices = exports.useGetPayeeCategories = exports.useGetTemplates = exports.useGetBookings = exports.useGetItemCategoriesForLab = exports.useGetItemServicesByLab = exports.useGetMyAgencyLotStocks = exports.useGetItemsByLab = exports.useGetItemsByReception = exports.useGetItems = void 0;
const react_1 = require("@remix-run/react");
const react_2 = require("react");
const index_js_1 = require("./components/index.js");
const redux_1 = require("@zauru-sdk/redux");
const useApiCatalog = (CATALOG_NAME, otherParams) => {
    try {
        const fetcher = (0, react_1.useFetcher)();
        const [data, setData] = (0, react_2.useState)({
            data: [],
            loading: true,
        });
        (0, react_2.useEffect)(() => {
            if (fetcher.data?.title) {
                (0, index_js_1.showAlert)({
                    description: fetcher.data?.description?.toString(),
                    title: fetcher.data?.title?.toString(),
                    type: fetcher.data?.type?.toString(),
                });
            }
        }, [fetcher.data]);
        (0, react_2.useEffect)(() => {
            if (fetcher.state === "idle" && fetcher.data != null) {
                const receivedData = fetcher.data;
                if (receivedData) {
                    setData({ data: receivedData[CATALOG_NAME], loading: false });
                }
            }
        }, [fetcher, CATALOG_NAME]);
        (0, react_2.useEffect)(() => {
            try {
                setData({ ...data, loading: true });
                // Convert otherParams to query string
                const paramsString = otherParams
                    ? Object.entries(otherParams)
                        .map(([key, value]) => `${key}=${value}`)
                        .join("&")
                    : "";
                const url = `/api/catalogs?catalog=${CATALOG_NAME}${paramsString ? `&${paramsString}` : ""}`;
                fetcher.load(url);
            }
            catch (ex) {
                (0, index_js_1.showAlert)({
                    type: "error",
                    title: `Ocurrió un error al cargar el catálogo: ${CATALOG_NAME}.`,
                    description: "Error: " + ex,
                });
            }
        }, []);
        return data;
    }
    catch (ex) {
        (0, index_js_1.showAlert)({
            type: "error",
            title: `Ocurrió un error al cargar el catálogo: ${CATALOG_NAME}.`,
            description: "Error: " + ex,
        });
        return { data: [], loading: false };
    }
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
const useGetReduxCatalog = (CATALOG_NAME, { online = false, wheres = [], otherParams } = {}) => {
    const fetcher = (0, react_1.useFetcher)();
    const dispatch = (0, redux_1.useAppDispatch)();
    const catalogData = (0, redux_1.useAppSelector)((state) => state.catalogs[CATALOG_NAME]);
    const [data, setData] = (0, react_2.useState)({
        data: catalogData?.data?.length ? catalogData.data : [],
        loading: catalogData.loading,
    });
    (0, react_2.useEffect)(() => {
        if (fetcher.data?.description) {
            (0, index_js_1.showAlert)({
                description: fetcher.data?.description?.toString(),
                title: fetcher.data?.title?.toString(),
                type: fetcher.data?.type?.toString(),
            });
        }
    }, [fetcher.data]);
    (0, react_2.useEffect)(() => {
        if (fetcher.state === "idle" && fetcher.data != null) {
            const receivedData = fetcher.data;
            if (receivedData) {
                setData({ data: receivedData[CATALOG_NAME], loading: false });
                dispatch((0, redux_1.catalogsFetchSuccess)({
                    name: CATALOG_NAME,
                    data: receivedData[CATALOG_NAME],
                }));
            }
        }
    }, [fetcher, dispatch, CATALOG_NAME]);
    (0, react_2.useEffect)(() => {
        if (catalogData?.data?.length <= 0 || catalogData?.reFetch || online) {
            try {
                setData({ ...data, loading: true });
                dispatch((0, redux_1.catalogsFetchStart)(CATALOG_NAME));
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
                fetcher.load(`/api/catalogs?catalog=${CATALOG_NAME}&wheres=${wheresQueryParam}${paramsString ? `&${paramsString}` : ""}`);
            }
            catch (ex) {
                (0, index_js_1.showAlert)({
                    type: "error",
                    title: `Ocurrió un error al cargar el catálogo: ${CATALOG_NAME}.`,
                    description: "Error: " + ex,
                });
                setData({ ...data, loading: false });
            }
        }
    }, []);
    return data;
};
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
const useGetMyCases = (config) => useGetReduxCatalog("myCases", config);
exports.useGetMyCases = useGetMyCases;
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
const useGetTiposDeMuestra = (config) => useGetReduxCatalog("tiposDeMuestra", config);
exports.useGetTiposDeMuestra = useGetTiposDeMuestra;
const useGetMotivosDeRechazo = (config) => useGetReduxCatalog("motivosRechazo", config);
exports.useGetMotivosDeRechazo = useGetMotivosDeRechazo;
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
const useGetInvoiceFormSubmissionsByAgencyId = (agency_id) => {
    const data = useApiCatalog("invoiceFormSubmissionsByAgencyId", {
        agency_id: `${agency_id}`,
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
const useGetInvoiceFormSubmissionsByInvoiceId = (invoice_id) => {
    const data = useApiCatalog("invoiceFormSubmissionsByInvoiceId", {
        invoice_id: `${invoice_id}`,
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
