import { useFetcher } from "@remix-run/react";
import { useEffect, useState } from "react";
import { showAlert } from "./components/index.js";
import { catalogsFetchStart, catalogsFetchSuccess, useAppDispatch, useAppSelector, } from "@zauru-sdk/redux";
const useApiCatalog = (CATALOG_NAME, otherParams) => {
    const fetcher = useFetcher();
    const [data, setData] = useState({
        data: [],
        loading: true,
    });
    useEffect(() => {
        if (fetcher.data?.title) {
            showAlert({
                description: fetcher.data?.description?.toString(),
                title: fetcher.data?.title?.toString(),
                type: fetcher.data?.type?.toString(),
            });
        }
    }, [fetcher.data]);
    useEffect(() => {
        if (fetcher.state === "idle" && fetcher.data != null) {
            const receivedData = fetcher.data;
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
            const url = `/api/catalogs?catalog=${CATALOG_NAME}${paramsString ? `&${paramsString}` : ""}`;
            fetcher.load(url);
        }
        catch (ex) {
            showAlert({
                type: "error",
                title: `Ocurrió un error al cargar el catálogo: ${CATALOG_NAME}.`,
                description: "Error: " + ex,
            });
        }
    }, []);
    return data;
};
const useGetReduxCatalog = (CATALOG_NAME, { online = false, wheres = [], otherParams } = {}) => {
    const fetcher = useFetcher();
    const dispatch = useAppDispatch();
    const catalogData = useAppSelector((state) => state.catalogs[CATALOG_NAME]);
    const [data, setData] = useState({
        data: catalogData?.data?.length ? catalogData.data : [],
        loading: catalogData.loading,
    });
    useEffect(() => {
        if (fetcher.data?.description) {
            showAlert({
                description: fetcher.data?.description?.toString(),
                title: fetcher.data?.title?.toString(),
                type: fetcher.data?.type?.toString(),
            });
        }
    }, [fetcher.data]);
    useEffect(() => {
        if (fetcher.state === "idle" && fetcher.data != null) {
            const receivedData = fetcher.data;
            if (receivedData) {
                setData({ data: receivedData[CATALOG_NAME], loading: false });
                dispatch(catalogsFetchSuccess({
                    name: CATALOG_NAME,
                    data: receivedData[CATALOG_NAME],
                }));
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
                fetcher.load(`/api/catalogs?catalog=${CATALOG_NAME}&wheres=${wheresQueryParam}${paramsString ? `&${paramsString}` : ""}`);
            }
            catch (ex) {
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
export const useGetItems = (config) => useGetReduxCatalog("items", config);
export const useGetItemsByReception = (config) => useGetReduxCatalog("itemsByReception", config);
export const useGetItemsByLab = (config) => useGetReduxCatalog("itemsByLab", config);
export const useGetMyAgencyLotStocks = (config) => useGetReduxCatalog("myAgencyLotStocks", config);
export const useGetItemServicesByLab = (config) => useGetReduxCatalog("itemServicesByLab", config);
export const useGetItemCategoriesForLab = (config) => useGetReduxCatalog("itemCategoriesForLab", config);
export const useGetBookings = (config) => useGetReduxCatalog("bookings", config);
export const useGetTemplates = (config) => useGetReduxCatalog("templates", config);
export const useGetPayeeCategoriesLabPrices = (config = { withPriceListIdNull: false }) => {
    const data = useGetReduxCatalog("payeeCategoriesLabPrices");
    let tempData = data.data;
    if (!config.withPriceListIdNull) {
        tempData = data.data.filter((x) => x.price_list_id);
    }
    return { ...data, data: tempData };
};
export const useGetBundlesRecipForLab = (config) => useGetReduxCatalog("bundlesRecipForLab", config);
export const useGetBundlesForLab = (config) => useGetReduxCatalog("bundlesForLab", config);
export const useGetCurrencies = (config) => useGetReduxCatalog("currencies", config);
export const useGetReceptionTypes = (config) => useGetReduxCatalog("receptionTypes", config);
export const useGetProviders = (config) => useGetReduxCatalog("providers", config);
export const useGetMyCases = (config) => useGetReduxCatalog("myCases", config);
export const useGetProviderCategories = (config) => useGetReduxCatalog("providerCategories", config);
export const useGetClientCategories = (config) => useGetReduxCatalog("clientCategories", config);
export const useGetPayees = (config) => useGetReduxCatalog("payees", config);
export const useGetPayeesForLab = (config) => useGetReduxCatalog("payeesForLab", config);
export const useGetAgencies = (config) => useGetReduxCatalog("agencies", config);
export const useGetSuggestedPrices = (config) => useGetReduxCatalog("suggestedPrices", config);
export const useGetPaymentTerms = (config) => useGetReduxCatalog("paymentTerms", config);
export const useGetEmployeesByLab = (config) => useGetReduxCatalog("employeesByLab", config);
export const useGetEmployeesByCurrentAgency = (config) => useGetReduxCatalog("employeesByCurrentAgency", config);
export const useGetShipmentsToMyAgency = (config) => useGetReduxCatalog("shipmentsToMyAgency", config);
export const useGetInvoicesByLab = (config) => useGetReduxCatalog("invoicesByLab", config);
export const useGetTiposDeMuestra = (config) => useGetReduxCatalog("tiposDeMuestra", config);
export const useGetMotivosDeRechazo = (config) => useGetReduxCatalog("motivosRechazo", config);
export const useGetBitacoraRechazoMasivo = (config) => useGetReduxCatalog("bitacoraRechazoMasivo", config);
export const useGetInvoiceForms = (config) => {
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
export const useGetCaseForms = (config) => {
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
export const useGetInvoiceFormSubmissionsByAgencyId = (agency_id) => {
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
export const useGetMyCaseFormSubmissions = (config) => {
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
export const useGetInvoiceFormSubmissionsByInvoiceId = (invoice_id) => {
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
