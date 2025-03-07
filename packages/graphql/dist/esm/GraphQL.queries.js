"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPrintTemplatesStringQuery = exports.getCasesStringQuery = exports.getInvoicesByAgencyIdStringQuery = exports.getPaymentTermByIdStringQuery = exports.getPaymentMethodsStringQuery = exports.getPaymentTermsStringQuery = exports.getSuggestedPricesStringQuery = exports.getCurrenciesStringQuery = exports.getInvoiceFormSubmissionsByInvoiceIdStringQuery = exports.getCaseFormSubmissionsByCaseIdStringQuery = exports.getLastInvoiceFormSubmissionStringQuery = exports.getInvoiceFormSubmissionsByAgencyIdStringQuery = exports.getFormSubmissionByIdStringQuery = exports.getMyCaseFormSubmissionsStringQuery = exports.getFormsByDocumentTypeStringQuery = exports.getFormsStringQuery = exports.getFormByNameStringQuery = exports.getAllFormsStringQuery = exports.getItemByNameStringQuery = exports.getBundleByNameStringQuery = exports.getBundlesByItemCategoryIdStringQuery = exports.getEmployeesByAgencyIdStringQuery = exports.getEmployeesStringQuery = exports.getEmployeeProfileStringQuery = exports.getConsolidatesBetweenDatesStringQuery = exports.getItemsBySuperCategoryStringQuery = exports.getItemsStringQuery = exports.getItemsByCategoryStringQuery = exports.getItemCategoryByIdStringQuery = exports.getSuperCategoryByIdStringQuery = exports.getPayeeByIdStringQuery = exports.getClientCategoriesStringQuery = exports.getProviderCategoriesStringQuery = exports.getPayeeCategoriesStringQuery = exports.getPayeeCategoriesByNotesMatchStringQuery = exports.getPayeeCategoryByIdStringQuery = exports.getWebAppRowsByWebAppTableIdStringQuery = exports.getWebAppRowStringQuery = exports.getAgenciesStringQuery = exports.getProvidersStringQuery = exports.getPayeesStringQuery = exports.getPurchaseOrdersBetweenDatesStringQuery = exports.getSerialsStringQuery = exports.getLotStocksByAgencyIdStringQuery = exports.getLotsByNameStringQuery = exports.getShipmentsStringQuery = exports.getPurchaseOrderStringQuery = exports.getPurchaseOrderByIdNumberStringQuery = exports.getLast100ReceptionsStringQuery = void 0;
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
    shipment_reference
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
    shipment_reference
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
    shipment_reference
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
const getShipmentsStringQuery = ({ agency_to_id, agency_from_id, suffix, voided, delivered, shipped, returned, id_number_not_null = false, id_number, id_number_not_empty = false, withMovementLots = false, withPurchaseOrdersByShipmentReference = false, limit = 1000, id, wheres, memoILike, }) => {
    let conditions = [];
    if (suffix) {
        conditions.push(`id_number: {_ilike: "%${suffix}%"}`);
    }
    if (agency_to_id) {
        conditions.push(`agency_to_id: {_eq: ${agency_to_id}}`);
    }
    if (agency_from_id) {
        conditions.push(`agency_from_id: {_eq: ${agency_from_id}}`);
    }
    if (id_number) {
        conditions.push(`id_number: {_eq: "${id_number}"}`);
    }
    if (id_number_not_empty) {
        conditions.push(`id_number: {_neq: ""}`);
    }
    if (id_number_not_null) {
        conditions.push(`id_number: {_is_null: false}`);
    }
    if (id) {
        conditions.push(`id: {_eq: ${id}}`);
    }
    if (wheres) {
        conditions.push(...wheres);
    }
    if (memoILike) {
        conditions.push(`memo: {_ilike: "%${memoILike}%"}`);
    }
    if (voided !== undefined) {
        conditions.push(`voided: {_eq: ${voided}}`);
    }
    if (delivered !== undefined) {
        conditions.push(`delivered: {_eq: ${delivered}}`);
    }
    if (shipped !== undefined) {
        conditions.push(`shipped: {_eq: ${shipped}}`);
    }
    if (returned !== undefined) {
        conditions.push(`returned: {_eq: ${returned}}`);
    }
    const movementLots = withMovementLots
        ? `lot {
          id
          name
          description
        }`
        : "";
    const purchaseOrdersByShipmentReference = withPurchaseOrdersByShipmentReference
        ? `purchase_orders_by_shipment_reference {
          id
          id_number
          created_at
          reference
          purchase_order_details {
            item_id
            id
            reference
            booked_quantity
            delivered_quantity
          }
        }`
        : "";
    return `query getShipments {
    shipments(
      limit: ${limit}, 
      order_by: {id: desc}, 
      ${conditions.length > 0
        ? `where: {
        ${conditions.join(", ")}
      }`
        : ""}
    ) {
      id
      zid
      id_number
      reference
      memo
      needs_transport
      payee_id
      income
      booker_id
      agency_from_id
      agency_to_id
      transporter_id
      created_at
      planned_shipping
      planned_delivery
      delivered
      shipped
      shipped_at
      delivered_at
      returned
      returned_at
      returner_id
      ${purchaseOrdersByShipmentReference}
      movements {
        id
        booked_quantity
        delivered_quantity
        reference
        item_id
        lot_id
        ${movementLots}
      }
    }
  }`;
};
exports.getShipmentsStringQuery = getShipmentsStringQuery;
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
const getSerialsStringQuery = (filters) => {
    const conditions = [];
    if (filters.name) {
        conditions.push(`name: {_ilike: "%${filters.name}%"}`);
    }
    const whereClause = conditions.length
        ? `where: { ${conditions.join(", ")} }`
        : "";
    return `
    query getSerials {
      serials (
        order_by: { id: desc },
        ${whereClause}
      ) {
        id
        id_number
        name
        description
        item_id
        entity_id
        agency_id
        agency_future_id
        created_at
      }
    }
    `;
};
exports.getSerialsStringQuery = getSerialsStringQuery;
const getPurchaseOrdersBetweenDatesStringQuery = (startDate, endDate, config) => {
    const conditions = [];
    if (config.excludeVoided) {
        conditions.push("voided: { _eq: false }");
    }
    if (config.agencyId) {
        conditions.push(`agency_id: { _eq: ${config.agencyId} }`);
    }
    if (config.consolidateIdFilter) {
        conditions.push("consolidate_id: { _is_null: true }");
    }
    if (config.id_number) {
        conditions.push(`id_number: { _ilike: "%${config.id_number}%" }`);
    }
    if (config.shipment_reference) {
        conditions.push(`shipment_reference: { _eq: "${config.shipment_reference}" }`);
    }
    if (config.agencyNameIlike) {
        conditions.push(`agency: { name: { _ilike: "%${config.agencyNameIlike}%" } }`);
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
        if (config.itemId.toString().includes(",")) {
            conditions.push(`purchase_order_details: { item_id: { _in: [${config.itemId}] } }`);
        }
        else {
            conditions.push(`purchase_order_details: { item_id: { _eq: ${config.itemId} } }`);
        }
    }
    if (config.reference) {
        if (config.reference.toString().includes(",")) {
            conditions.push(`reference: { _in: [${config.reference}] }`);
        }
        else {
            conditions.push(`reference: { _eq: "${config.reference}" }`);
        }
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
    if (!!config.discountComparisonOperator && !!config.discount) {
        conditions.push(`discount: { ${config.discountComparisonOperator}: ${config.discount} }`);
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
        ? `lots (order_by: {id: desc}) {
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
        shipment_reference
        reference
        ${purchaseOrderDetails}
        ${lots}
        ${webAppRows}
        ${shipmentPurchase}
      }
    }
  `;
};
exports.getPurchaseOrdersBetweenDatesStringQuery = getPurchaseOrdersBetweenDatesStringQuery;
const getPayeesStringQuery = (filters) => {
    const conditions = [];
    if (filters?.id_number) {
        conditions.push(`id_number: { _ilike: "%${filters.id_number}%" }`);
    }
    if (filters?.name) {
        conditions.push(`name: { _ilike: "%${filters.name}%" }`);
    }
    if (filters?.vendor !== undefined) {
        conditions.push(`vendor: { _eq: ${filters.vendor} }`);
    }
    if (filters?.tin) {
        conditions.push(`tin: { _eq: "${filters.tin}" }`);
    }
    const whereClause = conditions.length
        ? `where: { ${conditions.join(", ")} }`
        : "";
    return `query getPayees {
            payees (
              order_by: { id: desc },
              ${whereClause}
            ) {
                id
                id_number
                name
                tin
                vendor
                address_line_1
            }
        }
  `;
};
exports.getPayeesStringQuery = getPayeesStringQuery;
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
    address_line_2
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
    position
  }
}
`;
exports.getEmployeeProfileStringQuery = getEmployeeProfileStringQuery;
exports.getEmployeesStringQuery = `
query getEmployees {
  employees {
    name
    id
    user_id
    email
    seller
    accountant
    buyer
    support_agent
    inventory_controller
    active
    position
  }
}
`;
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
    position
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
      ${
    // We need to add 6 hours to the start and end date because the invoice date is in UTC and the database is in UTC+6
    filters?.startDate?.length && filters?.endDate?.length
        ? `created_at: { _gte: "${filters?.startDate}T06:00:00", _lte: "${filters?.endDate}T06:00:00" },`
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
const getCaseFormSubmissionsByCaseIdStringQuery = (case_id, filters = {}) => `
query getCaseFormSubmissionsByCaseId {
  submission_cases(
      where: {
        case_id: {_eq: ${case_id}},
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
    case_id
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
exports.getCaseFormSubmissionsByCaseIdStringQuery = getCaseFormSubmissionsByCaseIdStringQuery;
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
}) => {
    const conditions = [];
    if (config.item_super_category_id) {
        conditions.push(`item: { item_category: { item_super_category_id: { _eq: ${config.item_super_category_id} } } }`);
    }
    if (config.onlyCurrent) {
        conditions.push("current: { _eq: true }");
    }
    if (config.notNullPriceList) {
        conditions.push("price_list_id: { _is_null: false }");
    }
    const whereClause = conditions.length
        ? `where: { ${conditions.join(", ")} }`
        : "";
    const itemCategories = config?.withItemCategories
        ? `item_category {
          id
          name
          notes
          items_count
      }
    `
        : "";
    const items = config?.withItems
        ? `item {
        id
        name
        stocks_only_integer
        code
        product_type
        ${itemCategories}
    }`
        : "";
    return `query getSuggestedPrices {
    suggested_prices (${whereClause}) {
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
      ${items}
    }
  }
`;
};
exports.getSuggestedPricesStringQuery = getSuggestedPricesStringQuery;
const getPaymentTermsStringQuery = (config = {
    includeAllowedDiscounts: false,
    includeAllowedPaymentTerms: false,
    onlyActives: true,
}) => {
    const conditions = [];
    if (config.onlyActives) {
        conditions.push(`active: { _eq: true}`);
    }
    const whereClause = conditions.length
        ? `where: { ${conditions.join(", ")} }`
        : "";
    const allowedDiscounts = config.includeAllowedDiscounts
        ? `allowed_discounts {
        discount {
          id
          name
          percent
          amount
        }
      }`
        : "";
    const allowedPaymentTerms = config.includeAllowedPaymentTerms
        ? `allowed_payment_terms {
        payment_term_id
      }`
        : "";
    return `query getPaymentTerms {
    payment_terms (
      ${whereClause}
    ) {
      active
      id
      memo
      name
      ${allowedDiscounts}
      ${allowedPaymentTerms}
    }
  }
`;
};
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
const getInvoicesByAgencyIdStringQuery = (id, filters) => `
query getInvoicesByAgencyId {
  invoices(
    limit: 1000, 
    where: {
      agency_id: {_eq: ${id}}, 
      voided: {_eq: false}
      ${filters?.invoice_id ? `, id: {_eq: ${filters?.invoice_id}}` : ""}
      ${filters?.tag_id
    ? `, tagging_invoices: { tag_id: {_eq: ${filters?.tag_id}}}`
    : ""}
  }, order_by: {id: desc}) {
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
      tin
      payee_category_id
    }
  }
}
`;
exports.getInvoicesByAgencyIdStringQuery = getInvoicesByAgencyIdStringQuery;
const getCasesStringQuery = (filters) => {
    const conditions = [];
    if (filters?.responsible_id) {
        conditions.push(`responsible_id: {_eq: ${filters.responsible_id}}`);
    }
    if (filters?.client_id) {
        conditions.push(`client_id: {_eq: ${filters.client_id}}`);
    }
    if (filters?.closed !== undefined) {
        conditions.push(`closed: {_eq: ${filters.closed}}`);
    }
    if (filters?.tag_id) {
        conditions.push(`taggings: {tag_id: {_eq: ${filters.tag_id}}, taggeable_type: {_eq: "Case"}}`);
    }
    const whereClause = conditions.length
        ? `where: { ${conditions.join(", ")} },`
        : "";
    return `query getCases {
    cases (${whereClause} order_by: {id: desc}, limit: ${filters?.limit || 1000}) 
      {
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
          tin
          email
          phone
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
          quantity
        }
    }
  }
`;
};
exports.getCasesStringQuery = getCasesStringQuery;
exports.getPrintTemplatesStringQuery = `
query getPrintTemplates {
    print_templates {
        id
        name
    }
}
`;
