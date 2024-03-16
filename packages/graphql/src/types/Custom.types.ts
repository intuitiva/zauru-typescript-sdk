import {
  EmployeeGraphQL,
  ItemGraphQL,
  MovementGraphQL,
  PriceListGraphQL,
  PurchaseOrderDetailsGraphQL,
  PurchaseOrderGraphQL,
  ShipmentGraphQL,
  SuggestedPriceGraphQL,
} from "./GraphQL.types";

export type SpecialItem = {
  item: number;
  provider: number;
  region: string;
  fechaEliminacion: string;
  detalles: string;
  tipo: string;
  providerCategory: number;
  specialLabel: string;
};

export type ExtendedInsertBookingBody = {
  movements: Partial<MovementGraphQL>[];
};

export type InsertBookingBody = Omit<Partial<ShipmentGraphQL>, "movements"> &
  ExtendedInsertBookingBody;

export type ConsolidatePurchaseOrderAttributes = {
  [index: number]: {
    consolidated: string;
    id: string;
  };
};

export type NewConsolidatedBody = {
  consolidate: {
    name: string;
    description: string;
    purchase_orders_attributes: ConsolidatePurchaseOrderAttributes;
  };
};

export type HTMLDataTableDeliveries = {
  draw: number;
  recordsTotal: number;
  recordsFiltered: number;
  data: Array<DeliveryHTMLDataTable>;
};

export type DeliveryHTMLDataTable = {
  zid: string;
  id: string;
  ref: string;
  nt: string;
  pd: string;
  dt: string;
  af: string;
  af_id: number;
  at: string;
  at_id: number;
  d: string;
  i: number;
  m: string;
  mem: string;
  ra: string;
  DT_RowId: string;
};

export type DischargeDetailsAttributes = {
  [index: number]: {
    purchase_order_id: number;
    amount: string;
  };
};

export type NewDischargeBody = {
  discharge: {
    id_number: string;
    payee_id: number | string;
    date: string;
    discharge_method_id: number | string;
    discharge_details_attributes: DischargeDetailsAttributes;
  };
};

//Cuerpo del update y create
export type LoteRecordBody = {
  lote_id: string;
  agency_id: string;
  lote_name: string;
  created_at: string;
  employee_id: string;
  employee_name: string;
  retenido: number;
};

export type UpdateLoteBody = {
  lot: {
    description: string;
  };
};
//Modelo para utilizarse en la app
export type LoteWithPurchaseFormatedSchema =
  PurchasesDataTableListFormatedSchema & {
    //del lote
    id_lote: number;
    name_lote: string;
    item: string;
    created_at: string;
    weight: string;
    baskets: number;
    editable: boolean;
  };

type StockSchema = {
  id: number;
  lot_id: number;
  entity_id: number;
  agency_id: number;
  available: string;
  incoming: string;
  outgoing: string;
  created_at: string;
  updated_at: string;
};

//Modelo para el detalle del lote
export type LoteDescription = {
  id: number;
  active: boolean;
  name: string;
  description: string;
  description_baskets: BasketSchema[];
  //Aquí se guarda la suma de todas las canastas, ejemplo:
  //12-23344-VERDE y 2-2342-AZUL = suma = 14 canastas
  baskets_quantity: number;
  //Aquí se guarda el peso promedio por canastas, calculado con el available / la cantidad de canastas
  availableByBaskets: number;
  entity_id: number;
  created_at: string;
  updated_at: string;
  item_id: number;
  expires: string;
  id_number: number | null;
  stock_actual: StockSchema;
  stocks: {
    //available, outgoing, incoming
    [key: string]: StockSchema | string;
  };
};

//Modelo que devuelve la API
export type LoteSchema = {
  id: number;
  lot_id: number;
  entity_id: number;
  agency_id: number;
  available: string;
  incoming: string;
  outgoing: string;
  created_at: string;
  updated_at: string;
  baskets: BasketSchema[];
  availableByBasket: number;
  baskets_quantity: number;
  lot: {
    id: number;
    active: boolean;
    name: string;
    description: string;
    entity_id: number;
    created_at: string;
    updated_at: string;
    item_id: number;
    expires: string;
    id_number: number | null;
    item: {
      id: number;
      zid: number;
      code: string;
      name: string;
    };
  };
};

export type LoteProcesadoSchema = {
  lote_id: string;
  lote_name: string;
  delivery_date: string;
  purchase_date: string;
  proveedor: string;
  recepcion: string;
  verdura: string;
  pesoNeto: string;
  canastas: string;
  pesoNetoPorCanasta: string;
  rechazo: string;
};

type LotAssociated = {
  id: number;
  active: boolean;
  name: string;
  description: string;
  entity_id: number;
  created_at: string;
  updated_at: string;
  item_id: number;
  expires: string | null;
  id_number: string | null;
};

