"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPrintTemplatesStringQuery = exports.getCasesByResponsibleIdStringQuery = exports.getInvoicesByAgencyIdStringQuery = exports.getPaymentTermByIdStringQuery = exports.getPaymentMethodsStringQuery = exports.getPaymentTermsStringQuery = exports.getSuggestedPricesStringQuery = exports.getCurrenciesStringQuery = exports.getInvoiceFormSubmissionsByInvoiceIdStringQuery = exports.getLastInvoiceFormSubmissionStringQuery = exports.getInvoiceFormSubmissionsByAgencyIdStringQuery = exports.getFormSubmissionByIdStringQuery = exports.getMyCaseFormSubmissionsStringQuery = exports.getFormsByDocumentTypeStringQuery = exports.getFormsStringQuery = exports.getFormByNameStringQuery = exports.getAllFormsStringQuery = exports.getShipmentsStringQuery = exports.getItemByNameStringQuery = exports.getBundleByNameStringQuery = exports.getBundlesByItemCategoryIdStringQuery = exports.getEmployeesByAgencyIdStringQuery = exports.getEmployeeProfileStringQuery = exports.getConsolidatesBetweenDatesStringQuery = exports.getItemsBySuperCategoryStringQuery = exports.getItemsStringQuery = exports.getItemsByCategoryStringQuery = exports.getItemCategoryByIdStringQuery = exports.getSuperCategoryByIdStringQuery = exports.getPayeeByIdStringQuery = exports.getClientCategoriesStringQuery = exports.getProviderCategoriesStringQuery = exports.getPayeeCategoriesStringQuery = exports.getPayeeCategoriesByNotesMatchStringQuery = exports.getPayeeCategoryByIdStringQuery = exports.getWebAppRowsByWebAppTableIdStringQuery = exports.getWebAppRowStringQuery = exports.getAgenciesStringQuery = exports.getProvidersStringQuery = exports.getPayeesStringQuery = exports.getPurchaseOrdersBetweenDatesStringQuery = exports.getLotStocksByAgencyIdStringQuery = exports.getLotsByNameStringQuery = exports.getShipmentsByToAgencyLast100StringQuery = exports.getPurchaseOrderStringQuery = exports.getPurchaseOrderByIdNumberStringQuery = exports.getLast100ReceptionsStringQuery = void 0;
exports.getLast100ReceptionsStringQuery = `
query getLast100Receptions($agencyId: Int) @cached {
  purchase_orders(limit: 100, order_by: {created_at: desc}, where: {voided: {_eq: false}, agency_id: {_eq: $agencyId}}) {
    id
    created_at
    due
    id_number
    memo
    payee_id
    issue_date
    discount
    other_charges
    authorized
    received
    transport_type
    purchase_order_details {
      item_id
      id
      reference
      booked_quantity
      delivered_quantity
    }
    lots(where: {active: {_eq: true}}) {
      id
      name
      description
      item_id
    }
  }
}
`;
exports.getPurchaseOrderByIdNumberStringQuery = `
query getPurchaseOrderByIdNumber($id_number: String) @cached {
  purchase_orders(where: {id_number: {_eq: $id_number}}) {
    id
    created_at
    due
    id_number
    memo
    payee_id
    transport_type
    reference
    incoterm_destination
    issue_date
    voided
    received
    discount
    other_charges
    webapp_table_rowables {
        webapp_rows {
            data
        }
    }
    purchase_order_details {
      item_id
      id
      reference
      booked_quantity
      delivered_quantity
    }
    lots(where: {active: {_eq: true}}) {
      id
      description
    }
    receptions {
        id
        received
        voided
    }
    shipments {
        shipment_id
    }
  }
}
`;
const getPurchaseOrderStringQuery = (config = { withLotStocks: false }) => `
query getPurchaseOrder($id: Int) @cached {
  purchase_orders(where: {id: {_eq: $id}}) {
    id
    agency_id
    entity_id
    created_at
    due
    id_number
    memo
    payee_id
    transport_type
    reference
    incoterm_destination
    issue_date
    voided
    received
    discount
    delivery_date
    other_charges
    webapp_table_rowables {
        webapp_rows {
            data
        }
    }
    purchase_order_details {
      item_id
      id
      reference
      booked_quantity
      delivered_quantity
      item {
        name
      }
    }
    lots(where: {active: {_eq: true}}) {
      id
      name
      description
      ${config.withLotStocks
    ? `lot_stocks {
              id
              available
              incoming
              outgoing
              agency_id
            }`
    : ""}
    }
    receptions {
        id
        received
        voided
        agency_id
        entity_id
        reception_details {
          purchase_order_detail_id
          item_id
          lot_delivered_quantity
          lot_description
          lot_expire
          lot_name
        }
    }
    shipment_purchase_orders {
        shipment_id
    }
  }
}
`;
exports.getPurchaseOrderStringQuery = getPurchaseOrderStringQuery;
exports.getShipmentsByToAgencyLast100StringQuery = `
query getShipmentsByToAgencyLast100(
    $agency_to_id: Int
  ){
    shipments(limit: 100, order_by: {id: desc}, where: {voided: {_eq: false}, shipped: {_eq: false}, delivered: {_eq: false}, agency_to_id: {_eq: $agency_to_id}}) {
      id
      zid
      id_number
      reference
      needs_transport
      payee_id
      income
      booker_id
      agency_from_id
      agency_to_id
      transporter_id
      created_at
      movements {
        id
        booked_quantity
        delivered_quantity
        reference
        lot {
          id
          name
          description
        }
      }
    }
  }
`;
exports.getLotsByNameStringQuery = `
query getLots($name: String, $entity_id: Int){
    lots (limit: 100, order_by: {id: desc}, where: {entity_id: {_eq: $entity_id}, name: {_eq: $name}}) {
        id
        name
        description
    }
}
`;
exports.getLotStocksByAgencyIdStringQuery = `
query getLotStocksByAgencyId($agency_id: Int){
  lot_stocks (
    order_by: { id: desc },
    where: { agency_id: { _eq: $agency_id }}
    ){
      id
      available
      lot_id
      lot {
        id
        item_id
        expires
      }
  }
}
`;
const getPurchaseOrdersBetweenDatesStringQuery = (config) => {
    const conditions = [];
    if (config.agencyId) {
        conditions.push(`agency_id: { _eq: ${config.agencyId} }`);
    }
    if (config.consolidateIdFilter) {
        conditions.push("consolidate_id: { _is_null: true }");
    }
    if (config.id_number) {
        conditions.push(`id_number: { _ilike: "%${config.id_number}%" }`);
    }
    if (config.payeeId || config.payeeCategoryId) {
        const payeeConditions = [];
        if (config.payeeId) {
            payeeConditions.push(`id: { _eq: ${config.payeeId} }`);
        }
        if (config.payeeCategoryId) {
            payeeConditions.push(`payee_category: { id: { _eq: ${config.payeeCategoryId} } }`);
        }
        conditions.push(`payee: { ${payeeConditions.join(", ")} }`);
    }
    if (config.itemId) {
        conditions.push(`purchase_order_details: { item_id: { _eq: ${config.itemId} } }`);
    }
    if (config.lotItemIdExclusion) {
        conditions.push(`lots: { item_id: { _neq: ${config.lotItemIdExclusion} } }`);
    }
    if (config.poDetailTagId) {
        conditions.push(`purchase_order_details: { tag_id: { _eq: ${config.poDetailTagId} } }`);
    }
    if (!config.id_number) {
        conditions.push(config.betweenIssueDate
            ? "issue_date: { _gte: $startDate, _lte: $endDate }"
            : "created_at: { _gte: $startDate, _lte: $endDate }");
    }
    if (config.payeeCategoryIds && config.payeeCategoryIds.length > 0) {
        conditions.push(`payee: { payee_category: { id: { _in: [${config.payeeCategoryIds.join(",")}] } } }`);
    }
    if (config.excludePayeeCategoryIds &&
        config.excludePayeeCategoryIds.length > 0) {
        conditions.push(`payee: { payee_category: { id: { _nin: [${config.excludePayeeCategoryIds.join(",")}] } } }`);
    }
    const whereClause = conditions.length
        ? `where: { ${conditions.join(", ")} }`
        : "";
    const dateVariables = config.id_number
        ? ""
        : `(
        $startDate: ${config.betweenIssueDate ? "date" : "timestamp"},
        $endDate: ${config.betweenIssueDate ? "date" : "timestamp"}
      )`;
    const lotStocksFragment = config.withLotStocks
        ? `
      lot_stocks {
        id
        available
        incoming
        outgoing
        agency_id
      }
    `
        : "";
    const purchaseOrderDetails = config.withPODetails
        ? `purchase_order_details {
            item_id
            id
            reference
            booked_quantity
            delivered_quantity
          }`
        : "";
    const lots = config.withLots
        ? `lots {
              id
              name
              description
              ${lotStocksFragment}
            }`
        : "";
    const webAppRows = config.withWebAppRows
        ? `webapp_table_rowables {
            webapp_rows {
                data
            }
        }`
        : "";
    const shipmentPurchase = config.withShipmentPurchaseOrders
        ? `shipment_purchase_orders {
    shipment {
      id
      zid
      id_number
      reference
      needs_transport
      payee_id
      income
      booker_id
      agency_from_id
      agency_to_id
    }
  }`
        : "";
    return `
    query getPurchaseOrdersBetweenDates ${dateVariables} {
      purchase_orders (
        order_by: { id: desc },
        ${whereClause}
      ) {
        id
        created_at
        due
        id_number
        memo
        payee_id
        issue_date
        agency_id
        discount
        other_charges
        consolidate_id
        ${purchaseOrderDetails}
        ${lots}
        ${webAppRows}
        ${shipmentPurchase}
      }
    }
  `;
};
exports.getPurchaseOrdersBetweenDatesStringQuery = getPurchaseOrdersBetweenDatesStringQuery;
exports.getPayeesStringQuery = `
query getPayees {
    payees {
        id
        id_number
        name
        tin
        vendor
        address_line_1
    }
}
`;
exports.getProvidersStringQuery = `
query getProviders {
    payees (where: {vendor: {_eq: true}}) {
        id
        id_number
        name
        tin
        address_line_1
    }
}
`;
exports.getAgenciesStringQuery = `
query getAgencies {
  agencies {
    id
    name
  }
}
`;
exports.getWebAppRowStringQuery = `
query getWebAppRow($id: Int){
  webapp_rows(where: {id: {_eq: $id}}) {
    data
  }
}
`;
exports.getWebAppRowsByWebAppTableIdStringQuery = `
query getWebAppRowsByWebAppTableId ($webapp_table_id: Int) {
  webapp_rows (
    where: {
      webapp_table_id: {
        _eq: $webapp_table_id 
      }
    },
    order_by: { 
      id: desc 
    }
  ) {
    id
    data
    created_at
  }
}
`;
exports.getPayeeCategoryByIdStringQuery = `
query getPayeeCategoryById ($id: Int) {
  payee_categories (where: {id: {_eq: $id }}) {
      payees (order_by: { id: desc }) { 
          id
          name
          id_number
          email
          phone
          tin
          active
          address_line_1
          vendor
      }
  }
}
`;
const getPayeeCategoriesByNotesMatchStringQuery = (match) => `
query getPayeeCategoriesByNotesMatch {
  payee_categories(where: {notes: {_ilike: "%${match}%" }}) {
    id
    name
    notes
    payees_count
    price_list_id
    price_list {
      id
      name
    }
    payees(order_by: {id: desc}) {
      id
      name
      id_number
      email
      phone
      tin
      active
      payee_category_id
      allowed_payment_terms {
        payment_term_id
      }
    }
  }
}
`;
exports.getPayeeCategoriesByNotesMatchStringQuery = getPayeeCategoriesByNotesMatchStringQuery;
exports.getPayeeCategoriesStringQuery = `
query getPayeeCategories {
  payee_categories {
    id
    name
    notes
    payees_count
    price_list_id
  }
}
`;
exports.getProviderCategoriesStringQuery = `
query getProviderCategories {
  payee_categories (where: {vendor: {_eq: true}}) {
    id
    name
    notes
    payees_count
    price_list_id
  }
}
`;
exports.getClientCategoriesStringQuery = `
query getClientCategories {
  payee_categories (where: {vendor: {_eq: false}}) {
    id
    name
    notes
    payees_count
    price_list_id
  }
}
`;
exports.getPayeeByIdStringQuery = `
query getPayeeById ($id: Int) {
  payees (where: {id: {_eq: $id }}) {
    id
    name
    id_number
    email
    phone
    tin
    active
    address_line_1
  }
}
`;
exports.getSuperCategoryByIdStringQuery = `
query getSuperCategoryById ($id: Int) {
  item_super_categories (where: {id: {_eq: $id }}) {
    item_categories {
        id
        name
        notes
        items_count
    }
  }
}
`;
exports.getItemCategoryByIdStringQuery = `
query getItemCategoryById ($id: Int) {
  item_categories (where: {id: {_eq: $id }}) {
        id
        name
        notes
        items_count
  }
}
`;
exports.getItemsByCategoryStringQuery = `
query getItemsByCategory ($id: Int) {
  item_categories (where: {id: {_eq: $id }}) {
        items (where: {active: {_eq: true }}) {
            id,
            name,
            stocks_only_integer,
            code
            product_type
        }
  }
}
`;
exports.getItemsStringQuery = `
query getItems {
  items (where: {active: {_eq: true }}) {
        id,
        name,
        code
    }
}
`;
exports.getItemsBySuperCategoryStringQuery = `
query getItemsBySuperCategory ($id: Int, $agency_id: Int) {
  item_super_categories (where: {id: {_eq: $id }}, order_by: {id: desc}) {
      item_categories {
        items (where: {active: {_eq: true }}) {
            id,
            name,
            stocks_only_integer,
            code,
            item_category_id,
            measurement_unit,
            description
            product_type
            stocks(where: {agency_id: {_eq: $agency_id}}, order_by: {id: desc}) {
              available
              id
              incoming
              outgoing
            }
        }
  }
  }
}
`;
exports.getConsolidatesBetweenDatesStringQuery = `
query getConsolidatesBetweenDates ($startDate: timestamp, $endDate: timestamp) {
  consolidates (order_by: {id: desc}, where: {created_at: {_gte: $startDate, _lte: $endDate}}) {
      id
      id_number
      created_at
      name
      purchase_orders {
          id
          due
      }
  }
}
`;
exports.getEmployeeProfileStringQuery = `
query getEmployeeProfile ($id: Int) {
  employees(where: {id: {_eq: $id}}) {
    agency_id
    email
    entity_id
    id
    name
    user_id
    seller
    active
    accountant
    inventory_controller
    buyer
    support_agent
  }
}
`;
exports.getEmployeesByAgencyIdStringQuery = `
query getEmployeesByAgencyId ($id: Int) {
  employees(where: {agency_id: {_eq: $id}}) {
    name
    id
    user_id
    email
    seller
    active
    accountant
    inventory_controller
    buyer
    support_agent
  }
}
`;
exports.getBundlesByItemCategoryIdStringQuery = `
query getBundlesByItemCategoryId ($id: Int) {
  bundles(where: {active: {_eq: true}, item_category_id: {_eq: $id}}) {
    id
    code
    description
    name
    updated_at
    image5
    bundle_details_count
    bundle_details {
      id
      item_id
      quantity
    }
  }
}
`;
exports.getBundleByNameStringQuery = `
query getBundleByName ($name: String) {
  bundles (where: {name: {_eq: $name }}) {
    id
  }
}
`;
exports.getItemByNameStringQuery = `
query getItemByName ($name: String) {
  items (where: {active: {_eq: true }, name: {_eq: $name }}) {
      id
      name
      stocks_only_integer
      code
      product_type
  }
}
`;
const getShipmentsStringQuery = (wheres = []) => {
    const additionalWheres = wheres.join(",");
    return `query getShipments {
      shipments (${additionalWheres.length > 0 ? `where: {${additionalWheres}},` : ""} order_by: {id: desc}) {
        id
        id_number
        reference
        needs_transport
        payee_id
        booker_id
        shipped
        shipper_id
        delivered
        delivered_at
        voided
        returned
        memo
        planned_delivery
      }
    }
  `;
};
exports.getShipmentsStringQuery = getShipmentsStringQuery;
const getAllFormsStringQuery = (config = { withSubmissions: false }) => `
query getAllForms {
  settings_forms (
      order_by: {zid: desc, version: desc}
    ) {
      id
      zid
      name
      description
      version
      active
      ${config.withSubmissions
    ? `settings_form_submissions {
                id
                zid
                reference
                created_at
                version
                id_number
                user_id
                settings_form_submission_values {
                  id
                  form_field_id
                  value
                  settings_form_field {
                    id
                    name
                    print_var_name
                    field_type
                    settings_form_field_options {
                        id
                        label
                        position
                        value
                    }
                  }
                }
              }`
    : ""}
      settings_form_fields (order_by: {position: asc}) {
        id
        name
        field_type
        hint
        required
        default_value
        position
        print_var_name
        form_id
        settings_form_field_options {
            id
            label
            position
            value
        }
      }
  }
}
`;
exports.getAllFormsStringQuery = getAllFormsStringQuery;
exports.getFormByNameStringQuery = `
query getFormByName ($name: String) {
  settings_forms (
      where: {name: {_eq: $name }},
      order_by: {zid: desc, version: desc}
    ) {
      id
      zid
      name
      description
      version
      active
      settings_form_fields (order_by: {position: asc}) {
        id
        name
        field_type
        hint
        required
        default_value
        position
        print_var_name
        form_id
        settings_form_field_options {
            id
            label
            position
            value
        }
      }
  }
}
`;
exports.getFormsStringQuery = `
query getForms {
  settings_forms (
      order_by: {zid: desc, version: desc}
    ) {
      id
      zid
      name
      description
      version
      active
      settings_form_fields (order_by: {position: asc}) {
        id
        name
        field_type
        hint
        required
        default_value
        position
        print_var_name
        form_id
        settings_form_field_options {
            id
            label
            position
            value
        }
      }
  }
}
`;
const getFormsByDocumentTypeStringQuery = (filters = {}) => `
query getFormsByDocumentType ($document_type: String) {
  settings_forms (
      where: {
        ${filters?.formZid ? `zid: {_eq: ${filters?.formZid}},` : ""}
        document_type: {_eq: $document_type}
      },
      order_by: {zid: desc, version: desc}
    ) {
      id
      zid
      name
      description
      version
      active
      settings_form_fields (order_by: {position: asc}) {
        id
        name
        field_type
        hint
        required
        default_value
        position
        print_var_name
        form_id
        settings_form_field_table_headers {
          id
          name
          cell_type
          position
        }
        settings_form_field_options {
            id
            label
            position
            value
        }
      }
  }
}
`;
exports.getFormsByDocumentTypeStringQuery = getFormsByDocumentTypeStringQuery;
const getMyCaseFormSubmissionsStringQuery = (filters = {}) => `
query getMyCaseFormSubmissions ($responsible_id: Int) {
  submission_cases (
    limit: 500,
    where: {
      settings_form_submission: {
          ${filters?.formZid
    ? `settings_form: {zid: {_eq: ${filters?.formZid}}},`
    : ""}
        voided: {_eq: false}
      },
      case: {
          ${filters?.caseId ? `id: {_eq: ${filters?.caseId}},` : ""}
        responsible_id: {_eq: $responsible_id}
      }
    },
    order_by: {id: desc})
    {
    id
    case_id
    form_submission_id
    case {
      id
      id_number
      reference
      date
      symptom
      solution
      memo
      client {
        name
        address_line_1
      }
    }
    settings_form_submission {
      id
      zid
      reference
      created_at
      version
      id_number
      user_id
      settings_form_submission_values {
        id
        form_field_id
        value
        settings_form_field {
          id
          name
          print_var_name
          field_type
          settings_form_field_options {
              id
              label
              position
              value
          }
        }
      }
      settings_form {
        id
        name
        zid
        description
        created_at
        version
      }
    }
  }
}
`;
exports.getMyCaseFormSubmissionsStringQuery = getMyCaseFormSubmissionsStringQuery;
exports.getFormSubmissionByIdStringQuery = `
query getFormSubmissionById ($formId: bigint) {
  settings_form_submissions (where: {id: { _eq: $formId }}) {
      id
      zid
      reference
      created_at
      version
      id_number
      settings_form {
        id
        name
        description
      }
      settings_form_submission_values {
        id
        form_field_id
        value
        settings_form_field {
          id
          name
          print_var_name
          field_type
          settings_form_field_options {
              id
              label
              position
              value
          }
        }
      }
  }
}
`;
const getInvoiceFormSubmissionsByAgencyIdStringQuery = (filters) => {
    return `
query getInvoiceFormSubmissionsByAgencyId (
  $agency_id: Int
  ) {
  submission_invoices(
    where: {
      settings_form_submission: {
        ${filters?.formZid
        ? `settings_form: {zid: {_eq: ${filters?.formZid}}},`
        : ""}
        ${filters?.some_field_value
        ? `settings_form_submission_values: {
                  value: { _eq: "${filters?.some_field_value}" }
                },`
        : ""}
        voided: {_eq: false}
      },
      ${filters?.startDate?.length && filters?.endDate?.length
        ? `created_at: { _gte: "${filters?.startDate}T00:00:00", _lte: "${filters?.endDate}T00:00:00" },`
        : ""}
      invoice: {
        agency_id: {_eq: $agency_id},
        ${filters?.seller_id ? `seller_id: {_eq: ${filters?.seller_id} },` : ""}
        ${filters?.payee_id_number_search
        ? `payee: { 
                id_number: { _ilike: "%${filters?.payee_id_number_search}%"} 
              },`
        : ""}
        ${filters?.item_ids?.length
        ? `invoice_details: {item_id: {_in: [${filters?.item_ids?.join(",")}]}}`
        : ""}
        ${filters?.bundle_ids?.length
        ? `invoice_details: {bundle_id: {_in: [${filters?.bundle_ids?.join(",")}]}}`
        : ""}
        voided: {_eq: false}
      }
    },
    order_by: {id: desc}
    )
    {
      id
      invoice_id
      form_submission_id
      created_at
      invoice {
        id_number
        date
        currency_id
        order_number
        seller_id
        payee_id
        payee {
          id_number
          name
        }
      }
      settings_form_submission {
        id
        zid
        reference
        created_at
        version
        id_number
        settings_form_submission_values {
          id
          form_field_id
          value
          settings_form_field {
            id
            name
            print_var_name
            settings_form_field_options {
                id
                label
                position
                value
            }
          }
        }
        settings_form {
          id
          name
          zid
          description
          created_at
          version
        }
      }
    }
  }
`;
};
exports.getInvoiceFormSubmissionsByAgencyIdStringQuery = getInvoiceFormSubmissionsByAgencyIdStringQuery;
const getLastInvoiceFormSubmissionStringQuery = (filters = {}) => `
query getLastInvoiceFormSubmission {
  submission_invoices(
      where: {
        settings_form_submission: {
          ${filters?.formZid
    ? `settings_form: {zid: {_eq: ${filters?.formZid}}},`
    : ""}
          voided: {_eq: false}
        }
      },
        order_by: {id: desc},
        limit: 1
    ) {
    settings_form_submission {
      id
      id_number
    }
  }
}
`;
exports.getLastInvoiceFormSubmissionStringQuery = getLastInvoiceFormSubmissionStringQuery;
const getInvoiceFormSubmissionsByInvoiceIdStringQuery = (filters = {}) => `
query getInvoiceFormSubmissionsByInvoiceId ($invoice_id: bigint) {
  submission_invoices(
      where: {
        invoice_id: {_eq: $invoice_id},
        settings_form_submission: {
          ${filters?.formZid
    ? `settings_form: {zid: {_eq: ${filters?.formZid}}},`
    : ""}
          voided: {_eq: false}
        }
      },
        order_by: {id: desc}
    ) {
    id
    invoice_id
    form_submission_id
    created_at
    settings_form_submission {
      id
      zid
      reference
      created_at
      version
      id_number
      settings_form_submission_values {
        id
        form_field_id
        value
        settings_form_field {
          id
          name
          print_var_name
          settings_form_field_options {
              id
              label
              position
              value
          }
        }
      }
      settings_form {
        id
        name
        zid
        description
        created_at
        version
      }
    }
  }
}
`;
exports.getInvoiceFormSubmissionsByInvoiceIdStringQuery = getInvoiceFormSubmissionsByInvoiceIdStringQuery;
exports.getCurrenciesStringQuery = `
query getCurrencies {
  currencies {
    id
    name
    prefix
    code
    country
    plural_name
  }
}
`;
const getSuggestedPricesStringQuery = (config = {
    notNullPriceList: false,
    withItems: false,
    withItemCategories: false,
    onlyCurrent: false,
}) => `
query getSuggestedPrices {
  suggested_prices ${config?.notNullPriceList || config?.onlyCurrent
    ? `(
        where: {${[
        config?.onlyCurrent ? "current: { _eq: true }" : "",
        config?.notNullPriceList ? "price_list_id: { _is_null: false }" : "",
    ]
        .filter(Boolean)
        .join(", ")}
        }
      )`
    : ""} {
    id
    current
    currency_id
    amount
    bundle_id
    item_id
    notes
    price_list_id
    flexible_price
    price_list {
      payee_categories {
        id
      }
    }
    ${config?.withItems
    ? `item {
            id
            name
            stocks_only_integer
            code
            product_type
            ${config?.withItemCategories
        ? `
                item_category {
                    id
                    name
                    notes
                    items_count
                }
              `
        : ""}
        }`
    : ""}
  }
}
`;
exports.getSuggestedPricesStringQuery = getSuggestedPricesStringQuery;
const getPaymentTermsStringQuery = (config = { includeDiscounts: false }) => `
query getPaymentTerms {
  payment_terms {
    active
    id
    memo
    name
    ${config.includeDiscounts
    ? `allowed_discounts {
        discount {
          id
          name
          percent
          amount
        }
      }`
    : ""}
  }
}
`;
exports.getPaymentTermsStringQuery = getPaymentTermsStringQuery;
const getPaymentMethodsStringQuery = (config) => {
    const conditions = [];
    if (config.onlyActives) {
        conditions.push(`active: { _eq: true}`);
    }
    const whereClause = conditions.length
        ? `where: { ${conditions.join(", ")} }`
        : "";
    return `query getPaymentMethods {
    payment_methods (
        order_by: { id: desc },
        ${whereClause}
      ) {
      id
      active
      name
      avoid_overpay_showing_change
    }
}
`;
};
exports.getPaymentMethodsStringQuery = getPaymentMethodsStringQuery;
exports.getPaymentTermByIdStringQuery = `
query getPaymentTermById ($id: Int) {
  payment_terms (where: {id: {_eq: $id }}) {
    active
    id
    memo
    name
    account_from_id
    account_to_id
    allowed_payment_terms {
      payee_category_id
    }
  }
}
`;
exports.getInvoicesByAgencyIdStringQuery = `
query getInvoicesByAgencyId($id: Int) {
  invoices(limit: 1000, where: {agency_id: {_eq: $id}, voided: {_eq: false}}, order_by: {id: desc}) {
    id
    zid
    id_number
    currency_id
    date
    payee_id
    total
    subtotal
    seller_id
    order_number
    memo
    issued
    invoice_number
    id_number
    payment_term_id
    reference
    submission_invoices {
      id
      settings_form_submission {
        zid
        voided
        settings_form {
          id
          zid
        }
      }
    }
    invoice_details {
      bundle_id
      id
      item_bundle_name
      item_bundle_description
      item_id
      price
      quantity
      unit_price
    }
    payee {
      name
      payee_category_id
    }
  }
}
`;
const getCasesByResponsibleIdStringQuery = (wheres = []) => {
    const additionalWheres = wheres.join(",");
    return `
    query getCasesByResponsibleId($responsible_id: Int) {
      cases(where: {responsible_id: {_eq: $responsible_id}${additionalWheres.length > 0 ? "," : ""}${additionalWheres}}, order_by: {id: desc}) {
        id
        id_number
        serial_id
        critical
        reference
        date
        closing_expected_at
        contact_method_id
        symptom
        solution
        memo
        closed
        closed_at
        seller_id
        closer_id
        client_id
        warranty
        courtesy
        client {
          name
          address_line_1
        }
        case_invoices {
          invoice {
            id
            paid
          }
        }
        case_supplies {
          id
          item_id
        }
      }
    }
  `;
};
exports.getCasesByResponsibleIdStringQuery = getCasesByResponsibleIdStringQuery;
exports.getPrintTemplatesStringQuery = `
query getPrintTemplates {
    print_templates {
        id
        name
    }
}
`;
