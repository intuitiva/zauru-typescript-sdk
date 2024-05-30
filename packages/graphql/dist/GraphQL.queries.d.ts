export declare const getLast100ReceptionsStringQuery = "\nquery getLast100Receptions($agencyId: Int) @cached {\n  purchase_orders(limit: 100, order_by: {created_at: desc}, where: {voided: {_eq: false}, agency_id: {_eq: $agencyId}}) {\n    id\n    created_at\n    due\n    id_number\n    memo\n    payee_id\n    issue_date\n    discount\n    other_charges\n    authorized\n    received\n    transport_type\n    purchase_order_details {\n      item_id\n      id\n      reference\n      booked_quantity\n      delivered_quantity\n    }\n    lots(where: {active: {_eq: true}}) {\n      id\n      name\n      description\n      item_id\n    }\n  }\n}\n";
export declare const getPurchaseOrderByIdNumberStringQuery = "\nquery getPurchaseOrderByIdNumber($id_number: String) @cached {\n  purchase_orders(where: {id_number: {_eq: $id_number}}) {\n    id\n    created_at\n    due\n    id_number\n    memo\n    payee_id\n    transport_type\n    reference\n    incoterm_destination\n    issue_date\n    voided\n    received\n    discount\n    other_charges\n    webapp_table_rowables {\n        webapp_rows {\n            data\n        }\n    }\n    purchase_order_details {\n      item_id\n      id\n      reference\n      booked_quantity\n      delivered_quantity\n    }\n    lots(where: {active: {_eq: true}}) {\n      id\n      description\n    }\n    receptions {\n        id\n        received\n        voided\n    }\n    shipments {\n        shipment_id\n    }\n  }\n}\n";
export declare const getPurchaseOrderStringQuery: (config?: {
    withLotStocks: boolean;
}) => string;
export declare const getShipmentsByToAgencyLast100StringQuery = "\nquery getShipmentsByToAgencyLast100(\n    $agency_to_id: Int\n  ){\n    shipments(limit: 100, order_by: {id: desc}, where: {voided: {_eq: false}, shipped: {_eq: false}, delivered: {_eq: false}, agency_to_id: {_eq: $agency_to_id}}) {\n      id\n      zid\n      id_number\n      reference\n      needs_transport\n      payee_id\n      income\n      booker_id\n      agency_from_id\n      agency_to_id\n      transporter_id\n      created_at\n      movements {\n        id\n        booked_quantity\n        delivered_quantity\n        reference\n        lot {\n          id\n          name\n          description\n        }\n      }\n    }\n  }\n";
export declare const getLotsByNameStringQuery = "\nquery getLots($name: String, $entity_id: Int){\n    lots (limit: 100, order_by: {id: desc}, where: {entity_id: {_eq: $entity_id}, name: {_eq: $name}}) {\n        id\n        name\n        description\n    }\n}\n";
export declare const getLotStocksByAgencyIdStringQuery = "\nquery getLotStocksByAgencyId($agency_id: Int){\n  lot_stocks (\n    order_by: { id: desc },\n    where: { agency_id: { _eq: $agency_id }}\n    ){\n      id\n      available\n      lot_id\n      lot {\n        id\n        item_id\n        expires\n      }\n  }\n}\n";
export declare const getPurchaseOrdersBetweenDatesStringQuery: (config?: {
    agencyId?: number | string;
    itemId?: number | string;
    payeeCategoryId?: number | string;
    consolidateIdFilter?: boolean;
    lotItemIdExclusion?: number;
    poDetailTagId?: number;
    withLotStocks?: boolean;
    betweenIssueDate?: boolean;
    id_number?: string;
}) => string;
export declare const getPayeesStringQuery = "\nquery getPayees {\n    payees {\n        id\n        id_number\n        name\n        tin\n        vendor\n        address_line_1\n    }\n}\n";
export declare const getProvidersStringQuery = "\nquery getProviders {\n    payees (where: {vendor: {_eq: true}}) {\n        id\n        id_number\n        name\n        tin\n        address_line_1\n    }\n}\n";
export declare const getAgenciesStringQuery = "\nquery getAgencies {\n  agencies {\n    id\n    name\n  }\n}\n";
export declare const getWebAppRowStringQuery = "\nquery getWebAppRow($id: Int){\n  webapp_rows(where: {id: {_eq: $id}}) {\n    data\n  }\n}\n";
export declare const getWebAppRowsByWebAppTableIdStringQuery = "\nquery getWebAppRowsByWebAppTableId ($webapp_table_id: Int) {\n  webapp_rows (\n    where: {\n      webapp_table_id: {\n        _eq: $webapp_table_id \n      }\n    },\n    order_by: { \n      id: desc \n    }\n  ) {\n    id\n    data\n    created_at\n  }\n}\n";
export declare const getPayeeCategoryByIdStringQuery = "\nquery getPayeeCategoryById ($id: Int) {\n  payee_categories (where: {id: {_eq: $id }}) {\n      payees (order_by: { id: desc }) { \n          id\n          name\n          id_number\n          email\n          phone\n          tin\n          active\n          address_line_1\n      }\n  }\n}\n";
export declare const getPayeeCategoriesByNotesMatchStringQuery: (match: string) => string;
export declare const getPayeeCategoriesStringQuery = "\nquery getPayeeCategories {\n  payee_categories {\n    id\n    name\n    notes\n    payees_count\n    price_list_id\n  }\n}\n";
export declare const getProviderCategoriesStringQuery = "\nquery getProviderCategories {\n  payee_categories (where: {vendor: {_eq: true}}) {\n    id\n    name\n    notes\n    payees_count\n    price_list_id\n  }\n}\n";
export declare const getClientCategoriesStringQuery = "\nquery getClientCategories {\n  payee_categories (where: {vendor: {_eq: false}}) {\n    id\n    name\n    notes\n    payees_count\n    price_list_id\n  }\n}\n";
export declare const getPayeeByIdStringQuery = "\nquery getPayeeById ($id: Int) {\n  payees (where: {id: {_eq: $id }}) {\n    id\n    name\n    id_number\n    email\n    phone\n    tin\n    active\n    address_line_1\n  }\n}\n";
export declare const getSuperCategoryByIdStringQuery = "\nquery getSuperCategoryById ($id: Int) {\n  item_super_categories (where: {id: {_eq: $id }}) {\n    item_categories {\n        id\n        name\n        notes\n        items_count\n    }\n  }\n}\n";
export declare const getItemCategoryByIdStringQuery = "\nquery getItemCategoryById ($id: Int) {\n  item_categories (where: {id: {_eq: $id }}) {\n        id\n        name\n        notes\n        items_count\n  }\n}\n";
export declare const getItemsByCategoryStringQuery = "\nquery getItemsByCategory ($id: Int) {\n  item_categories (where: {id: {_eq: $id }}) {\n        items (where: {active: {_eq: true }}) {\n            id,\n            name,\n            stocks_only_integer,\n            code\n            product_type\n        }\n  }\n}\n";
export declare const getItemsStringQuery = "\nquery getItems {\n  items (where: {active: {_eq: true }}) {\n        id,\n        name,\n        code\n    }\n}\n";
export declare const getItemsBySuperCategoryStringQuery = "\nquery getItemsBySuperCategory ($id: Int, $agency_id: Int) {\n  item_super_categories (where: {id: {_eq: $id }}, order_by: {id: desc}) {\n      item_categories {\n        items (where: {active: {_eq: true }}) {\n            id,\n            name,\n            stocks_only_integer,\n            code,\n            item_category_id,\n            measurement_unit,\n            description\n            product_type\n            stocks(where: {agency_id: {_eq: $agency_id}}, order_by: {id: desc}) {\n              available\n              id\n              incoming\n              outgoing\n            }\n        }\n  }\n  }\n}\n";
export declare const getConsolidatesBetweenDatesStringQuery = "\nquery getConsolidatesBetweenDates ($startDate: timestamp, $endDate: timestamp) {\n  consolidates (order_by: {id: desc}, where: {created_at: {_gte: $startDate, _lte: $endDate}}) {\n      id\n      id_number\n      created_at\n      name\n      purchase_orders {\n          id\n          due\n      }\n  }\n}\n";
export declare const getEmployeeProfileStringQuery = "\nquery getEmployeeProfile ($id: Int) {\n  employees(where: {id: {_eq: $id}}) {\n    agency_id\n    email\n    entity_id\n    id\n    name\n    user_id\n  }\n}\n";
export declare const getEmployeesByAgencyIdStringQuery = "\nquery getEmployeesByAgencyId ($id: Int) {\n  employees(where: {agency_id: {_eq: $id}}) {\n    name\n    id\n    user_id\n  }\n}\n";
export declare const getBundlesByItemCategoryIdStringQuery = "\nquery getBundlesByItemCategoryId ($id: Int) {\n  bundles(where: {active: {_eq: true}, item_category_id: {_eq: $id}}) {\n    id\n    code\n    description\n    name\n    updated_at\n    image5\n    bundle_details_count\n    bundle_details {\n      id\n      item_id\n      quantity\n    }\n  }\n}\n";
export declare const getBundleByNameStringQuery = "\nquery getBundleByName ($name: String) {\n  bundles (where: {name: {_eq: $name }}) {\n    id\n  }\n}\n";
export declare const getItemByNameStringQuery = "\nquery getItemByName ($name: String) {\n  items (where: {active: {_eq: true }, name: {_eq: $name }}) {\n      id\n      name\n      stocks_only_integer\n      code\n      product_type\n  }\n}\n";
export declare const getShipmentsStringQuery: (wheres?: string[]) => string;
export declare const getAllFormsStringQuery: (config?: {
    withSubmissions: boolean;
}) => string;
export declare const getFormByNameStringQuery = "\nquery getFormByName ($name: String) {\n  settings_forms (\n      where: {name: {_eq: $name }},\n      order_by: {zid: desc, version: desc}\n    ) {\n      id\n      zid\n      name\n      description\n      version\n      active\n      settings_form_fields (order_by: {position: asc}) {\n        id\n        name\n        field_type\n        hint\n        required\n        default_value\n        position\n        print_var_name\n        form_id\n        settings_form_field_options {\n            id\n            label\n            position\n            value\n        }\n      }\n  }\n}\n";
export declare const getFormsStringQuery = "\nquery getForms {\n  settings_forms (\n      order_by: {zid: desc, version: desc}\n    ) {\n      id\n      zid\n      name\n      description\n      version\n      active\n      settings_form_fields (order_by: {position: asc}) {\n        id\n        name\n        field_type\n        hint\n        required\n        default_value\n        position\n        print_var_name\n        form_id\n        settings_form_field_options {\n            id\n            label\n            position\n            value\n        }\n      }\n  }\n}\n";
export declare const getFormsByDocumentTypeStringQuery: (filters?: {
    formZid?: number;
}) => string;
export declare const getMyCaseFormSubmissionsStringQuery: (filters?: {
    formZid?: number;
    caseId?: number;
}) => string;
export declare const getFormSubmissionByIdStringQuery = "\nquery getFormSubmissionById ($formId: bigint) {\n  settings_form_submissions (where: {id: { _eq: $formId }}) {\n      id\n      zid\n      reference\n      created_at\n      version\n      id_number\n      settings_form {\n        id\n        name\n        description\n      }\n      settings_form_submission_values {\n        id\n        form_field_id\n        value\n        settings_form_field {\n          id\n          name\n          print_var_name\n          field_type\n          settings_form_field_options {\n              id\n              label\n              position\n              value\n          }\n        }\n      }\n  }\n}\n";
export declare const getInvoiceFormSubmissionsByAgencyIdStringQuery: (filters?: {
    seller_id?: number | string;
    payee_id_number_search?: string;
    some_field_value?: string;
    item_ids?: number[];
    bundle_ids?: number[];
    startDate?: string;
    endDate?: string;
}) => string;
export declare const getLastInvoiceFormSubmissionStringQuery: (filters?: {
    formZid?: number;
}) => string;
export declare const getInvoiceFormSubmissionsByInvoiceIdStringQuery: (filters?: {
    formZid?: number;
}) => string;
export declare const getCurrenciesStringQuery = "\nquery getCurrencies {\n  currencies {\n    id\n    name\n    prefix\n    code\n    country\n    plural_name\n  }\n}\n";
export declare const getSuggestedPricesStringQuery: (config?: {
    notNullPriceList: boolean;
    withItems: boolean;
    withItemCategories: boolean;
    onlyCurrent: boolean;
}) => string;
export declare const getPaymentTermsStringQuery = "\nquery getPaymentTerms {\n  payment_terms {\n    active\n    id\n    memo\n    name\n  }\n}\n";
export declare const getPaymentTermByIdStringQuery = "\nquery getPaymentTermById ($id: Int) {\n  payment_terms (where: {id: {_eq: $id }}) {\n    active\n    id\n    memo\n    name\n    account_from_id\n    account_to_id\n    allowed_payment_terms {\n      payee_category_id\n    }\n  }\n}\n";
export declare const getInvoicesByAgencyIdStringQuery = "\nquery getInvoicesByAgencyId($id: Int) {\n  invoices(limit: 1000, where: {agency_id: {_eq: $id}, voided: {_eq: false}}, order_by: {id: desc}) {\n    id\n    zid\n    id_number\n    currency_id\n    date\n    payee_id\n    total\n    subtotal\n    seller_id\n    order_number\n    memo\n    issued\n    invoice_number\n    id_number\n    payment_term_id\n    reference\n    submission_invoices {\n      id\n      settings_form_submission {\n        zid\n        voided\n        settings_form {\n          id\n          zid\n        }\n      }\n    }\n    invoice_details {\n      bundle_id\n      id\n      item_bundle_name\n      item_bundle_description\n      item_id\n      price\n      quantity\n      unit_price\n    }\n    payee {\n      name\n      payee_category_id\n    }\n  }\n}\n";
export declare const getCasesByResponsibleIdStringQuery: (wheres?: string[]) => string;
