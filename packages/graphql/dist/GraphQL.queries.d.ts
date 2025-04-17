export declare const getLast100ReceptionsStringQuery: (agency_id: number) => string;
export declare const getPurchaseOrderByIdNumberStringQuery: (id_number: string) => string;
export declare const getPurchaseOrderStringQuery: (id: number, config?: {
    withLotStocks: boolean;
}) => string;
export declare const getShipmentsStringQuery: ({ agency_to_id, agency_from_id, suffix, voided, delivered, shipped, returned, id_number_not_null, id_number, id_number_not_empty, withMovementLots, withPurchaseOrdersByShipmentReference, limit, id, wheres, memoILike, plannedShippingDateRange, plannedDeliveryDateRange, }: {
    agency_to_id?: number;
    agency_from_id?: number;
    suffix?: string;
    id_number_not_null?: boolean;
    voided?: boolean;
    delivered?: boolean;
    shipped?: boolean;
    returned?: boolean;
    id_number?: string;
    id_number_not_empty?: boolean;
    withMovementLots?: boolean;
    withPurchaseOrdersByShipmentReference?: boolean;
    limit?: number;
    id?: number | string;
    wheres?: string[];
    memoILike?: string;
    plannedShippingDateRange?: {
        startDate: string;
        endDate: string;
    };
    plannedDeliveryDateRange?: {
        startDate: string;
        endDate: string;
    };
}) => string;
export declare const getLotsByNameStringQuery: (name: string, entity_id: number) => string;
export declare const getLotStocksByAgencyIdStringQuery: (agency_id: number) => string;
export declare const getSerialsStringQuery: (filters: {
    name?: string;
    id?: number | string;
}) => string;
export declare const getPurchaseOrdersBetweenDatesStringQuery: (startDate: string, endDate: string, config: {
    ids?: number[] | string[];
    agencyId?: number | string;
    itemId?: number | string;
    reference?: string;
    payeeCategoryId?: number | string;
    payeeId?: number | string;
    consolidateIdFilter?: boolean;
    lotItemIdExclusion?: number;
    poDetailTagId?: number;
    withLotStocks?: boolean;
    betweenIssueDate?: boolean;
    id_number?: string;
    withPODetails?: boolean;
    withLots?: boolean;
    withShipmentPurchaseOrders?: boolean;
    withWebAppRows?: boolean;
    payeeCategoryIds?: number[];
    excludePayeeCategoryIds?: number[];
    shipment_reference?: string;
    agencyNameIlike?: string;
    discountComparisonOperator?: "_eq" | "_neq" | "_gte" | "_lte" | "_gt" | "_lt";
    discount?: number;
    excludeVoided?: boolean;
}) => string;
export declare const getPayeesStringQuery: (filters?: {
    id_number?: string;
    name?: string;
    vendor?: boolean;
    tin?: string;
}) => string;
export declare const getProvidersStringQuery = "\nquery getProviders {\n    payees (where: {vendor: {_eq: true}}) {\n        id\n        id_number\n        name\n        tin\n        address_line_1\n    }\n}\n";
export declare const getAgenciesStringQuery = "\nquery getAgencies {\n  agencies {\n    id\n    name\n    address_line_2\n  }\n}\n";
export declare const getWebAppRowStringQuery: (id: number) => string;
export declare const getWebAppRowsByWebAppTableIdStringQuery: (webapp_table_id: number) => string;
export declare const getPayeeCategoryByIdStringQuery: (id: number) => string;
export declare const getPayeeCategoriesByNotesMatchStringQuery: (match: string) => string;
export declare const getPayeeCategoriesStringQuery = "\nquery getPayeeCategories {\n  payee_categories {\n    id\n    name\n    notes\n    payees_count\n    price_list_id\n  }\n}\n";
export declare const getProviderCategoriesStringQuery = "\nquery getProviderCategories {\n  payee_categories (where: {vendor: {_eq: true}}) {\n    id\n    name\n    notes\n    payees_count\n    price_list_id\n  }\n}\n";
export declare const getClientCategoriesStringQuery = "\nquery getClientCategories {\n  payee_categories (where: {vendor: {_eq: false}}) {\n    id\n    name\n    notes\n    payees_count\n    price_list_id\n  }\n}\n";
export declare const getPayeeByIdStringQuery: (id: number) => string;
export declare const getSuperCategoryByIdStringQuery: (id: number) => string;
export declare const getItemCategoryByIdStringQuery: (id: number) => string;
export declare const getItemsByCategoryStringQuery: (id: number) => string;
export declare const getItemsStringQuery = "\nquery getItems {\n  items (where: {active: {_eq: true }}) {\n        id,\n        name,\n        code\n    }\n}\n";
export declare const getItemsBySuperCategoryStringQuery: (id: number, agency_id: number) => string;
export declare const getConsolidatesBetweenDatesStringQuery: (startDate: string, endDate: string) => string;
export declare const getEmployeeProfileStringQuery: (id: number) => string;
export declare const getEmployeesStringQuery: (filters?: {
    id?: number;
}) => string;
export declare const getEmployeesByAgencyIdStringQuery: (id: number) => string;
export declare const getBundlesByItemCategoryIdStringQuery: (id: number) => string;
export declare const getBundleByNameStringQuery: (name: string) => string;
export declare const getItemByNameStringQuery: (name: string) => string;
export declare const getAllFormsStringQuery: (config?: {
    withSubmissions: boolean;
}) => string;
export declare const getFormByNameStringQuery: (name: string) => string;
export declare const getFormsStringQuery = "\nquery getForms {\n  settings_forms (\n      order_by: {zid: desc, version: desc}\n    ) {\n      id\n      zid\n      name\n      description\n      version\n      active\n      settings_form_fields (order_by: {position: asc}) {\n        id\n        name\n        field_type\n        hint\n        required\n        default_value\n        position\n        print_var_name\n        form_id\n        settings_form_field_options {\n            id\n            label\n            position\n            value\n        }\n      }\n  }\n}\n";
export declare const getFormsByDocumentTypeStringQuery: (document_type: string, filters?: {
    formZid?: number;
}) => string;
export declare const getMyCaseFormSubmissionsStringQuery: (responsible_id: number, filters?: {
    formZid?: number;
    caseId?: number;
}) => string;
export declare const getFormSubmissionByIdStringQuery: (formId: number) => string;
export declare const getInvoiceFormSubmissionsByAgencyIdStringQuery: (agency_id: number, filters?: {
    seller_id?: number | string;
    payee_id_number_search?: string;
    some_field_value?: string;
    item_ids?: number[];
    bundle_ids?: number[];
    startDate?: string;
    endDate?: string;
    formZid?: number | string;
}) => string;
export declare const getLastInvoiceFormSubmissionStringQuery: (filters?: {
    formZid?: number;
}) => string;
export declare const getCaseFormSubmissionsByCaseIdStringQuery: (case_id: number, filters?: {
    formZid?: number;
}) => string;
export declare const getInvoiceFormSubmissionsByInvoiceIdStringQuery: (invoice_id: number, filters?: {
    formZid?: number;
}) => string;
export declare const getCurrenciesStringQuery = "\nquery getCurrencies {\n  currencies {\n    id\n    name\n    prefix\n    code\n    country\n    plural_name\n  }\n}\n";
export declare const getSuggestedPricesStringQuery: (config?: {
    notNullPriceList: boolean;
    withItems: boolean;
    withItemCategories: boolean;
    onlyCurrent: boolean;
    item_super_category_id?: number;
}) => string;
export declare const getPaymentTermsStringQuery: (config?: {
    includeAllowedDiscounts: boolean;
    includeAllowedPaymentTerms: boolean;
    onlyActives: boolean;
}) => string;
export declare const getPaymentMethodsStringQuery: (config: {
    onlyActives: boolean;
}) => string;
export declare const getPaymentTermByIdStringQuery: (id: number) => string;
export declare const getInvoicesByAgencyIdStringQuery: (id: number, filters: {
    tag_id?: string;
    invoice_id?: string;
}) => string;
export declare const getCasesStringQuery: (filters?: {
    id?: number;
    responsible_id?: number;
    client_id?: number;
    closed?: boolean;
    tag_id?: string;
    limit?: number;
}, includes?: {
    includeSerial?: boolean;
    includeResponsible?: boolean;
    includeSeller?: boolean;
}) => string;
export declare const getPrintTemplatesStringQuery = "\nquery getPrintTemplates {\n    print_templates {\n        id\n        name\n    }\n}\n";
