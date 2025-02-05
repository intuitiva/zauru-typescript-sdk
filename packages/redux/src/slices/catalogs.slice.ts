import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import type {
  AgencyGraphQL,
  BitacoraPOMassive,
  BundleGraphQL,
  CaseGraphQL,
  CurrencyGraphQL,
  EmployeeGraphQL,
  FormGraphQL,
  FormSubmissionGraphQL,
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
  SuggestedPriceGraphQL,
  Template,
  TipoMuestra,
  WebAppRowGraphQL,
  PrintTemplateGraphQL,
  PaymentMethodGraphQL,
} from "@zauru-sdk/types";

export type CATALOGS_NAMES =
  | "agencies"
  | "suggestedPrices"
  | "providers"
  | "providerCategories"
  | "receptionTypes"
  | "tiposDeMuestra"
  | "motivosRechazo"
  | "bitacoraRechazoMasivo"
  | "items"
  | "itemsByReception"
  | "itemsByLab"
  | "itemServicesByLab"
  | "itemCategoriesForLab"
  | "payees"
  | "payeesForLab"
  | "payeeCategoriesLabPrices"
  | "payeeCategories"
  | "clientCategories"
  | "bundlesRecipForLab"
  | "currencies"
  | "paymentTerms"
  | "employeesByLab"
  | "employeesByCurrentAgency"
  | "invoicesByLab"
  | "invoicesByCurrentAgency"
  | "invoiceForms"
  | "caseForms"
  | "invoiceFormSubmissions"
  | "myCases"
  | "myCaseFormSubmissions"
  | "allForms"
  | "shipmentsToMyAgency"
  | "myAgencyLotStocks"
  | "shipments"
  | "bookings"
  | "templates"
  | "bundlesForLab"
  | "paymentMethods"
  | "employees"
  | "printTemplates"
  | "invoiceFormSubmissionsByInvoiceId"
  | "invoiceFormSubmissionsByAgencyId";

type LoadingState<T> = {
  data: T;
  loading: boolean;
  reFetch: boolean;
};

type CatalogState = {
  agencies: LoadingState<AgencyGraphQL[]>;
  suggestedPrices: LoadingState<SuggestedPriceGraphQL[]>;
  providers: LoadingState<PayeeGraphQL[]>;
  providerCategories: LoadingState<PayeeCategoryGraphQL[]>;
  payees: LoadingState<PayeeGraphQL[]>;
  payeesForLab: LoadingState<PayeeGraphQL[]>;
  payeeCategoriesLabPrices: LoadingState<PayeeCategoryGraphQL[]>;
  payeeCategories: LoadingState<PayeeCategoryGraphQL[]>;
  clientCategories: LoadingState<PayeeCategoryGraphQL[]>;
  receptionTypes: LoadingState<WebAppRowGraphQL<ReceptionType>[]>;
  tiposDeMuestra: LoadingState<WebAppRowGraphQL<TipoMuestra>[]>;
  templates: LoadingState<WebAppRowGraphQL<Template>[]>;
  shipments: LoadingState<ShipmentGraphQL[]>;
  bookings: LoadingState<ShipmentGraphQL[]>;
  motivosRechazo: LoadingState<WebAppRowGraphQL<MotivoRechazo>[]>;
  bitacoraRechazoMasivo: LoadingState<WebAppRowGraphQL<BitacoraPOMassive>[]>;
  items: LoadingState<ItemGraphQL[]>;
  itemsByReception: LoadingState<ItemGraphQL[]>;
  itemsByLab: LoadingState<ItemGraphQL[]>;
  itemServicesByLab: LoadingState<ItemGraphQL[]>;
  itemCategoriesForLab: LoadingState<ItemCategoryGraphQL[]>;
  bundlesRecipForLab: LoadingState<BundleGraphQL[]>;
  bundlesForLab: LoadingState<BundleGraphQL[]>;
  currencies: LoadingState<CurrencyGraphQL[]>;
  paymentTerms: LoadingState<PaymentTermGraphQL[]>;
  employees: LoadingState<EmployeeGraphQL[]>;
  employeesByLab: LoadingState<EmployeeGraphQL[]>;
  employeesByCurrentAgency: LoadingState<EmployeeGraphQL[]>;
  invoicesByLab: LoadingState<InvoiceGraphQL[]>;
  invoicesByCurrentAgency: LoadingState<InvoiceGraphQL[]>;
  invoiceForms: LoadingState<FormGraphQL[]>;
  caseForms: LoadingState<FormGraphQL[]>;
  allForms: LoadingState<FormGraphQL[]>;
  invoiceFormSubmissions: LoadingState<FormSubmissionGraphQL[]>;
  myCases: LoadingState<CaseGraphQL[]>;
  myCaseFormSubmissions: LoadingState<FormSubmissionGraphQL[]>;
  myAgencyLotStocks: LoadingState<LotStockGraphQL[]>;
  shipmentsToMyAgency: LoadingState<ShipmentGraphQL[]>;
  paymentMethods: LoadingState<PaymentMethodGraphQL[]>;
  printTemplates: LoadingState<PrintTemplateGraphQL[]>;
  invoiceFormSubmissionsByInvoiceId: LoadingState<FormSubmissionGraphQL[]>;
  invoiceFormSubmissionsByAgencyId: LoadingState<FormSubmissionGraphQL[]>;
};

const createLoadingState = <T>(initialData: T): LoadingState<T> => ({
  data: initialData,
  loading: false,
  reFetch: false,
});

const initialState: CatalogState = {
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

const catalogsSlice = createSlice({
  name: "catalogs",
  initialState,
  reducers: {
    catalogsSetReFetch: (state, action: PayloadAction<CATALOGS_NAMES>) => {
      state[action.payload].reFetch = true;
    },
    catalogsFetchStart: (state, action: PayloadAction<CATALOGS_NAMES>) => {
      state[action.payload].loading = true;
    },
    catalogsFetchSuccess: (
      state,
      action: PayloadAction<{ name: CATALOGS_NAMES; data: any[] }>
    ) => {
      state[action.payload.name].data = action.payload.data;
      state[action.payload.name].loading = false;
      state[action.payload.name].reFetch = false;
    },
  },
});

export const { catalogsFetchStart, catalogsFetchSuccess, catalogsSetReFetch } =
  catalogsSlice.actions;

export default catalogsSlice.reducer;
