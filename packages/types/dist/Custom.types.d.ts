import { EmployeeGraphQL, ItemGraphQL, LotGraphQL, LotStockGraphQL, MembershipGraphQL, MovementGraphQL, PriceListGraphQL, ProfileGraphQL, PurchaseOrderGraphQL, ShipmentGraphQL, SuggestedPriceGraphQL } from "./GraphQL.types";
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
export type InsertBookingBody = Omit<Partial<ShipmentGraphQL>, "movements"> & ExtendedInsertBookingBody;
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
        name?: string;
        description: string;
        item_id?: number;
    };
};
export type LoteWithPurchaseFormatedSchema = PurchasesDataTableListFormatedSchema & {
    id_lote: number;
    name_lote: string;
    item: string;
    created_at: string;
    weight: string;
    baskets: number;
    editable: boolean;
};
export type LoteDescription = {
    id: number;
    active: boolean;
    name: string;
    description: string;
    description_baskets: BasketSchema[];
    baskets_quantity: number;
    availableByBaskets: number;
    entity_id: number;
    created_at: string;
    updated_at: string;
    item_id: number;
    expires: string;
    id_number: number | null;
    stock_actual: LotStockGraphQL;
    stocks: {
        [key: string]: LotStockGraphQL | string;
    };
};
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
        item: ItemGraphQL;
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
export type PoBasketType = {
    [key: string]: {
        lot_id: string;
        rBaskets: number;
        qcBaskets: number;
    };
};
export type ItemAssociatedLots = {
    lots: LotGraphQL[];
    item: ItemGraphQL;
    recepciones_basket_item_id: number;
    poBasket: PoBasketType;
};
export type MotivoRechazo = {
    Nombre: string;
    relatedItems?: number[];
};
export type CCPorcentajeRechazo = {
    id?: number;
    item_id: number;
    porcentaje: number;
};
export type AuthorizationUpdateDiscountPO = {
    id?: number;
    discount: number;
    primerMotivoRechazo: string;
    segundoMotivoRechazo: string;
    tercerMotivoRechazo: string;
    otrosMotivosRechazo: string;
    observaciones: string;
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
export type ProfileResponse = {
    profile: ProfileGraphQL;
    memberships: MembershipGraphQL[];
};
export type PurchasesListResponseSchema<T> = {
    draw: number;
    recordsTotal: number;
    recordsFiltered: number;
    data: T[];
    vendors?: BasicIdNameSchema[];
    vendor_categories?: BasicIdNameSchema[];
};
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
        shipment_reference?: string;
        id_number?: string;
        discount?: number;
        other_charges?: number;
        payee_id?: number | string;
        purchase_order_details_attributes?: {
            [key: string]: {
                id?: string | number;
                unit_cost?: string | number;
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
export type SelectFieldOption = {
    value: any;
    label: string;
};
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
    order: {
        [key: string]: {
            column: string;
            dir: string;
        };
    };
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
export type GeneratedPDFResult = {
    status: number;
    zid: number;
};
export type PDFResult = {
    status: number;
    percentage: number;
    message: string;
};
export type GenericStepResponse = {
    msg: string;
    step: string;
};
export type BasketSchema = {
    total: number;
    id: number;
    color: string;
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
export type GraphQLToken = {
    status: number;
    message: string;
    token: string;
    expires: string;
    expiresMsg: string;
    graphqlUrl: string;
};
export type AxiosUtilsResponse<T> = {
    error?: boolean;
    msg?: string;
    userMsg?: string;
    data?: T;
};
export type MonthsType = {
    ene: number;
    feb: number;
    mar: number;
    abr: number;
    may: number;
    jun: number;
    jul: number;
    ago: number;
    sep: number;
    oct: number;
    nov: number;
    dic: number;
};
export declare const MONTHS: {
    ene: number;
    feb: number;
    mar: number;
    abr: number;
    may: number;
    jun: number;
    jul: number;
    ago: number;
    sep: number;
    oct: number;
    nov: number;
    dic: number;
};
export type POHistoryMassive = {
    id: number;
    finalizada?: boolean;
    originalOtherCharges: number;
    originalDiscount: number;
};
export type BitacoraPOMassive = {
    accion: string;
    discount?: number | string;
    other_charges?: number | string;
    payeeCategoryId?: number | string;
    itemId?: number | string;
    fechaDesde?: string;
    fechaHasta?: string;
    purchaseOrders: POHistoryMassive[];
    modificadoPor: string;
    employeeId: number;
    fechaCreacion: string;
    observations: string;
    replace: boolean;
};
export type ConsolidatedHistory = {
    creadoPor: string;
    fechaCreacion: string;
    grupos: ConsolidateGroup[];
    pdfLink: string;
};
export type ConsolidateGroup = {
    purchaseOrderIds: number[];
    payeeId: number;
    finalizado: boolean;
    msgError: string;
    consolidatedId: number;
    payeeName: string;
};
export type CostoSemanalSpecialItem = {
    specialItemId: number;
    lunMar: number;
    mieJue: number;
    vieSabDom: number;
};
export type PurchaseOrderCosto = {
    id: number;
    finalizado?: boolean;
    msgResultado?: string;
    fecha: string;
    purchase_order_details: {
        id: number;
        item_id: number;
        unit_cost: number;
    }[];
};
export type CostoSemanal = {
    item: number;
    lunMar: number;
    mieJue: number;
    vieSabDom: number;
};
export type BitacoraCostosItems = {
    costos: CostoSemanal[];
    costosEspeciales: CostoSemanalSpecialItem[];
    costosActualizados: PurchaseOrderCosto[];
    costosEspecialesActualizados: PurchaseOrderCosto[];
    fechas: {
        lunes: string;
        martes: string;
        miercoles: string;
        jueves: string;
        viernes: string;
        sabado: string;
        domingo: string;
    };
    accion: string;
    modificadoPor: string;
    fechaCreacion: string;
};
export type DischargeHistory = {
    creadoPor: string;
    fechaCreacion: string;
    grupos: DischargeGroup[];
    pdfLink: string;
    initialIdNumber: string;
};
export type DischargeGroup = {
    purchaseOrders: {
        id: number;
        due: string;
    }[];
    discharge_id: number;
    finalizado: boolean;
    msgError: string;
    description: string;
    payee_id: number;
    id_number: string;
};
export type TransformedObject = {
    form_submission_values_attributes: {
        [key: string]: {
            form_field_id: string;
            value: string;
            groups_path: string;
        };
    };
    form_id: number;
    document_id: string;
    document_type: string;
    reference: string;
    zid: number;
    id_number?: string;
};
export declare const UNIDADES_DE_MEDIDA: {
    label: string;
    value: string;
    stocks_only_integer: boolean;
}[];
export type SearchItemParams = {
    start: string;
    length: string;
    search: {
        value: string;
        regex: "false" | "true";
    };
};
export type HTMLItemListSchema = {
    zid: string;
    cod: string;
    act: string;
    name: string;
    stck: string;
    sell: string;
    purch: string;
    cat: string;
    cat_note: string;
    vat: string;
    warr: string;
    ra: string;
    DT_RowId: string;
};
export type ResponseItemList = {
    draw: number;
    recordsTotal: number;
    recordsFiltered: number;
    data: Array<HTMLItemListSchema>;
};
export type ItemDataTable = {
    zid: number;
    itemId: number;
    name: string;
    stck: string | null;
    act: string | null;
    sell: string | null;
    purch: string | null;
    vat: string | null;
    cat: string;
    warr: string;
    cat_note: string;
    DT_RowId: number;
};
export type Template = {
    hoja: string;
    nombre: string;
    version: number;
    etiqueta: string;
    creadoPor: string;
    fechaCreacion: string;
    marginTop: number;
    marginLeft: number;
    verticalGap: number;
    horizontalGap: number;
    templateBorder: number;
    pageBorder: number;
    barCodeHeight: number;
};
export type HistoryTemplate = Template & {
    id_plantilla: number;
};
export type TipoMuestra = {
    creadoPor: string;
    fechaCreacion: string;
    nombre: string;
    agency_id: string;
    description: string;
};
export type RejectionWebAppTableObject = {
    webapp_table: {
        [key: string]: string;
    };
    rejection_select: {
        value: string;
        label: string;
    }[];
    rejection_list: string[];
};
export type ReceptionType = {
    Codigo: string;
    Nombre: string;
};
export type ApiResponseFor4pinosReceptions = {
    apiCall: number;
    authorizedPO: PurchaseOrderGraphQL;
    shipment: ShipmentGraphQL;
    qcShipment: ShipmentGraphQL;
};
export type QueueFormReceptionWebAppTable = {
    creadoPor: string;
    fechaCreacion: string;
    formSubmited: any;
    estado: string;
    agency_id: number;
    apiResponses?: ApiResponseFor4pinosReceptions;
    description: string;
    timeStamp?: number;
};
export type QueueShipmentsForm = {
    creadoPor: string;
    fechaCreacion: string;
    formSubmited: {
        booker_id: number;
        agency_from_id: number;
        transporter: string;
        planned_shipping: string;
        planned_delivery: string;
        shipment_reference: string;
        agency_to_id: number;
        purchase_orders: {
            id: number;
            lot_id: number;
            booked_quantity: number;
            item_id: number;
            id_number: string;
        }[];
    };
    estado: string;
    agency_id: number;
    apiStep?: number;
    shipment_id?: number;
    description: string;
    timeStamp?: number;
};
export type receptionType = {
    [key: string]: {
        agency_id: string;
        received_at: string;
        purchase_order_id: string;
        entity_id: string;
        needs_transit: string;
        invoice_number: string;
        reception_details_attributes: receptionDetailsType;
    };
};
export type receptionDetailsType = {
    [key: string]: {
        item_id: string;
        purchase_order_detail_id: string;
        lot_delivered_quantity: string[];
        lot_name: string[];
        lot_expire: string[];
        lot_description: string[];
    };
};
export type RowDataType = {
    id: any;
    [key: string]: any;
};
export type GenericDynamicTableColumn = {
    name: string;
    label: string;
    type: "checkbox" | "textField" | "selectField" | "label" | "hidden";
    integer?: boolean;
    options?: SelectFieldOption[];
    cell?: (row: RowDataType) => any;
    loadingOptions?: boolean;
    textFieldType?: "number";
    width?: number;
    disabled?: boolean;
    onChange?: (row: RowDataType, value: any, setTableValue: (columnName: string, newValue: any) => void) => void;
    headerClassName?: string;
    cellClassName?: string;
};
