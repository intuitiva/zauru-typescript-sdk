import type { AgencyGraphQL, BitacoraPOMassive, BundleGraphQL, CaseGraphQL, CurrencyGraphQL, EmployeeGraphQL, FormGraphQL, InvoiceGraphQL, ItemCategoryGraphQL, ItemGraphQL, LotStockGraphQL, MotivoRechazo, PayeeCategoryGraphQL, PayeeGraphQL, PaymentTermGraphQL, ReceptionType, ShipmentGraphQL, SubmissionCasesGraphQL, SubmissionInvoicesGraphQL, SuggestedPriceGraphQL, Template, TipoMuestra, WebAppRowGraphQL, PrintTemplateGraphQL, PaymentMethodGraphQL, CCPorcentajeRechazo, SolicitudEliminacionPO, AuthorizationUpdateDiscountPO, PoDiscountHistory } from "@zauru-sdk/types";
import { CATALOGS_NAMES, ReduxParamsConfig } from "@zauru-sdk/redux";
type CatalogType<T> = {
    data: T[];
    loading: boolean;
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
export declare function useGetReduxCatalog<T>(CATALOG_NAME: CATALOGS_NAMES, { online, wheres, otherParams }?: ReduxParamsConfig): CatalogType<T>;
/**
 *
 * ======================= HOOKS
 */
export declare const useGetItems: (config?: ReduxParamsConfig) => {
    loading: boolean;
    data: ItemGraphQL[];
};
export declare const useGetItemsByReception: (config?: ReduxParamsConfig) => {
    loading: boolean;
    data: ItemGraphQL[];
};
export declare const useGetItemsByLab: (config?: ReduxParamsConfig) => {
    loading: boolean;
    data: ItemGraphQL[];
};
export declare const useGetMyAgencyLotStocks: (config?: ReduxParamsConfig) => {
    loading: boolean;
    data: LotStockGraphQL[];
};
export declare const useGetItemServicesByLab: (config?: ReduxParamsConfig) => {
    loading: boolean;
    data: ItemGraphQL[];
};
export declare const useGetItemCategoriesForLab: (config?: ReduxParamsConfig) => {
    loading: boolean;
    data: ItemCategoryGraphQL[];
};
export declare const useGetBookings: (config?: ReduxParamsConfig) => {
    loading: boolean;
    data: ShipmentGraphQL[];
};
export declare const useGetTemplates: (config?: ReduxParamsConfig) => {
    loading: boolean;
    data: WebAppRowGraphQL<Template>[];
};
export declare const useGetPayeeCategories: (config?: ReduxParamsConfig) => {
    loading: boolean;
    data: PayeeCategoryGraphQL[];
};
export declare const useGetPayeeCategoriesLabPrices: (config?: {
    withPriceListIdNull: boolean;
}) => {
    loading: boolean;
    data: PayeeCategoryGraphQL[];
};
export declare const useGetBundlesRecipForLab: (config?: ReduxParamsConfig) => {
    loading: boolean;
    data: BundleGraphQL[];
};
export declare const useGetBundlesForLab: (config?: ReduxParamsConfig) => {
    loading: boolean;
    data: BundleGraphQL[];
};
export declare const useGetCurrencies: (config?: ReduxParamsConfig) => {
    loading: boolean;
    data: CurrencyGraphQL[];
};
export declare const useGetReceptionTypes: (config?: ReduxParamsConfig) => {
    loading: boolean;
    data: WebAppRowGraphQL<ReceptionType>[];
};
export declare const useGetProviders: (config?: ReduxParamsConfig) => {
    loading: boolean;
    data: PayeeGraphQL[];
};
export declare const useGetCases: (config?: ReduxParamsConfig) => {
    loading: boolean;
    data: CaseGraphQL[];
};
export declare const useGetProviderCategories: (config?: ReduxParamsConfig) => {
    loading: boolean;
    data: PayeeCategoryGraphQL[];
};
export declare const useGetClientCategories: (config?: ReduxParamsConfig) => {
    loading: boolean;
    data: PayeeCategoryGraphQL[];
};
export declare const useGetPayees: (config?: ReduxParamsConfig) => {
    loading: boolean;
    data: PayeeGraphQL[];
};
export declare const useGetPayeesForLab: (config?: ReduxParamsConfig) => {
    loading: boolean;
    data: PayeeGraphQL[];
};
export declare const useGetPrintTemplates: (config?: ReduxParamsConfig) => {
    loading: boolean;
    data: PrintTemplateGraphQL[];
};
export declare const useGetAgencies: (config?: ReduxParamsConfig) => {
    loading: boolean;
    data: AgencyGraphQL[];
};
export declare const useGetSuggestedPrices: (config?: ReduxParamsConfig) => {
    loading: boolean;
    data: SuggestedPriceGraphQL[];
};
export declare const useGetPaymentTerms: (config?: ReduxParamsConfig) => {
    loading: boolean;
    data: PaymentTermGraphQL[];
};
export declare const useGetPaymentMethods: (config?: ReduxParamsConfig) => {
    loading: boolean;
    data: PaymentMethodGraphQL[];
};
export declare const useGetEmployeesByLab: (config?: ReduxParamsConfig) => {
    loading: boolean;
    data: EmployeeGraphQL[];
};
export declare const useGetEmployeesByCurrentAgency: (config?: ReduxParamsConfig) => {
    loading: boolean;
    data: EmployeeGraphQL[];
};
export declare const useGetEmployees: (config?: ReduxParamsConfig) => {
    loading: boolean;
    data: EmployeeGraphQL[];
};
export declare const useGetShipmentsToMyAgency: (config?: ReduxParamsConfig) => {
    loading: boolean;
    data: ShipmentGraphQL[];
};
export declare const useGetInvoicesByLab: (config?: ReduxParamsConfig) => {
    loading: boolean;
    data: InvoiceGraphQL[];
};
export declare const useGetInvoicesByCurrentAgency: (config?: ReduxParamsConfig) => {
    loading: boolean;
    data: InvoiceGraphQL[];
};
export declare const useGetTiposDeMuestra: (config?: ReduxParamsConfig) => {
    loading: boolean;
    data: WebAppRowGraphQL<TipoMuestra>[];
};
export declare const useGetMotivosDeRechazo: (config?: ReduxParamsConfig) => {
    loading: boolean;
    data: WebAppRowGraphQL<MotivoRechazo>[];
};
export declare const useGetCCPorcentajesDeRechazo: (config?: ReduxParamsConfig) => {
    loading: boolean;
    data: WebAppRowGraphQL<CCPorcentajeRechazo>[];
};
export declare const useGet4pinosSolicitudEliminacionPO: (config?: ReduxParamsConfig) => {
    loading: boolean;
    data: WebAppRowGraphQL<SolicitudEliminacionPO>[];
};
export declare const useGet4pinosPoDiscountHistory: (config?: ReduxParamsConfig) => {
    loading: boolean;
    data: WebAppRowGraphQL<PoDiscountHistory>[];
};
export declare const useGetAuthorizationsUpdateDiscountPO: (config?: ReduxParamsConfig) => {
    loading: boolean;
    data: WebAppRowGraphQL<AuthorizationUpdateDiscountPO>[];
};
export declare const useGetBitacoraRechazoMasivo: (config?: ReduxParamsConfig) => {
    loading: boolean;
    data: WebAppRowGraphQL<BitacoraPOMassive>[];
};
export declare const useGetAllForms: (config?: ReduxParamsConfig) => {
    loading: boolean;
    data: FormGraphQL[];
};
export declare const useGetInvoiceForms: (config?: ReduxParamsConfig) => {
    loading: boolean;
    data: FormGraphQL[];
};
export declare const useGetCaseForms: (config?: ReduxParamsConfig) => {
    loading: boolean;
    data: FormGraphQL[];
};
export declare const useGetInvoiceFormSubmissionsByAgencyId: (config?: ReduxParamsConfig) => {
    loading: boolean;
    data: SubmissionInvoicesGraphQL[];
};
export declare const useGetMyCaseFormSubmissions: (config?: ReduxParamsConfig) => {
    loading: boolean;
    data: SubmissionCasesGraphQL[];
};
export declare const useGetCaseFormSubmissionsByCaseId: (config?: ReduxParamsConfig) => {
    loading: boolean;
    data: SubmissionCasesGraphQL[];
};
export declare const useGetInvoiceFormSubmissionsByInvoiceId: (config?: ReduxParamsConfig) => {
    loading: boolean;
    data: SubmissionInvoicesGraphQL[];
};
export {};
