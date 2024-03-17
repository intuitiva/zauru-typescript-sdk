export type AUTOMATIC_NUMBER_NAMES = "dischargeIdNumber" | "purchaseOrderIdNumber";
export interface AutomaticNumberState {
    purchaseOrderIdNumber: {
        loading: boolean;
        data: number | string;
    };
    dischargeIdNumber: {
        loading: boolean;
        data: number | string;
    };
}
export declare const automaticNumberFetchStart: import("@reduxjs/toolkit").ActionCreatorWithPayload<AUTOMATIC_NUMBER_NAMES, "automaticNumbers/automaticNumberFetchStart">, automaticNumberFetchSuccess: import("@reduxjs/toolkit").ActionCreatorWithPayload<{
    name: AUTOMATIC_NUMBER_NAMES;
    data: any;
}, "automaticNumbers/automaticNumberFetchSuccess">;
declare const _default: import("redux").Reducer<AutomaticNumberState>;
export default _default;
