export const getLast100ReceptionsStringQuery = (agency_id: number) => `
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

export const getPurchaseOrderByIdNumberStringQuery = (id_number: string) => `
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
            webapp_table_id
            id
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

export const getPurchaseOrderStringQuery = (
  id: number,
  config: {
    withLotStocks: boolean;
    withPayee: boolean;
    withReceptions: boolean;
  } = {
    withLotStocks: false,
    withPayee: false,
    withReceptions: true,
  }
) => {
  const lotStocks = config.withLotStocks
    ? `lot_stocks {
        id
        available
        incoming
        outgoing
        agency_id
      }`
    : "";

  const payee = config.withPayee
    ? `payee {
        id
        name
        id_number
        email
        phone
        tin
        active
        payee_category_id
        payee_category {
          id
          name
        }
      }`
    : "";

  const receptions = config.withReceptions
    ? `receptions {
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
    }`
    : "";

  return `
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
    ${payee}
    ${receptions}
    webapp_table_rowables {
        webapp_rows {
            id
            webapp_table_id
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
        stocks_only_integer
      }
    }
    lots(where: {active: {_eq: true}}) {
      id
      name
      description
      ${lotStocks}
    }
    shipment_purchase_orders {
        shipment_id
    }
  }
}
`;
};

export const getShipmentsStringQuery = ({
  agency_to_id,
  agency_from_id,
  suffix,
  voided,
  delivered,
  shipped,
  returned,
  id_number_not_null = false,
  id_number,
  id_number_not_empty = false,
  withMovementLots = false,
  withPurchaseOrdersByShipmentReference = false,
  limit = 1000,
  id,
  wheres,
  memoILike,
  plannedShippingDateRange,
  plannedDeliveryDateRange,
}: {
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
}) => {
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

  if (
    plannedShippingDateRange?.startDate &&
    plannedShippingDateRange?.endDate
  ) {
    conditions.push(
      `planned_shipping: {_gte: "${plannedShippingDateRange.startDate}", _lte: "${plannedShippingDateRange.endDate}"}`
    );
  }

  if (
    plannedDeliveryDateRange?.startDate &&
    plannedDeliveryDateRange?.endDate
  ) {
    conditions.push(
      `planned_delivery: {_gte: "${plannedDeliveryDateRange.startDate}", _lte: "${plannedDeliveryDateRange.endDate}"}`
    );
  }

  const movementLots = withMovementLots
    ? `lot {
          id
          name
          description
        }`
    : "";

  const purchaseOrdersByShipmentReference =
    withPurchaseOrdersByShipmentReference
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
      ${
        conditions.length > 0
          ? `where: {
        ${conditions.join(", ")}
      }`
          : ""
      }
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

export const getLotsByNameStringQuery = (name: string, entity_id: number) => `
query getLots {
    lots (limit: 100, order_by: {id: desc}, where: {entity_id: {_eq: ${entity_id}}, name: {_eq: "${name}"}}) {
        id
        name
        description
    }
}
`;

export const getLotStocksByAgencyIdStringQuery = (agency_id: number) => `
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

export const getSerialsStringQuery = (filters: {
  name?: string;
  id?: number | string;
}) => {
  const conditions = [];

  if (filters.name) {
    conditions.push(`name: {_ilike: "%${filters.name}%"}`);
  }

  if (filters.id) {
    conditions.push(`id: {_eq: ${filters.id}}`);
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

export const getPurchaseOrdersBetweenDatesStringQuery = (
  startDate: string,
  endDate: string,
  config: {
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
    discountComparisonOperator?:
      | "_eq"
      | "_neq"
      | "_gte"
      | "_lte"
      | "_gt"
      | "_lt";
    discount?: number;
    excludeVoided?: boolean;
  }
) => {
  const conditions = [];

  if (config.ids && config.ids.length > 0) {
    conditions.push(`id: { _in: [${config.ids.join(",")}] }`);
  }

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
    conditions.push(
      `shipment_reference: { _eq: "${config.shipment_reference}" }`
    );
  }

  if (config.agencyNameIlike) {
    conditions.push(
      `agency: { name: { _ilike: "%${config.agencyNameIlike}%" } }`
    );
  }

  if (config.payeeId || config.payeeCategoryId) {
    const payeeConditions = [];
    if (config.payeeId) {
      payeeConditions.push(`id: { _eq: ${config.payeeId} }`);
    }
    if (config.payeeCategoryId) {
      payeeConditions.push(
        `payee_category: { id: { _eq: ${config.payeeCategoryId} } }`
      );
    }
    conditions.push(`payee: { ${payeeConditions.join(", ")} }`);
  }

  if (config.itemId) {
    if (config.itemId.toString().includes(",")) {
      conditions.push(
        `purchase_order_details: { item_id: { _in: [${config.itemId}] } }`
      );
    } else {
      conditions.push(
        `purchase_order_details: { item_id: { _eq: ${config.itemId} } }`
      );
    }
  }

  if (config.reference) {
    if (config.reference.toString().includes(",")) {
      conditions.push(`reference: { _in: [${config.reference}] }`);
    } else {
      conditions.push(`reference: { _eq: "${config.reference}" }`);
    }
  }

  if (config.lotItemIdExclusion) {
    conditions.push(
      `lots: { item_id: { _neq: ${config.lotItemIdExclusion} } }`
    );
  }

  if (config.poDetailTagId) {
    conditions.push(
      `purchase_order_details: { tag_id: { _eq: ${config.poDetailTagId} } }`
    );
  }

  if (!config.id_number && !config.ids?.length) {
    conditions.push(
      config.betweenIssueDate
        ? `issue_date: { _gte: "${startDate}", _lte: "${endDate}" }`
        : `created_at: { _gte: "${startDate}", _lte: "${endDate}"}`
    );
  }

  if (config.payeeCategoryIds && config.payeeCategoryIds.length > 0) {
    conditions.push(
      `payee: { payee_category: { id: { _in: [${config.payeeCategoryIds.join(
        ","
      )}] } } }`
    );
  }

  if (
    config.excludePayeeCategoryIds &&
    config.excludePayeeCategoryIds.length > 0
  ) {
    conditions.push(
      `payee: { payee_category: { id: { _nin: [${config.excludePayeeCategoryIds.join(
        ","
      )}] } } }`
    );
  }

  if (!!config.discountComparisonOperator && !!config.discount) {
    conditions.push(
      `discount: { ${config.discountComparisonOperator}: ${config.discount} }`
    );
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
                id
                webapp_table_id
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

export const getPayeesStringQuery = (filters?: {
  id_number?: string;
  name?: string;
  vendor?: boolean;
  tin?: string;
}) => {
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
                payee_category_id
                payee_category {
                  id
                  name
                }
            }
        }
  `;
};

