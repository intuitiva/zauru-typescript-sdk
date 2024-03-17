export type TEMPLATE_NAMES = "receptionTemplate";
export interface TemplateState {
    receptionTemplate: {
        loading: boolean;
        data: string;
    };
}
export declare const templateFetchStart: import("@reduxjs/toolkit").ActionCreatorWithPayload<"receptionTemplate", "template/templateFetchStart">, templateFetchSuccess: import("@reduxjs/toolkit").ActionCreatorWithPayload<{
    name: TEMPLATE_NAMES;
    data: any;
}, "template/templateFetchSuccess">;
declare const _default: import("redux").Reducer<TemplateState>;
export default _default;
