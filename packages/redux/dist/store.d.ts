import { Tuple } from "@reduxjs/toolkit";
export declare const LOCAL_STORAGE_REDUX_NAME = "___redux__state__v2";
export declare const cleanLocalStorage: () => void;
export declare const store: import("@reduxjs/toolkit").EnhancedStore<{
    catalogs: {
        agencies: {
            data: import("@zauru-sdk/types").AgencyGraphQL[];
            loading: boolean;
            reFetch: boolean;
        };
        suggestedPrices: {
            data: import("@zauru-sdk/types").SuggestedPriceGraphQL[];
            loading: boolean;
            reFetch: boolean;
        };
        providers: {
            data: import("@zauru-sdk/types").PayeeGraphQL[];
            loading: boolean;
            reFetch: boolean;
        };
        providerCategories: {
            data: import("@zauru-sdk/types").PayeeCategoryGraphQL[];
            loading: boolean;
            reFetch: boolean;
        };
        payees: {
            data: import("@zauru-sdk/types").PayeeGraphQL[];
            loading: boolean;
            reFetch: boolean;
        };
        payeesForLab: {
            data: import("@zauru-sdk/types").PayeeGraphQL[];
            loading: boolean;
            reFetch: boolean;
        };
        payeeCategoriesLabPrices: {
            data: import("@zauru-sdk/types").PayeeCategoryGraphQL[];
            loading: boolean;
            reFetch: boolean;
        };
        clientCategories: {
            data: import("@zauru-sdk/types").PayeeCategoryGraphQL[];
            loading: boolean;
            reFetch: boolean;
        };
        receptionTypes: {
            data: import("@zauru-sdk/types").WebAppRowGraphQL<import("@zauru-sdk/types").ReceptionType>[];
            loading: boolean;
            reFetch: boolean;
        };
        tiposDeMuestra: {
            data: import("@zauru-sdk/types").WebAppRowGraphQL<import("@zauru-sdk/types").TipoMuestra>[];
            loading: boolean;
            reFetch: boolean;
        };
        templates: {
            data: import("@zauru-sdk/types").WebAppRowGraphQL<import("@zauru-sdk/types").Template>[];
            loading: boolean;
            reFetch: boolean;
        };
        shipments: {
            data: import("@zauru-sdk/types").ShipmentGraphQL[];
            loading: boolean;
            reFetch: boolean;
        };
        bookings: {
            data: import("@zauru-sdk/types").ShipmentGraphQL[];
            loading: boolean;
            reFetch: boolean;
        };
        motivosRechazo: {
            data: import("@zauru-sdk/types").WebAppRowGraphQL<import("@zauru-sdk/types").MotivoRechazo>[];
            loading: boolean;
            reFetch: boolean;
        };
        bitacoraRechazoMasivo: {
            data: import("@zauru-sdk/types").WebAppRowGraphQL<import("@zauru-sdk/types").BitacoraPOMassive>[];
            loading: boolean;
            reFetch: boolean;
        };
        items: {
            data: import("@zauru-sdk/types").ItemGraphQL[];
            loading: boolean;
            reFetch: boolean;
        };
        itemsByReception: {
            data: import("@zauru-sdk/types").ItemGraphQL[];
            loading: boolean;
            reFetch: boolean;
        };
        itemsByLab: {
            data: import("@zauru-sdk/types").ItemGraphQL[];
            loading: boolean;
            reFetch: boolean;
        };
        itemServicesByLab: {
            data: import("@zauru-sdk/types").ItemGraphQL[];
            loading: boolean;
            reFetch: boolean;
        };
        itemCategoriesForLab: {
            data: import("@zauru-sdk/types").ItemCategoryGraphQL[];
            loading: boolean;
            reFetch: boolean;
        };
        bundlesRecipForLab: {
            data: import("@zauru-sdk/types").BundleGraphQL[];
            loading: boolean;
            reFetch: boolean;
        };
        bundlesForLab: {
            data: import("@zauru-sdk/types").BundleGraphQL[];
            loading: boolean;
            reFetch: boolean;
        };
        currencies: {
            data: import("@zauru-sdk/types").CurrencyGraphQL[];
            loading: boolean;
            reFetch: boolean;
        };
        paymentTerms: {
            data: import("@zauru-sdk/types").PaymentTermGraphQL[];
            loading: boolean;
            reFetch: boolean;
        };
        employeesByLab: {
            data: import("@zauru-sdk/types").EmployeeGraphQL[];
            loading: boolean;
            reFetch: boolean;
        };
        employeesByCurrentAgency: {
            data: import("@zauru-sdk/types").EmployeeGraphQL[];
            loading: boolean;
            reFetch: boolean;
        };
        invoicesByLab: {
            data: import("@zauru-sdk/types").InvoiceGraphQL[];
            loading: boolean;
            reFetch: boolean;
        };
        invoiceForms: {
            data: import("@zauru-sdk/types").FormGraphQL[];
            loading: boolean;
            reFetch: boolean;
        };
        caseForms: {
            data: import("@zauru-sdk/types").FormGraphQL[];
            loading: boolean;
            reFetch: boolean;
        };
        invoiceFormSubmissions: {
            data: import("@zauru-sdk/types").FormSubmissionGraphQL[];
            loading: boolean;
            reFetch: boolean;
        };
        myCases: {
            data: import("@zauru-sdk/types").CaseGraphQL[];
            loading: boolean;
            reFetch: boolean;
        };
        myCaseFormSubmissions: {
            data: import("@zauru-sdk/types").FormSubmissionGraphQL[];
            loading: boolean;
            reFetch: boolean;
        };
        myAgencyLotStocks: {
            data: import("@zauru-sdk/types").LotStockGraphQL[];
            loading: boolean;
            reFetch: boolean;
        };
        shipmentsToMyAgency: {
            data: import("@zauru-sdk/types").ShipmentGraphQL[];
            loading: boolean;
            reFetch: boolean;
        };
    };
    profiles: import("./slices/profile.slice.js").ProfilesState;
    webappTables: import("./slices/webapp-tables.slice.js").WebAppTableState;
    receptions: import("./slices/reception.slice.js").ReceptionState;
    session: import("./slices/session.slice.js").SessionState;
    templates: import("./slices/templates.slice.js").TemplateState;
    automaticNumbers: import("./slices/automaticNumbers.slice.js").AutomaticNumberState;
    tables: import("./slices/tables.slice.js").TableState;
    formValidation: import("./slices/formValidation.slice.js").FormValidations;
}, import("redux").UnknownAction, Tuple<[import("redux").StoreEnhancer<{
    dispatch: {};
}>, import("redux").StoreEnhancer]>>;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
