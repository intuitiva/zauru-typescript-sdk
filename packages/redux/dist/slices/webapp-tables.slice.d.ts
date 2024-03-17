import { SpecialItem, WebAppRowGraphQL } from "@zauru-sdk/types";
export interface WebAppTableState {
    specialItems: WebAppRowGraphQL<SpecialItem>[];
    loadingSpecialItems: boolean;
}
export declare const setLoadingSpecialItems: import("@reduxjs/toolkit").ActionCreatorWithPayload<boolean, "webappTables/setLoadingSpecialItems">, setSpecialItems: import("@reduxjs/toolkit").ActionCreatorWithPayload<WebAppRowGraphQL<SpecialItem>[], "webappTables/setSpecialItems">;
declare const _default: import("redux").Reducer<WebAppTableState>;
export default _default;
