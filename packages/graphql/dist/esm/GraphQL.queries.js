"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPrintTemplatesStringQuery = exports.getCasesByResponsibleIdStringQuery = exports.getInvoicesByAgencyIdStringQuery = exports.getPaymentTermByIdStringQuery = exports.getPaymentMethodsStringQuery = exports.getPaymentTermsStringQuery = exports.getSuggestedPricesStringQuery = exports.getCurrenciesStringQuery = exports.getInvoiceFormSubmissionsByInvoiceIdStringQuery = exports.getLastInvoiceFormSubmissionStringQuery = exports.getInvoiceFormSubmissionsByAgencyIdStringQuery = exports.getFormSubmissionByIdStringQuery = exports.getMyCaseFormSubmissionsStringQuery = exports.getFormsByDocumentTypeStringQuery = exports.getFormsStringQuery = exports.getFormByNameStringQuery = exports.getAllFormsStringQuery = exports.getShipmentsStringQuery = exports.getItemByNameStringQuery = exports.getBundleByNameStringQuery = exports.getBundlesByItemCategoryIdStringQuery = exports.getEmployeesByAgencyIdStringQuery = exports.getEmployeeProfileStringQuery = exports.getConsolidatesBetweenDatesStringQuery = exports.getItemsBySuperCategoryStringQuery = exports.getItemsStringQuery = exports.getItemsByCategoryStringQuery = exports.getItemCategoryByIdStringQuery = exports.getSuperCategoryByIdStringQuery = exports.getPayeeByIdStringQuery = exports.getClientCategoriesStringQuery = exports.getProviderCategoriesStringQuery = exports.getPayeeCategoriesStringQuery = exports.getPayeeCategoriesByNotesMatchStringQuery = exports.getPayeeCategoryByIdStringQuery = exports.getWebAppRowsByWebAppTableIdStringQuery = exports.getWebAppRowStringQuery = exports.getAgenciesStringQuery = exports.getProvidersStringQuery = exports.getPayeesStringQuery = exports.getPurchaseOrdersBetweenDatesStringQuery = exports.getLotStocksByAgencyIdStringQuery = exports.getLotsByNameStringQuery = exports.getShipmentsByToAgencyLast100StringQuery = exports.getPurchaseOrderStringQuery = exports.getPurchaseOrderByIdNumberStringQuery = exports.getLast100ReceptionsStringQuery = void 0;
const getLast100ReceptionsStringQuery = (agency_id) => `
query getLast100Receptions {
  purchase_orders(limit: 100, order_by: {created_at: desc}, where: {voided: {_eq: false}, agency_id: {_eq: ${agency_id}}}) {
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
exports.getLast100ReceptionsStringQuery = getLast100ReceptionsStringQuery;
const getPurchaseOrderByIdNumberStringQuery = (id_number) => `
query getPurchaseOrderByIdNumber {
  purchase_orders(where: {id_number: {_eq: "${id_number}"}}) {
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
exports.getPurchaseOrderByIdNumberStringQuery = getPurchaseOrderByIdNumberStringQuery;
const getPurchaseOrderStringQuery = (id, config = { withLotStocks: false }) => `
query getPurchaseOrder($id: bigint) @cached {
  purchase_orders(where: {id: {_eq: ${id}}}) {
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
const getShipmentsByToAgencyLast100StringQuery = (agency_to_id) => `
query getShipmentsByToAgencyLast100 {
    shipments(limit: 100, order_by: {id: desc}, where: {voided: {_eq: false}, shipped: {_eq: false}, delivered: {_eq: false}, agency_to_id: {_eq: ${agency_to_id}}}) {
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
exports.getShipmentsByToAgencyLast100StringQuery = getShipmentsByToAgencyLast100StringQuery;
const getLotsByNameStringQuery = (name, entity_id) => `
query getLots {
    lots (limit: 100, order_by: {id: desc}, where: {entity_id: {_eq: ${entity_id}}, name: {_eq: "${name}"}}) {
        id
        name
        description
    }
}
`;
exports.getLotsByNameStringQuery = getLotsByNameStringQuery;
const getLotStocksByAgencyIdStringQuery = (agency_id) => `
query getLotStocksByAgencyId {
  lot_stocks (
    order_by: { id: desc },
    where: { agency_id: { _eq: ${agency_id} } }
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
exports.getLotStocksByAgencyIdStringQuery = getLotStocksByAgencyIdStringQuery;
const getPurchaseOrdersBetweenDatesStringQuery = (startDate, endDate, config) => {
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
            ? `issue_date: { _gte: "${startDate}", _lte: "${endDate}" }`
            : `created_at: { _gte: "${startDate}", _lte: "${endDate}"}`);
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
    query getPurchaseOrdersBetweenDates {
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
const getWebAppRowStringQuery = (id) => `
query getWebAppRow {
  webapp_rows(where: {id: {_eq: ${id}}}) {
    id
    data
    created_at
  }
}
`;
exports.getWebAppRowStringQuery = getWebAppRowStringQuery;
const getWebAppRowsByWebAppTableIdStringQuery = (webapp_table_id) => `
query getWebAppRowsByWebAppTableId {
  webapp_rows (
    where: {
      webapp_table_id: {
        _eq: ${webapp_table_id} 
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
exports.getWebAppRowsByWebAppTableIdStringQuery = getWebAppRowsByWebAppTableIdStringQuery;
const getPayeeCategoryByIdStringQuery = (id) => `
query getPayeeCategoryById {
  payee_categories (where: {id: {_eq: ${id} }}) {
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
exports.getPayeeCategoryByIdStringQuery = getPayeeCategoryByIdStringQuery;
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
const getPayeeByIdStringQuery = (id) => `
query getPayeeById {
  payees (where: {id: {_eq: ${id} }}) {
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
exports.getPayeeByIdStringQuery = getPayeeByIdStringQuery;
const getSuperCategoryByIdStringQuery = (id) => `
query getSuperCategoryById {
  item_super_categories (where: {id: {_eq: ${id} }}) {
    item_categories {
        id
        name
        notes
        items_count
    }
  }
}
`;
exports.getSuperCategoryByIdStringQuery = getSuperCategoryByIdStringQuery;
const getItemCategoryByIdStringQuery = (id) => `
query getItemCategoryById {
  item_categories (where: {id: {_eq: ${id} }}) {
        id
        name
        notes
        items_count
  }
}
`;
exports.getItemCategoryByIdStringQuery = getItemCategoryByIdStringQuery;
const getItemsByCategoryStringQuery = (id) => `
query getItemsByCategory {
  item_categories (where: {id: {_eq: ${id} }}) {
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
exports.getItemsByCategoryStringQuery = getItemsByCategoryStringQuery;
exports.getItemsStringQuery = `
query getItems {
  items (where: {active: {_eq: true }}) {
        id,
        name,
        code
    }
}
`;
const getItemsBySuperCategoryStringQuery = (id, agency_id) => `
query getItemsBySuperCategory {
  item_super_categories (where: {id: {_eq: ${id} }}, order_by: {id: desc}) {
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
            stocks(where: {agency_id: {_eq: ${agency_id}}}, order_by: {id: desc}) {
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
exports.getItemsBySuperCategoryStringQuery = getItemsBySuperCategoryStringQuery;
const getConsolidatesBetweenDatesStringQuery = (startDate, endDate) => `
query getConsolidatesBetweenDates {
  consolidates (order_by: {id: desc}, where: {created_at: {_gte: "${startDate}", _lte: "${endDate}"}}) {
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
exports.getConsolidatesBetweenDatesStringQuery = getConsolidatesBetweenDatesStringQuery;
const getEmployeeProfileStringQuery = (id) => `
query getEmployeeProfile {
  employees(where: {id: {_eq: ${id}}}) {
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
exports.getEmployeeProfileStringQuery = getEmployeeProfileStringQuery;
const getEmployeesByAgencyIdStringQuery = (id) => `
query getEmployeesByAgencyId {
  employees(where: {agency_id: {_eq: ${id}}}) {
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
exports.getEmployeesByAgencyIdStringQuery = getEmployeesByAgencyIdStringQuery;
const getBundlesByItemCategoryIdStringQuery = (id) => `
query getBundlesByItemCategoryId {
  bundles(where: {active: {_eq: true}, item_category_id: {_eq: ${id}}}) {
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
exports.getBundlesByItemCategoryIdStringQuery = getBundlesByItemCategoryIdStringQuery;
const getBundleByNameStringQuery = (name) => `
query getBundleByName {
  bundles (where: {name: {_eq: "${name}" }}) {
    id
  }
}
`;
exports.getBundleByNameStringQuery = getBundleByNameStringQuery;
const getItemByNameStringQuery = (name) => `
query getItemByName {
  items (where: {active: {_eq: true }, name: {_eq: "${name}" }}) {
      id
      name
      stocks_only_integer
      code
      product_type
  }
}
`;
exports.getItemByNameStringQuery = getItemByNameStringQuery;
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
const getFormByNameStringQuery = (name) => `
query getFormByName {
  settings_forms (
      where: {name: {_eq: "${name}" }},
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
exports.getFormByNameStringQuery = getFormByNameStringQuery;
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
const getFormsByDocumentTypeStringQuery = (document_type, filters = {}) => `
query getFormsByDocumentType {
  settings_forms (
      where: {
        ${filters?.formZid ? `zid: {_eq: ${filters?.formZid}},` : ""}
        document_type: {_eq: "${document_type}"}
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
const getMyCaseFormSubmissionsStringQuery = (responsible_id, filters = {}) => `
query getMyCaseFormSubmissions {
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
        responsible_id: {_eq: ${responsible_id}}
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
const getFormSubmissionByIdStringQuery = (formId) => `
query getFormSubmissionById {
  settings_form_submissions (where: {id: { _eq: ${formId} }}) {
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
exports.getFormSubmissionByIdStringQuery = getFormSubmissionByIdStringQuery;
const getInvoiceFormSubmissionsByAgencyIdStringQuery = (agency_id, filters) => {
    return `
query getInvoiceFormSubmissionsByAgencyId {
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
        agency_id: {_eq: ${agency_id}},
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
const getInvoiceFormSubmissionsByInvoiceIdStringQuery = (invoice_id, filters = {}) => `
query getInvoiceFormSubmissionsByInvoiceId {
  submission_invoices(
      where: {
        invoice_id: {_eq: ${invoice_id}},
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
const getPaymentTermByIdStringQuery = (id) => `
query getPaymentTermById {
  payment_terms (where: {id: {_eq: ${id} }}) {
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
exports.getPaymentTermByIdStringQuery = getPaymentTermByIdStringQuery;
const getInvoicesByAgencyIdStringQuery = (id) => `
query getInvoicesByAgencyId {
  invoices(limit: 1000, where: {agency_id: {_eq: ${id}}, voided: {_eq: false}}, order_by: {id: desc}) {
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
exports.getInvoicesByAgencyIdStringQuery = getInvoicesByAgencyIdStringQuery;
const getCasesByResponsibleIdStringQuery = (responsible_id, wheres = []) => {
    const additionalWheres = wheres.join(",");
    return `
    query getCasesByResponsibleId {
      cases(where: {responsible_id: {_eq: ${responsible_id}}${additionalWheres.length > 0 ? "," : ""}${additionalWheres}}, order_by: {id: desc}) {
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