export const getProvidersStringQuery = `
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

export const getAgenciesStringQuery = `
query getAgencies {
  agencies {
    id
    name
    address_line_2
  }
}
`;

export const getWebAppRowStringQuery = (id: number) => `
query getWebAppRow {
  webapp_rows(where: {id: {_eq: ${id}}}) {
    id
    data
    created_at
  }
}
`;

export const getWebAppRowsByWebAppTableIdStringQuery = (
  webapp_table_id: number,
  limit?: number
) => {
  const conditions = [];

  if (webapp_table_id) {
    conditions.push(`webapp_table_id: {_eq: ${webapp_table_id}}`);
  }

  const whereClause = conditions.length
    ? `where: { ${conditions.join(", ")} }`
    : "";

  const limitClause = limit ? `limit: ${limit}` : "";

  const orderByClause = `order_by: { id: desc }`;

  return `
    query getWebAppRowsByWebAppTableId {
      webapp_rows (${[whereClause, orderByClause, limitClause]
        .filter(Boolean)
        .join(", ")}) {
        id
        data
        created_at
      }
    }
`;
};

export const getPayeeCategoryByIdStringQuery = (id: number) => `
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

export const getPayeeCategoriesByNotesMatchStringQuery = (match: string) => `
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

export const getPayeeCategoriesStringQuery = `
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

export const getProviderCategoriesStringQuery = `
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

export const getClientCategoriesStringQuery = `
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

export const getPayeeByIdStringQuery = (id: number) => `
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

export const getSuperCategoryByIdStringQuery = (id: number) => `
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

export const getItemCategoryByIdStringQuery = (id: number) => `
query getItemCategoryById {
  item_categories (where: {id: {_eq: ${id} }}) {
        id
        name
        notes
        items_count
  }
}
`;

