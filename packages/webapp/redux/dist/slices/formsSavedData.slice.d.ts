export type FormSavedData = {
    [key: string]: {
        [key: string]: any;
    };
};
export declare const setFormFieldSavedData: import("@reduxjs/toolkit").ActionCreatorWithPayload<{
    formName: string;
    name: string;
    value: any;
}, "formSavedData/setFormFieldSavedData">;
declare const _default: import("@reduxjs/toolkit").Reducer<FormSavedData>;
export default _default;