type ItemAssociatedByLot = {
  id: number;
  zid: number;
  active: boolean;
  stockable: boolean;
  sellable: boolean;
  manufacturable: boolean;
  purchasable: boolean;
  code: string;
  ean13: string;
  name: string;
  item_category_id: number | null;
  measurement_unit: string;
  weight: number;
  volume: number | null;
  description: string;
  reorder_point: number | null;
  economic_order_quantity: number | null;
  months_warranty: number | null;
  entity_id: number;
  updater_id: number;
  created_at: string;
  updated_at: string;
  pays_vat: boolean;
  tariff_rate: number;
  product_type: number;
  payee_id: number | null;
  average_cost: number | null;
  fifo_cost: number | null;
  lifo_cost: number | null;
  extra_tax_1: number;
  extra_tax_2: number;
  quotable: boolean;
  ecommerce: boolean;
  msrp: number | null;
  tax1_use_msrp: boolean;
  tax2_use_msrp: boolean;
  vendor_code: string;
  stocks_only_integer: boolean;
  brand_id: number | null;
  color: string;
};

export type PoBasketType = {
  [key: string]: {
    lot_id: string;
    rBaskets: number;
    qcBaskets: number;
  };
};

export type ItemAssociatedLots = {
  lots: LotAssociated[];
  item: ItemAssociatedByLot;
  recepciones_basket_item_id: number;
  poBasket: PoBasketType;
};

//Modelo con el cuál responde el backend
export type MotivoRechazo = {
  Nombre: string;
};

export type RegisterMotivosRechazoBody = {
  Canastas?: string;
  Razon_primaria: string;
  Razon_secundaria: string;
  Razon_terciaria: string;
  Otras_razones?: string;
};

export type CreatePriceListBody = Partial<PriceListGraphQL> & {
  payee_category_ids: string[];
};

interface Logo {
  url: null | string;
  thumb: {
    url: null | string;
  };
  standard: {
    url: null | string;
  };
  header: {
    url: null | string;
  };
}

interface Entity {
  id: number;
  name: string;
  tin: string;
  country: string;
  currency_id: number;
  entity_type_id: number;
  industry: string;
  web: string;
  notes: string;
  vat: number;
  vat_included: boolean;
  logo: Logo;
  logo_2: Logo;
  created_at: string;
  updated_at: string;
  distributor: number;
  costing_method: string;
  address: string;
  state: string;
  city: string;
  income_tax: number;
  report_logo: Logo;
  distributor_contract_id: number | null;
  producer_contract_id: number | null;
  legal_representative_name: string | null;
  legal_representative_identification: string | null;
  legal_representative_birthday: string | null;
  legal_representative_gender: boolean;
  legal_representative_marital_status: string | null;
  legal_representative_occupation: string | null;
  legal_representative_nationality: string | null;
  exporter_code: string | null;
}
export type Membership = {
  id: number;
  active: boolean;
  current: boolean;
  reference: string;
  starts: string;
  expires: string;
  eternal: boolean;
  entity_id: number;
  notes: string;
  created_at: string;
  updated_at: string;
  licenses_count: number;
  entity: Entity;
};

type Profile = {
  id: number;
  email: string;
  active: boolean;
  admin: boolean;
  name: string;
  address: null | string;
  mobile_phone: string;
  birthday: null | string;
  gender: boolean;
  notes: null | string;
  time_zone: string;
  language: string;
  selected_entity_id: number;
  created_at: string;
  updated_at: string;
  authentication_token: string;
  provider: string;
  provider_token: string;
};

export type ProfileResponse = {
  profile: Profile;
  memberships: Membership[];
};

export type OauthProfile = {
  id: number;
  uid: number;
  username: string;
  name: string;
  time_zone: string;
  mobile_phone: string;
  admin: boolean;
  selected_entity: number;
  selected_entity_name: string;
  selected_entity_logo: string;
  selected_entity_role: number;
  employee_id: number;
  crm_admin: boolean;
  crm_supervisor: boolean;
  crm_user: boolean;
  currency_id: number;
  currency_name: string;
  currency_prefix: string;
  api_key: string;
  scope: string;
  email: string;
};

export type Agency = {
  id: number;
  zid: number;
  active: boolean;
  ean13: string;
  name: string;
  employee_id: number | null;
  updater_id: number;
  entity_id: number;
  virtual: boolean;
  virtual_type: string | null;
  warehouse: boolean;
  point_of_sale: boolean;
  workshop: boolean;
  factory: boolean;
  contact: string;
  city: string;
  address_line_1: string;
  address_line_2: string;
  phone: string;
  notes: string;
  created_at: string;
  updated_at: string;
  price_list_id: number | null;
  quote: boolean;
  ecommerce: boolean;
  external_storage_service_name: string;
  agency_category_id: number | null;
};

export type PurchasesListResponseSchema<T> = {
  draw: number;
  recordsTotal: number;
  recordsFiltered: number;
  data: T[];
  vendors?: BasicIdNameSchema[];
  vendor_categories?: BasicIdNameSchema[];
};

