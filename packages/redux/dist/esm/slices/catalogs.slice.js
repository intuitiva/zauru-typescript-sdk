"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.catalogsSetReFetch = exports.catalogsFetchSuccess = exports.catalogsFetchStart = void 0;
const toolkit_1 = require("@reduxjs/toolkit");
const createLoadingState = (initialData) => ({
    data: initialData,
    loading: false,
    reFetch: false,
});
const initialState = {
    agencies: createLoadingState([]),
    suggestedPrices: createLoadingState([]),
    providers: createLoadingState([]),
    providerCategories: createLoadingState([]),
    receptionTypes: createLoadingState([]),
    tiposDeMuestra: createLoadingState([]),
    templates: createLoadingState([]),
    shipments: createLoadingState([]),
    bookings: createLoadingState([]),
    motivosRechazo: createLoadingState([]),
    bitacoraRechazoMasivo: createLoadingState([]),
    items: createLoadingState([]),
    itemsByReception: createLoadingState([]),
    payees: createLoadingState([]),
    payeesForLab: createLoadingState([]),
    itemCategoriesForLab: createLoadingState([]),
    payeeCategoriesLabPrices: createLoadingState([]),
    payeeCategories: createLoadingState([]),
    clientCategories: createLoadingState([]),
    itemsByLab: createLoadingState([]),
    itemServicesByLab: createLoadingState([]),
    bundlesRecipForLab: createLoadingState([]),
    bundlesForLab: createLoadingState([]),
    currencies: createLoadingState([]),
    paymentTerms: createLoadingState([]),
    employees: createLoadingState([]),
    employeesByLab: createLoadingState([]),
    employeesByCurrentAgency: createLoadingState([]),
    invoicesByLab: createLoadingState([]),
    invoicesByCurrentAgency: createLoadingState([]),
    invoiceForms: createLoadingState([]),
    caseForms: createLoadingState([]),
    allForms: createLoadingState([]),
    invoiceFormSubmissions: createLoadingState([]),
    myCases: createLoadingState([]),
    myCaseFormSubmissions: createLoadingState([]),
    myAgencyLotStocks: createLoadingState([]),
    shipmentsToMyAgency: createLoadingState([]),
    paymentMethods: createLoadingState([]),
    printTemplates: createLoadingState([]),
    invoiceFormSubmissionsByInvoiceId: createLoadingState([]),
    invoiceFormSubmissionsByAgencyId: createLoadingState([]),
};
const catalogsSlice = (0, toolkit_1.createSlice)({
    name: "catalogs",
    initialState,
    reducers: {
        catalogsSetReFetch: (state, action) => {
            state[action.payload].reFetch = true;
        },
        catalogsFetchStart: (state, action) => {
            state[action.payload].loading = true;
        },
        catalogsFetchSuccess: (state, action) => {
            state[action.payload.name].data = action.payload.data;
            state[action.payload.name].loading = false;
            state[action.payload.name].reFetch = false;
        },
    },
});
_a = catalogsSlice.actions, exports.catalogsFetchStart = _a.catalogsFetchStart, exports.catalogsFetchSuccess = _a.catalogsFetchSuccess, exports.catalogsSetReFetch = _a.catalogsSetReFetch;
exports.default = catalogsSlice.reducer;
