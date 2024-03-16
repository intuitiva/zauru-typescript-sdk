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

export type AgencyGraphQL = {
  id: number;
  name: string;
};

export type WebAppRowGraphQL<T> = {
  id: number;
  data: T;
  created_at: string;
};

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

export type ItemCategoryGraphQL = {
  id: number;
  name: string;
  notes: string;
  items: ItemGraphQL[];
  items_count: number;
  item_super_category_id: number;
  color: string;
  stocks_only_integer: boolean;
};

export type ItemSuperCategoryGraphQL = {
  id: number;
  name: string;
  description: string;
  item_categories: ItemCategoryGraphQL[];
};

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

export type ConsolidateGraphQL = {
  id: number;
  id_number: string;
  created_at: string;
  name: string;
  purchase_orders: PurchaseOrderGraphQL[];
};

export type EmployeeGraphQL = {
  id: number;
  name: string;
  entity_id: number;
  agency_id: number;
  user_id: number;
  email: string;
};

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
