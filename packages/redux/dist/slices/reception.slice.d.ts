import { ItemAssociatedLots, NewPurchaseOrderResponse, PurchaseOrderGeneralInfo, PurchaseOrderGraphQL, RejectionWebAppTableObject, WebAppRowGraphQL, QueueFormReceptionWebAppTable } from "@zauru-sdk/types";
export type RECEPTION_NAMES = "basketLots" | "rejectionInfo" | "newPurchaseOrderInfo" | "purchaseOrderGeneralInfo" | "poReceptions" | "queueNewReceptions";
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
    queueNewReceptions: {
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
