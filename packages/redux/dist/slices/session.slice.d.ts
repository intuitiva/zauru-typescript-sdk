export interface SessionState {
    [key: string]: any;
}
export declare const setSessionValue: import("@reduxjs/toolkit").ActionCreatorWithPayload<{
    name: string;
    data: any;
}, "session/setSessionValue">;
declare const _default: import("redux").Reducer<SessionState>;
export default _default;
