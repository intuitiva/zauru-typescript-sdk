const getLast100Receptions = `
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
const getPurchaseOrderByIdNumber = `
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
const getPurchaseOrder = (config = { withLotStocks: false }) => `
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
const getShipmentsByToAgencyLast100 = `
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
const getLotsByName = `
query getLots($name: String, $entity_id: Int){
    lots (limit: 100, order_by: {id: desc}, where: {entity_id: {_eq: $entity_id}, name: {_eq: $name}}) {
        id
        name
        description
    }
}
`;
const getLotStocksByAgencyId = `
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
const getPurchaseOrdersBetweenDates = (config = {
    agencyFilter: false,
    payeeCategoryFilter: false,
    itemIdFilter: false,
    consolidateIdFilter: false,
    withLotStocks: false,
}) => `
query getPurchaseOrdersBetweenDates(
    $agencyId: Int,
    $startDate: timestamp,
    $endDate: timestamp,
    $lotItemIdExclusion: Int = null,
    $poDetailTagId: Int = null,
    $payeeCategoryId: Int = null
  ) {
  purchase_orders(
    order_by: {id: desc}, 
    where: {
      ${config.agencyFilter ? "agency_id: {_eq: $agencyId}," : ""} 
      ${config.payeeCategoryFilter
    ? "payee: {payee_category: {id: {_eq: $payeeCategoryId}}}},"
    : ""}
      ${config.itemIdFilter
    ? "purchase_order_details: {item_id: {_eq: 10}},"
    : ""}
      ${config.lotItemIdExclusion
    ? "lots: {item_id: {_neq: $lotItemIdExclusion}},"
    : ""}
      ${config.poDetailTagId
    ? "purchase_order_details: {tag_id: {_eq: $poDetailTagId}},"
    : ""}
      ${config.consolidateIdFilter ? "consolidate_id: {_is_null: true}," : ""}
      created_at: {_gte: $startDate, _lte: $endDate}
    }
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
    consolidate_id
    purchase_order_details {
      item_id
      id
      reference
      booked_quantity
      delivered_quantity
    }
    lots(where: {active: {_eq: true}}){
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
    shipment_purchase_orders {
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
    }
  }
}
`;
const getPayees = `
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
const getProviders = `
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
const getAgencies = `
query getAgencies {
  agencies {
    id
    name
  }
}
`;
const getWebAppRow = `
query getWebAppRow($id: Int){
  webapp_rows(where: {id: {_eq: $id}}) {
    data
  }
}
`;
const getWebAppRowsByWebAppTableId = `
query getWebAppRowsByWebAppTableId ($webapp_table_id: Int) {
  webapp_rows (where: {webapp_table_id: {_eq: $webapp_table_id }}) {
    id
    data
    created_at
  }
}
`;
const getPayeeCategoryById = `
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
      }
  }
}
`;
const getPayeeCategoriesByNotesMatch = (match) => `
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
const getPayeeCategories = `
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
const getProviderCategories = `
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
const getClientCategories = `
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
const getPayeeById = `
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
const getSuperCategoryById = `
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
const getItemCategoryById = `
query getItemCategoryById ($id: Int) {
  item_categories (where: {id: {_eq: $id }}) {
        id
        name
        notes
        items_count
  }
}
`;
const getItemsByCategory = `
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
const getItems = `
query getItems {
  items (where: {active: {_eq: true }}) {
        id,
        name
    }
}
`;
const getItemsBySuperCategory = `
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
const getConsolidatesBetweenDates = `
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
const getEmployeeProfile = `
query getEmployeeProfile ($id: Int) {
  employees(where: {id: {_eq: $id}}) {
    agency_id
    email
    entity_id
    id
    name
    user_id
  }
}
`;
const getEmployeesByAgencyId = `
query getEmployeesByAgencyId ($id: Int) {
  employees(where: {agency_id: {_eq: $id}}) {
    name
    id
    user_id
  }
}
`;
const getBundlesByItemCategoryId = `
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
const getBundleByName = `
query getBundleByName ($name: String) {
  bundles (where: {name: {_eq: $name }}) {
    id
  }
}
`;
const getItemByName = `
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
const getShipments = (wheres = []) => {
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
const getFormByName = `
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
const getForms = `
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
const getFormsByDocumentType = (filters = {}) => `
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
const getMyCaseFormSubmissions = (filters = {}) => `
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
const getFormSubmissionById = `
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
const getInvoiceFormSubmissionsByAgencyId = (filters) => {
    return `
query getInvoiceFormSubmissionsByAgencyId (
  $agency_id: Int
  ) {
  submission_invoices(
    where: {
      settings_form_submission: {
        ${filters?.some_field_value
        ? `settings_form_submission_values: {
                  value: { _eq: "${filters?.some_field_value}" }
                },`
        : ""}
        voided: {_eq: false}
      },
      ${filters?.startDate?.length && filters?.endDate?.length
        ? `created_at: { _gte: "${filters?.startDate}", _lte: "${filters?.endDate}" },`
        : ""}
      invoice: {
        agency_id: {_eq: $agency_id},
        ${filters?.seller_id ? `seller_id: {_eq: ${filters?.seller_id} },` : ""}
        ${filters?.payee_id_number_search
        ? `payee: { id_number: { _ilike: "%${filters?.payee_id_number_search}%"} },`
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
const getLastInvoiceFormSubmission = (filters = {}) => `
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
const getInvoiceFormSubmissionsByInvoiceId = (filters = {}) => `
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
const getCurrencies = `
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
const getSuggestedPrices = (config = {
    notNullPriceList: false,
    withItems: false,
    withItemCategories: false,
}) => `
query getSuggestedPrices {
  suggested_prices ${config?.notNullPriceList
    ? "(where: {price_list_id: {_is_null: false}})"
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
const getPaymentTerms = `
query getPaymentTerms {
  payment_terms {
    active
    id
    memo
    name
  }
}
`;
const getPaymentTermById = `
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
const getInvoicesByAgencyId = `
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
const getCasesByResponsibleId = (wheres = []) => {
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
export default {
    getLast100Receptions,
    getPayees,
    getItems,
    getPurchaseOrder,
    getPurchaseOrdersBetweenDates,
    getAgencies,
    getWebAppRow,
    getPayeeCategoryById,
    getPayeeById,
    getSuperCategoryById,
    getItemCategoryById,
    getConsolidatesBetweenDates,
    getWebAppRowsByWebAppTableId,
    getPurchaseOrderByIdNumber,
    getItemsByCategory,
    getItemsBySuperCategory,
    getEmployeeProfile,
    getBundlesByItemCategoryId,
    getItemByName,
    getFormByName,
    getBundleByName,
    getPayeeCategoriesByNotesMatch,
    getPayeeCategories,
    getProviderCategories,
    getCurrencies,
    getSuggestedPrices,
    getPaymentTerms,
    getEmployeesByAgencyId,
    getInvoicesByAgencyId,
    getForms,
    getFormsByDocumentType,
    getInvoiceFormSubmissionsByAgencyId,
    getInvoiceFormSubmissionsByInvoiceId,
    getPaymentTermById,
    getProviders,
    getCasesByResponsibleId,
    getMyCaseFormSubmissions,
    getClientCategories,
    getShipmentsByToAgencyLast100,
    getLotsByName,
    getFormSubmissionById,
    getLastInvoiceFormSubmission,
    getLotStocksByAgencyId,
    getShipments,
};