export const getItemsByCategoryStringQuery = (id: number) => `
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

export const getItemsStringQuery = `
query getItems {
  items (where: {active: {_eq: true }}) {
        id,
        name,
        code
    }
}
`;

export const getItemsBySuperCategoryStringQuery = (
  id: number,
  agency_id: number
) => `
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

export const getConsolidatesBetweenDatesStringQuery = (
  startDate: string,
  endDate: string
) => `
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

export const getEmployeeProfileStringQuery = (id: number) => `
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

export const getEmployeesStringQuery = (filters?: { id?: number }) => {
  const conditions = [];

  if (filters?.id) {
    conditions.push(`id: {_eq: ${filters.id}}`);
  }

  const whereClause = conditions.length
    ? `where: { ${conditions.join(", ")} },`
    : "";

  return `
query getEmployees {
    employees (${whereClause} order_by: {id: desc}) {
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
};

export const getEmployeesByAgencyIdStringQuery = (id: number) => `
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

export const getBundlesByItemCategoryIdStringQuery = (id: number) => `
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

export const getBundleByNameStringQuery = (name: string) => `
query getBundleByName {
  bundles (where: {name: {_eq: "${name}" }}) {
    id
  }
}
`;

export const getItemByNameStringQuery = (name: string) => `
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

export const getAllFormsStringQuery = (
  config: { withSubmissions: boolean } = { withSubmissions: false }
) => `
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
      ${
        config.withSubmissions
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
          : ""
      }
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

export const getFormByNameStringQuery = (name: string) => `
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

export const getFormsStringQuery = `
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

export const getFormsByDocumentTypeStringQuery = (
  document_type: string,
  filters: { formZid?: number } = {}
) => `
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

export const getMyCaseFormSubmissionsStringQuery = (
  responsible_id: number,
  filters: { formZid?: number; caseId?: number } = {}
) => `
query getMyCaseFormSubmissions {
  submission_cases (
    limit: 500,
    where: {
      settings_form_submission: {
          ${
            filters?.formZid
              ? `settings_form: {zid: {_eq: ${filters?.formZid}}},`
              : ""
          }
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

export const getFormSubmissionByIdStringQuery = (formId: number) => `
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

export const getInvoiceFormSubmissionsByAgencyIdStringQuery = (
  agency_id: number,
  filters?: {
    seller_id?: number | string;
    payee_id_number_search?: string;
    some_field_value?: string;
    item_ids?: number[];
    bundle_ids?: number[];
    startDate?: string;
    endDate?: string;
    formZid?: number | string;
  }
) => {
  return `
query getInvoiceFormSubmissionsByAgencyId {
  submission_invoices(
    where: {
      settings_form_submission: {
        ${
          filters?.formZid
            ? `settings_form: {zid: {_eq: ${filters?.formZid}}},`
            : ""
        }
        ${
          filters?.some_field_value
            ? `settings_form_submission_values: {
                  value: { _eq: "${filters?.some_field_value}" }
                },`
            : ""
        }
        voided: {_eq: false}
      },
      ${
        // We need to add 6 hours to the start and end date because the invoice date is in UTC and the database is in UTC+6
        filters?.startDate?.length && filters?.endDate?.length
          ? `created_at: { _gte: "${filters?.startDate}T06:00:00", _lte: "${filters?.endDate}T06:00:00" },`
          : ""
      }
      invoice: {
        agency_id: {_eq: ${agency_id}},
        ${filters?.seller_id ? `seller_id: {_eq: ${filters?.seller_id} },` : ""}
        ${
          filters?.payee_id_number_search
            ? `payee: { 
                id_number: { _ilike: "%${filters?.payee_id_number_search}%"} 
              },`
            : ""
        }
        ${
          filters?.item_ids?.length
            ? `invoice_details: {item_id: {_in: [${filters?.item_ids?.join(
                ","
              )}]}}`
            : ""
        }
        ${
          filters?.bundle_ids?.length
            ? `invoice_details: {bundle_id: {_in: [${filters?.bundle_ids?.join(
                ","
              )}]}}`
            : ""
        }
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

export const getLastInvoiceFormSubmissionStringQuery = (
  filters: { formZid?: number } = {}
) => `
query getLastInvoiceFormSubmission {
  submission_invoices(
      where: {
        settings_form_submission: {
          ${
            filters?.formZid
              ? `settings_form: {zid: {_eq: ${filters?.formZid}}},`
              : ""
          }
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

export const getCaseFormSubmissionsByCaseIdStringQuery = (
  case_id: number,
  filters: { formZid?: number } = {}
) => `
query getCaseFormSubmissionsByCaseId {
  submission_cases(
      where: {
        case_id: {_eq: ${case_id}},
        settings_form_submission: {
          ${
            filters?.formZid
              ? `settings_form: {zid: {_eq: ${filters?.formZid}}},`
              : ""
          }
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

export const getInvoiceFormSubmissionsByInvoiceIdStringQuery = (
  invoice_id: number,
  filters: { formZid?: number } = {}
) => `
query getInvoiceFormSubmissionsByInvoiceId {
  submission_invoices(
      where: {
        invoice_id: {_eq: ${invoice_id}},
        settings_form_submission: {
          ${
            filters?.formZid
              ? `settings_form: {zid: {_eq: ${filters?.formZid}}},`
              : ""
          }
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

export const getCurrenciesStringQuery = `
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

export const getSuggestedPricesStringQuery = (
  config: {
    notNullPriceList: boolean;
    withItems: boolean;
    withItemCategories: boolean;
    onlyCurrent: boolean;
    item_super_category_id?: number;
  } = {
    notNullPriceList: false,
    withItems: false,
    withItemCategories: false,
    onlyCurrent: false,
  }
) => {
  const conditions = [];

  if (config.item_super_category_id) {
    conditions.push(
      `item: { item_category: { item_super_category_id: { _eq: ${config.item_super_category_id} } } }`
    );
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

export const getPaymentTermsStringQuery = (
  config: {
    includeAllowedDiscounts: boolean;
    includeAllowedPaymentTerms: boolean;
    onlyActives: boolean;
  } = {
    includeAllowedDiscounts: false,
    includeAllowedPaymentTerms: false,
    onlyActives: true,
  }
) => {
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

export const getPaymentMethodsStringQuery = (config: {
  onlyActives: boolean;
}) => {
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

export const getPaymentTermByIdStringQuery = (id: number) => `
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

export const getInvoicesByAgencyIdStringQuery = (
  id: number,
  filters: { tag_id?: string; invoice_id?: string }
) => `
query getInvoicesByAgencyId {
  invoices(
    limit: 1000, 
    where: {
      agency_id: {_eq: ${id}}, 
      voided: {_eq: false}
      ${filters?.invoice_id ? `, id: {_eq: ${filters?.invoice_id}}` : ""}
      ${
        filters?.tag_id
          ? `, tagging_invoices: { tag_id: {_eq: ${filters?.tag_id}}}`
          : ""
      }
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

export const getCasesStringQuery = (
  filters?: {
    id?: number;
    responsible_id?: number;
    client_id?: number;
    closed?: boolean;
    tag_id?: string;
    limit?: number;
  },
  includes?: {
    includeSerial?: boolean;
    includeResponsible?: boolean;
    includeSeller?: boolean;
  }
) => {
  const conditions = [];

  if (filters?.id) {
    conditions.push(`id: {_eq: ${filters.id}}`);
  }

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
    conditions.push(
      `taggings: {tag_id: {_eq: ${filters.tag_id}}, taggeable_type: {_eq: "Case"}}`
    );
  }

  const whereClause = conditions.length
    ? `where: { ${conditions.join(", ")} },`
    : "";

  const joins = [];

  if (includes?.includeSerial) {
    joins.push(`
      serial {                 
        id
        id_number
        name
        description
        item_id
        entity_id
        agency_id
        agency_future_id
        created_at
      }`);
  }

  if (includes?.includeResponsible) {
    joins.push(`
      responsible {
        id
        name]
      }`);
  }

  if (includes?.includeSeller) {
    joins.push(`
      seller {
        id
        name
      }`);
  }

  return `query getCases {
    cases (${whereClause} order_by: {id: desc}, limit: ${
    filters?.limit || 1000
  }) 
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
        total
        responsible_id
        ${joins?.join("\n") || ""}
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
          unit_price
          price
          serial_id
        }
        submission_cases {
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
    }
  }
`;
};

export const getPrintTemplatesStringQuery = `
query getPrintTemplates {
    print_templates {
        id
        name
    }
}
`;
