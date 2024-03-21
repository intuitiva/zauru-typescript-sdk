import type { ReceptionType } from "~/utils/zauru/webapp-tables.utils";
import type { AgencyGraphQL, BundleGraphQL, CaseGraphQL, CurrencyGraphQL, EmployeeGraphQL, FormGraphQL, InvoiceGraphQL, ItemCategoryGraphQL, ItemGraphQL, LotStockGraphQL, PayeeCategoryGraphQL, PayeeGraphQL, PaymentTermGraphQL, ShipmentGraphQL, SubmissionCasesGraphQL, SubmissionInvoicesGraphQL, SuggestedPriceGraphQL, WebAppRowGraphQL } from "~/graphql/queries";
import type { TipoMuestra } from "~/utils/zauru/tiposMuestra.utils";
import type { MotivoRechazo } from "~/services/zauru/zauru-motivos-rechazo.server";
import type { BitacoraPOMassive } from "~/utils/zauru/bitacora-edicion-masiva.utils";
import type { Template } from "~/utils/zauru/templates.utils";
/**
 *
 * ======================= HOOKS
 */
export declare const useGetItems: (config?: any) => {
    loading: boolean;
    data: ItemGraphQL[];
};
export declare const useGetItemsByReception: (config?: any) => {
    loading: boolean;
    data: ItemGraphQL[];
};
export declare const useGetItemsByLab: (config?: any) => {
    loading: boolean;
    data: ItemGraphQL[];
};
export declare const useGetMyAgencyLotStocks: (config?: any) => {
    loading: boolean;
    data: LotStockGraphQL[];
};
export declare const useGetItemServicesByLab: (config?: any) => {
    loading: boolean;
    data: ItemGraphQL[];
};
export declare const useGetItemCategoriesForLab: (config?: any) => {
    loading: boolean;
    data: ItemCategoryGraphQL[];
};
export declare const useGetBookings: (config?: any) => {
    loading: boolean;
    data: ShipmentGraphQL[];
};
export declare const useGetTemplates: (config?: any) => {
    loading: boolean;
    data: WebAppRowGraphQL<Template>[];
};
export declare const useGetPayeeCategoriesLabPrices: (config?: {
    withPriceListIdNull: boolean;
}) => {
    loading: boolean;
    data: PayeeCategoryGraphQL[];
};
export declare const useGetBundlesRecipForLab: (config?: any) => {
    loading: boolean;
    data: BundleGraphQL[];
};
export declare const useGetBundlesForLab: (config?: any) => {
    loading: boolean;
    data: BundleGraphQL[];
};
export declare const useGetCurrencies: (config?: any) => {
    loading: boolean;
    data: CurrencyGraphQL[];
};
export declare const useGetReceptionTypes: (config?: any) => {
    loading: boolean;
    data: WebAppRowGraphQL<ReceptionType>[];
};
export declare const useGetProviders: (config?: any) => {
    loading: boolean;
    data: PayeeGraphQL[];
};
export declare const useGetMyCases: (config?: any) => {
    loading: boolean;
    data: CaseGraphQL[];
};
export declare const useGetProviderCategories: (config?: any) => {
    loading: boolean;
    data: PayeeCategoryGraphQL[];
};
export declare const useGetClientCategories: (config?: any) => {
    loading: boolean;
    data: PayeeCategoryGraphQL[];
};
export declare const useGetPayees: (config?: any) => {
    loading: boolean;
    data: PayeeGraphQL[];
};
export declare const useGetPayeesForLab: (config?: any) => {
    loading: boolean;
    data: PayeeGraphQL[];
};
export declare const useGetAgencies: (config?: any) => {
    loading: boolean;
    data: AgencyGraphQL[];
};
export declare const useGetSuggestedPrices: (config?: any) => {
    loading: boolean;
    data: SuggestedPriceGraphQL[];
};
export declare const useGetPaymentTerms: (config?: any) => {
    loading: boolean;
    data: PaymentTermGraphQL[];
};
export declare const useGetEmployeesByLab: (config?: any) => {
    loading: boolean;
    data: EmployeeGraphQL[];
};
export declare const useGetEmployeesByCurrentAgency: (config?: any) => {
    loading: boolean;
    data: EmployeeGraphQL[];
};
export declare const useGetShipmentsToMyAgency: (config?: any) => {
    loading: boolean;
    data: ShipmentGraphQL[];
};
export declare const useGetInvoicesByLab: (config?: any) => {
    loading: boolean;
    data: InvoiceGraphQL[];
};
export declare const useGetTiposDeMuestra: (config?: any) => {
    loading: boolean;
    data: WebAppRowGraphQL<TipoMuestra>[];
};
export declare const useGetMotivosDeRechazo: (config?: any) => {
    loading: boolean;
    data: WebAppRowGraphQL<MotivoRechazo>[];
};
export declare const useGetBitacoraRechazoMasivo: (config?: any) => {
    loading: boolean;
    data: WebAppRowGraphQL<BitacoraPOMassive>[];
};
export declare const useGetInvoiceForms: (config?: any) => {
    loading: boolean;
    data: FormGraphQL[];
};
export declare const useGetCaseForms: (config?: any) => {
    loading: boolean;
    data: FormGraphQL[];
};
export declare const useGetInvoiceFormSubmissionsByAgencyId: (agency_id: number | string) => {
    loading: boolean;
    data: SubmissionInvoicesGraphQL[];
};
export declare const useGetMyCaseFormSubmissions: (config?: any) => {
    loading: boolean;
    data: SubmissionCasesGraphQL[];
};
export declare const useGetInvoiceFormSubmissionsByInvoiceId: (invoice_id: number | string) => {
    loading: boolean;
    data: SubmissionInvoicesGraphQL[];
};
