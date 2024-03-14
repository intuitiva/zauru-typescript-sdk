export type FormDocumentType =
  | "payee"
  | "item"
  | "bundle"
  | "entry"
  | "shipment"
  | "invoice"
  | "credit_note"
  | "payment"
  | "purchase_order"
  | "discharge"
  | "charge"
  | "reception"
  | "case"
  | "piecework"
  | "payroll_run"
  | "payroll"
  | "personal_time_off_request"
  | "work_contract"
  | "work_contract_termination"
  | "incident"
  | "item_category"
  | "employee"
  | "contract";

export type FormFieldType =
  | "section"
  | "zauru_data"
  | "text"
  | "multi_line_text"
  | "number"
  | "percentage"
  | "email"
  | "url"
  | "yes_no"
  | "date"
  | "hour"
  | "country"
  | "currency"
  | "gt_departamentos"
  | "gt_municipios"
  | "single_select_options"
  | "multi_select_options"
  | "image"
  | "pdf"
  | "file"
  | "fixed_columns_table"
  | "fixed_rows_table";

export type ReceptionDetailsGraphQL = {
  id: number;
  purchase_order_detail_id: number;
  quantity: number;
  item_id: number;
  lot_delivered_quantity: number;
  lot_description: string;
  lot_expire: string;
  lot_name: string;
};

export type ReceptionGraphQL = {
  id: number;
  received: boolean;
  voided: boolean;
  received_at: string;
  purchase_order_id: number;
  needs_transit: boolean;
  invoice_number: string;
  memo: string;
  agency_id: number;
  entity_id: number;
  reception_details: ReceptionDetailsGraphQL[];
};

export type PurchaseOrderDetailsGraphQL = {
  item_id: number;
  id: number;
  reference: string;
  unit_cost: number;
  booked_quantity: number;
  delivered_quantity: number;
  tag_id: number;
  item: ItemGraphQL;
};

export type LotStockGraphQL = {
  id: number;
  available: number;
  incoming: number;
  outgoing: number;
  agency_id: number;
  lot_id: number;
  lot: LotGraphQL;
};

export type LotGraphQL = {
  id: number;
  name: string;
  description: string;
  item_id: number;
  expires: string;
  lot_stocks: LotStockGraphQL[];
};

export type MovementGraphQL = {
  id: number;
  serial_id: string;
  item_id: number;
  booked_quantity: number;
  delivered_quantity: number;
  reference: string;
  lot_id: number;
  lot: LotGraphQL;
};

export type ShipmentGraphQL = {
  id: number;
  zid: number;
  id_number: string;
  reference: string;
  planned_delivery: string;
  agency_from_id: number;
  agency_to_id: number;
  transporter_id: number;
  created_at: string;
  needs_transport: boolean;
  payee_id: number;
  income: boolean;
  booker_id: number;
  shipped: boolean;
  shipper_id: number;
  delivered: boolean;
  delivered_at: string;
  voided: boolean;
  returned: boolean;
  memo: string;
  movements: MovementGraphQL[];
};

export type ShipmentPurchaseOrderGraphQL = {
  shipment_id: number;
  shipment: ShipmentGraphQL;
};

export type TaggingGraphQL = {
  id: number;
  tag_id: number;
  taggeable_id: number;
  taggeable_type: string;
};

export type PurchaseOrderGraphQL = {
  id: number;
  created_at: string;
  due: string;
  id_number: string;
  memo: string;
  authorized: boolean;
  payee_id: number;
  purchaser_id: number;
  origin: string;
  transport_type: string;
  reference: string;
  issue_date: string;
  shipping_date: string;
  charge_term_id: number;
  agency_id: number;
  currency_id: number;
  incoterm_id: number;
  entity_id: number;
  incoterm_destination: string;
  voided: boolean;
  received: boolean;
  taxable: boolean;
  import: boolean;
  discount: number;
  other_charges: number;
  delivery_date: string;
  webapp_table_rowables?: {
    webapp_rows?: {
      data?: {
        [key: string]: any;
      };
    };
  };
  purchase_order_details: PurchaseOrderDetailsGraphQL[];
  lots: LotGraphQL[];
  receptions: ReceptionGraphQL[];
  shipment_purchase_orders: ShipmentPurchaseOrderGraphQL[];
  taggings: TaggingGraphQL[];
};

