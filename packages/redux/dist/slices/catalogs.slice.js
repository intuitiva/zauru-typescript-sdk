import { createSlice } from "@reduxjs/toolkit";
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
    clientCategories: createLoadingState([]),
    itemsByLab: createLoadingState([]),
    itemServicesByLab: createLoadingState([]),
    bundlesRecipForLab: createLoadingState([]),
    bundlesForLab: createLoadingState([]),
    currencies: createLoadingState([]),
    paymentTerms: createLoadingState([]),
    employeesByLab: createLoadingState([]),
    employeesByCurrentAgency: createLoadingState([]),
    invoicesByLab: createLoadingState([]),
    invoiceForms: createLoadingState([]),
    caseForms: createLoadingState([]),
    invoiceFormSubmissions: createLoadingState([]),
    myCases: createLoadingState([]),
    myCaseFormSubmissions: createLoadingState([]),
    myAgencyLotStocks: createLoadingState([]),
    shipmentsToMyAgency: createLoadingState([]),
};
const catalogsSlice = createSlice({
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
export const { catalogsFetchStart, catalogsFetchSuccess, catalogsSetReFetch } = catalogsSlice.actions;
export default catalogsSlice.reducer;
