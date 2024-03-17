export type TABLE_NAMES = "pageTable1" | "pageTable2" | "pageTable3";
export interface TableState {
    pageTable1: number;
    pageTable2: number;
    pageTable3: number;
}
export declare const tableSetPage: import("@reduxjs/toolkit").ActionCreatorWithPayload<{
    name: TABLE_NAMES;
    data: number;
}, "table/tableSetPage">;
declare const _default: import("redux").Reducer<TableState>;
export default _default;
