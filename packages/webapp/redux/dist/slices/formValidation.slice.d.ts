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
}, "formValidation/setFieldError">, clearFieldError: import("@reduxjs/toolkit").ActionCreatorWithPayload<{
    formName: string;
    name: string;
}, "formValidation/clearFieldError">, clearFormErrors: import("@reduxjs/toolkit").ActionCreatorWithPayload<{
    formName: string;
}, "formValidation/clearFormErrors">;
declare const _default: import("@reduxjs/toolkit").Reducer<FormValidations>;
export default _default;