export type TagGraphQL = {
  id: number;
  zid: number;
  name: string;
  description: string;
};

export type DocumentAutomaticNumberGraphQL = {
  id: number;
  active: boolean;
  variable_doc_number: number;
  variable_doc_number_digits: number;
  fixed_doc_number: string;
  field_for_doc_number: string;
};

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

const getPurchaseOrder = (
  config: { withLotStocks: boolean } = { withLotStocks: false }
) => `
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
      ${
        config.withLotStocks
          ? `lot_stocks {
              id
              available
              incoming
              outgoing
              agency_id
            }`
          : ""
      }
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

const getPurchaseOrdersBetweenDates = (
  config: {
    agencyFilter?: boolean;
    payeeCategoryFilter?: boolean;
    itemIdFilter?: boolean;
    consolidateIdFilter?: boolean;
    lotItemIdExclusion?: number;
    poDetailTagId?: number;
    withLotStocks?: boolean;
  } = {
    agencyFilter: false,
    payeeCategoryFilter: false,
    itemIdFilter: false,
    consolidateIdFilter: false,
    withLotStocks: false,
  }
) => `
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
      ${
        config.payeeCategoryFilter
          ? "payee: {payee_category: {id: {_eq: $payeeCategoryId}}}},"
          : ""
      }
      ${
        config.itemIdFilter
          ? "purchase_order_details: {item_id: {_eq: 10}},"
          : ""
      }
      ${
        config.lotItemIdExclusion
          ? "lots: {item_id: {_neq: $lotItemIdExclusion}},"
          : ""
      }
      ${
        config.poDetailTagId
          ? "purchase_order_details: {tag_id: {_eq: $poDetailTagId}},"
          : ""
      }
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
      ${
        config.withLotStocks
          ? `lot_stocks {
              id
              available
              incoming
              outgoing
              agency_id
            }`
          : ""
      }
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

export type PayeeGraphQL = {
  id: number;
  id_number: string;
  name: string;
  tin: string;
  email: string;
  phone: string;
  active: boolean;
  service_provider: boolean;
  payee_category_id: number;
  buyer: boolean;
  vendor: boolean;
  currency_id: number;
  allowed_payment_terms: AllowedPaymentTermGraphQL[];
  address_line_1: string;
};

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

export type AgencyGraphQL = {
  id: number;
  name: string;
};

const getAgencies = `
query getAgencies {
  agencies {
    id
    name
  }
}
`;

export type WebAppRowGraphQL<T> = {
  id: number;
  data: T;
  created_at: string;
};

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

export type PayeeCategoryGraphQL = {
  id: number;
  name: string;
  notes: string;
  vendor: boolean;
  payees_count: number;
  price_list_id: number;
  price_list: PriceListGraphQL;
  payees: PayeeGraphQL[];
};

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