//Schema con el que responde la api de la orden de compra
export type HTMLPurchasesListSchema = {
  z: string;
  i: string;
  ref: string;
  dte: string;
  o: string;
  ven: string;
  inv: string;
  ct: string;
  itms: 1;
  tot: string;
  due: string;
  r: string;
  r2: string;
  DT_RowId: string;
  dis: string;
  och: string | null;
  rd: string;
};

export type PurchasesDataTableListFormatedSchema = {
  id: string;
  zid: string;
  id_number: number;
  no_orden: number;
  dte: Date;
  o: boolean;
  vendor: string;
  po_editable: boolean;
  dis: number;
  och: number;
  rd: string;
};

export type UpdatePurchaseOrderBody = {
  purchase_order: {
    discount?: number;
    other_charges?: number;
    payee_id?: number | string;
    purchase_order_details_attributes?: {
      [key: string]: {
        id?: string | number;
        unit_cost: string | number;
        item_id: string | number;
      };
    };
  };
};

export type PurchaseOrderReceptionDetails = {
  id: number;
  purchase_order_detail_id: number;
  reception_id: number;
  quantity: string;
  item_id: number;
  lot_delivered_quantity: string[];
  lot_name: string[];
  lot_expire: string[];
  serial_name?: any;
  serial_description?: any;
  lot_description: string[];
  bundle_id?: any;
};

export type PurchaseOrderReception = {
  id: number;
  agency_id: string;
  entity_id: string;
  invoice_number?: any;
  reception_details: PurchaseOrderReceptionDetails[];
};

export type NewPurchaseOrderResponse = {
  purchase_order: PurchaseOrderGraphQL;
  purchasers: EmployeeGraphQL[];
  purchasersList: SelectFieldOption[];
};

export type PurchaseOrderGeneralInfo = {
  incoterm_id: number;
  currency_id: number;
  charge_term_id: number;
};

export type ExtendedPurchaseOrderBody = {
  payee_info: string;
  tag_ids: string[];
  purchase_order_details: Partial<PurchaseOrderDetailsGraphQL>[];
};

export type CreateNewPurchaseOrderBody = Omit<
  Partial<PurchaseOrderGraphQL>,
  "purchase_order_details"
> &
  ExtendedPurchaseOrderBody;

export type SelectFieldOption = { value: any; label: string };
export type DataTablesFilterBody = {
  start: number;
  length: number;
  tag?: string;
  agency?: string;
  agency_from?: string;
  search?: {
    value: string;
    regex: boolean;
  };
  order: { [key: string]: { column: string; dir: string } };
  Desde?: string;
  Hasta?: string;
  vendor?: string;
  vendor_category?: string;
  item?: string;
};

export type BasicIdNameSchema = {
  id: number;
  name: string;
};

export type ObjectKeyString<T> = {
  [key: string]: T;
};

export type GeneratePDFBody = {
  s_date: string;
  e_date: string;
  print_template: number | string;
};

export type GeneratedPDFResult = { status: number; zid: number };

export type PDFResult = {
  status: number;
  percentage: number;
  message: string;
};

export type GenericStepResponse = { msg: string; step: string };

export type BasketSchema = {
  total: number;
  id: number;
  color: string;
};

export interface ReceptionDetailsAttributes {
  [key: string]: {
    item_id: string | number;
    purchase_order_detail_id: string | number;
    lot_delivered_quantity: string[] | number[];
    lot_name: string[];
    lot_expire: string[];
    lot_description: string[];
  };
}

export type NewReceptionBody = {
  reception: {
    agency_id: string | number;
    received_at: string;
    invoice_number?: string;
    purchase_order_id: string | number;
    needs_transit: string | boolean;
    entity_id: string | number;
    reception_details_attributes: ReceptionDetailsAttributes;
  };
};

export type ItemWithPrices = ItemGraphQL & {
  suggested_prices: Array<SuggestedPriceGraphQL>;
};

export type WebAppTableBody<T> = {
  temp_purchase_order_id?: string;
  webapp_row: {
    data: T;
  };
};

export type WebAppTableUpdateResponse = {
  id: number;
  webapp_table_id: number;
  data: {
    Nombre: string;
  };
  creator_id: number;
  updater_id: number | null;
  created_at: string;
  updated_at: string;
};

export type WebAppTableCreateBody = {
  name: string;
  rows_structure: string[];
  rows_type: string[];
};

export type WebAppTableStructure = {
  id: number;
  zid: number;
  entity_id: number;
  name: string;
  structure: { [key: string]: string };
  creator_id: number;
  updater_id: number;
  created_at: string;
  updated_at: string;
};

export type VariableSchema = {
  id: number;
  name: string;
  value: string;
  kind: string;
  user_id: number | null;
  entity_id: number | null;
  description: string;
  creator: string;
  created_at: string;
  updated_at: string;
};
