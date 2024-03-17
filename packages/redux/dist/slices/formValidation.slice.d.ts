export type FormValidations = {
    formValidations: {
        [key: string]: {
            [key: string]: string;
        };
    };
};
export declare const setFieldError: import("@reduxjs/toolkit").ActionCreatorWithPayload<{
    formName: string;
    name: string;
    error: string;
}, "formValidations/setFieldError">;
declare const _default: import("redux").Reducer<FormValidations>;
export default _default;
