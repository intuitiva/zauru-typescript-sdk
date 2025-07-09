import { ItemAssociatedLots, NewPurchaseOrderResponse, PurchaseOrderGeneralInfo, PurchaseOrderGraphQL, RejectionWebAppTableObject, ShipmentGraphQL, WebAppRowGraphQL } from "@zauru-sdk/types";
type ApiResponseFor4pinosReceptions = {
    apiCall: number;
    authorizedPO?: PurchaseOrderGraphQL;
    shipment?: ShipmentGraphQL;
    qcShipment?: ShipmentGraphQL;
};
type QueueFormReceptionWebAppTable = {
    creadoPor: string;
    fechaCreacion: string;
    formSubmited: any;
    estado: string;
    agency_id: number;
    apiResponses?: ApiResponseFor4pinosReceptions;
    description: string;
    timeStamp?: number;
    username?: string;
    token?: string;
};
export type RECEPTION_NAMES = "basketLots" | "rejectionInfo" | "newPurchaseOrderInfo" | "purchaseOrderGeneralInfo" | "poReceptions" | "offlineQueueReceptions" | "queueReceptions";
export interface ReceptionState {
    basketLots: {
        loading: boolean;
        data: ItemAssociatedLots;
        reFetch: boolean;
    };
    rejectionInfo: {
        loading: boolean;
        data: RejectionWebAppTableObject;
        reFetch: boolean;
    };
    newPurchaseOrderInfo: {
        loading: boolean;
        data: NewPurchaseOrderResponse;
        reFetch: boolean;
    };
    purchaseOrderGeneralInfo: {
        loading: boolean;
        data: PurchaseOrderGeneralInfo;
        reFetch: boolean;
    };
    poReceptions: {
        loading: boolean;
        data: PurchaseOrderGraphQL[];
        reFetch: boolean;
    };
    queueReceptions: {
        loading: boolean;
        data: WebAppRowGraphQL<QueueFormReceptionWebAppTable>[];
        reFetch: boolean;
    };
    offlineQueueReceptions: {
        loading: boolean;
        data: WebAppRowGraphQL<QueueFormReceptionWebAppTable>[];
        reFetch: boolean;
    };
}
export declare const receptionFetchStart: import("@reduxjs/toolkit").ActionCreatorWithPayload<RECEPTION_NAMES, "reception/receptionFetchStart">, receptionFetchSuccess: import("@reduxjs/toolkit").ActionCreatorWithPayload<{
    name: RECEPTION_NAMES;
    data: any;
}, "reception/receptionFetchSuccess">, receptionConcatToArray: import("@reduxjs/toolkit").ActionCreatorWithPayload<{
    name: RECEPTION_NAMES;
    data: any;
}, "reception/receptionConcatToArray">;
declare const _default: import("redux").Reducer<ReceptionState>;
export default _default;