const getPayeeCategoriesByNotesMatch = (match: string) => `
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

export type ItemCategoryGraphQL = {
  id: number;
  name: string;
  notes: string;
  items: ItemGraphQL[];
  items_count: number;
  item_super_category_id: number;
  color: string;
};

export type ItemSuperCategoryGraphQL = {
  id: number;
  name: string;
  description: string;
  item_categories: ItemCategoryGraphQL[];
};

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

export type StockGraphQL = {
  id: number;
  available: number;
  incoming: number;
  outgoing: number;
};

export type ItemGraphQL = {
  id: number;
  name: string;
  stocks_only_integer: boolean;
  code: string;
  item_category_id: number;
  measurement_unit: string;
  description: string;
  active: boolean;
  color: string;
  stockable: boolean;
  product_type: number;
  sellable: boolean;
  quotable: boolean;
  ecommerce: boolean;
  purchasable: boolean;
  weight: number;
  pays_vat: boolean;
  stocks: StockGraphQL[];
  item_category: ItemCategoryGraphQL;
};

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

export type ConsolidateGraphQL = {
  id: number;
  id_number: string;
  created_at: string;
  name: string;
  purchase_orders: PurchaseOrderGraphQL[];
};

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

export type EmployeeGraphQL = {
  id: number;
  name: string;
  entity_id: number;
  agency_id: number;
  user_id: number;
  email: string;
};

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

export type BundleDetailsGraphQL = {
  id: number;
  item_id: number;
  quantity: number;
  //campos del sistema
  _destroy?: boolean;
};

export type BundleGraphQL = {
  id: number;
  code: string;
  description: string;
  name: string;
  updated_at: string;
  item_category_id: number;
  image5: string;
  bundle_details_count: number;
  force_as_service_for_document_external_storage_service: boolean;
  bundle_details: BundleDetailsGraphQL[];
};

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

const getShipments = (wheres: string[] = []) => {
  const additionalWheres = wheres.join(",");
  return `query getShipments {
      shipments (${
        additionalWheres.length > 0 ? `where: {${additionalWheres}},` : ""
      } order_by: {id: desc}) {
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

export type InvoiceDetailsGraphQL = {
  id: number;
  bundle_id: number;
  item_bundle_name: string;
  item_bundle_description: string;
  item_id: number;
  price: number;
  unit_price: number;
  quantity: number;
  //campos del sistema
  _destroy?: boolean;
};

export type TaggingInvoiceGraphQL = {
  id: number;
  invoice_id: number;
  tag_id: number;
};

export type InvoiceGraphQL = {
  id: number;
  zid: number;
  id_number: string;
  order_number: string;
  invoice_number: string;
  reference: string;
  date: string;
  paid: boolean;
  subtotal: number;
  currency_id: number;
  total: number;
  payee_id: number;
  seller_id: number;
  memo: string;
  payment_term_id: number;
  issued: boolean;
  agency_id: number;
  invoice_details: InvoiceDetailsGraphQL[];
  payee: PayeeGraphQL;
  submission_invoices: SubmissionInvoicesGraphQL[];
  tagging_invoices: TaggingInvoiceGraphQL[];
};

export type FormFieldOptionsGraphQL = {
  id: number;
  label: string;
  position: number;
  value: string;
};

export type FormFieldTableHeaderGraphQL = {
  id: number;
  name: string;
  cell_type: "text" | "multi_line_text" | "number" | "yes_no";
  position: number;
};

export type FormFieldGraphQL = {
  id: number;
  form_id: number;
  name: string;
  field_type: FormFieldType;
  hint: string;
  required: boolean;
  default_value: string;
  position: number;
  print_var_name: string;
  settings_form_field_options: Partial<FormFieldOptionsGraphQL>[];
  settings_form_field_table_headers: Partial<FormFieldTableHeaderGraphQL>[];
};

export type FormSubmissionValueGraphQL = {
  id: number;
  form_field_id: number;
  groups_path: string;
  value: string;
  form_submission_id: number;
  settings_form_field: FormFieldGraphQL;
};

export type FormSubmissionGraphQL = {
  id: number;
  zid: number;
  reference: string;
  version: number;
  settings_form_submission_values: FormSubmissionValueGraphQL[];
  settings_form: FormGraphQL;
  created_at: string;
  form_id: number;
  id_number: string;
  voided: boolean;
  user_id: number;
};

export type SubmissionInvoicesGraphQL = {
  id: number;
  invoice_id: number;
  form_submission_id: number;
  settings_form_submission: FormSubmissionGraphQL;
  invoice: InvoiceGraphQL;
  created_at: string;
};

export type SubmissionCasesGraphQL = {
  id: number;
  case_id: number;
  form_submission_id: number;
  settings_form_submission: FormSubmissionGraphQL;
  case: CaseGraphQL;
};

export type FormGraphQL = {
  id: number;
  zid: number;
  version: number;
  document_type: FormDocumentType;
  active: boolean;
  name: string;
  description: string;
  settings_form_fields: Partial<FormFieldGraphQL>[];
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

const getFormsByDocumentType = (filters: { formZid?: number } = {}) => `
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

const getMyCaseFormSubmissions = (
  filters: { formZid?: number; caseId?: number } = {}
) => `
query getMyCaseFormSubmissions ($responsible_id: Int) {
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

const getInvoiceFormSubmissionsByAgencyId = (filters?: {
  seller_id?: number | string;
  payee_id_number_search?: string;
  some_field_value?: string;
  item_ids?: number[];
  bundle_ids?: number[];
  startDate?: string;
  endDate?: string;
}) => {
  return `
query getInvoiceFormSubmissionsByAgencyId (
  $agency_id: Int
  ) {
  submission_invoices(
    where: {
      settings_form_submission: {
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
        filters?.startDate?.length && filters?.endDate?.length
          ? `created_at: { _gte: "${filters?.startDate}", _lte: "${filters?.endDate}" },`
          : ""
      }
      invoice: {
        agency_id: {_eq: $agency_id},
        ${filters?.seller_id ? `seller_id: {_eq: ${filters?.seller_id} },` : ""}
        ${
          filters?.payee_id_number_search
            ? `payee: { id_number: { _ilike: "%${filters?.payee_id_number_search}%"} },`
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

const getLastInvoiceFormSubmission = (filters: { formZid?: number } = {}) => `
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

const getInvoiceFormSubmissionsByInvoiceId = (
  filters: { formZid?: number } = {}
) => `
query getInvoiceFormSubmissionsByInvoiceId ($invoice_id: bigint) {
  submission_invoices(
      where: {
        invoice_id: {_eq: $invoice_id},
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

export type PriceListGraphQL = {
  id: number;
  active: boolean;
  name: string;
  description: string;
  client_exclusive: boolean;
  payee_categories: PayeeCategoryGraphQL[];
};

export type CurrencyGraphQL = {
  id: number;
  name: string;
  prefix: string;
  code: string;
  country: string;
  plural_name: string;
};

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

export type SuggestedPriceGraphQL = {
  id: number;
  current: boolean;
  currency_id: number;
  amount: number;
  bundle_id: number;
  item_id: number;
  notes: string;
  price_list_id: number;
  flexible_price: boolean;
  item: ItemGraphQL;
  price_list: PriceListGraphQL;
};

const getSuggestedPrices = (
  config: {
    notNullPriceList: boolean;
    withItems: boolean;
    withItemCategories: boolean;
  } = {
    notNullPriceList: false,
    withItems: false,
    withItemCategories: false,
  }
) => `
query getSuggestedPrices {
  suggested_prices ${
    config?.notNullPriceList
      ? "(where: {price_list_id: {_is_null: false}})"
      : ""
  } {
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
    ${
      config?.withItems
        ? `item {
            id
            name
            stocks_only_integer
            code
            product_type
            ${
              config?.withItemCategories
                ? `
                item_category {
                    id
                    name
                    notes
                    items_count
                }
              `
                : ""
            }
        }`
        : ""
    }
  }
}
`;

export type AllowedPaymentTermGraphQL = {
  id: number;
  payee_category_id: number;
  payment_term_id: number;
};

export type PaymentTermGraphQL = {
  id: number;
  active: boolean;
  memo: string;
  name: string;
  applicable_to_uncategorized_payees: boolean;
  account_from_id: number;
  account_to_id: number;
  allowed_payment_terms: AllowedPaymentTermGraphQL[];
};

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

export type CaseInvoiceGraphQL = {
  invoice: InvoiceGraphQL;
  case: CaseGraphQL;
};

export type CaseSupplyGraphQL = {
  id: number;
  quantity: number;
  item_id: number;
};

export type CaseGraphQL = {
  id: number;
  id_number: string;
  reference: string;
  serial_id: number;
  critical: boolean;
  date: string;
  client: PayeeGraphQL;
  closing_expected_at: string;
  contact_method_id: number;
  symptom: string;
  solution: string;
  warranty: boolean;
  courtesy: boolean;
  memo: string;
  closed: boolean;
  closed_at: string;
  seller_id: number;
  closer_id: number;
  client_id: number;
  case_supplies: CaseSupplyGraphQL[];
  case_invoices: CaseInvoiceGraphQL[];
};

const getCasesByResponsibleId = (wheres: string[] = []) => {
  const additionalWheres = wheres.join(",");
  return `
    query getCasesByResponsibleId($responsible_id: Int) {
      cases(where: {responsible_id: {_eq: $responsible_id}${
        additionalWheres.length > 0 ? "," : ""
      }${additionalWheres}}, order_by: {id: desc}) {
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
