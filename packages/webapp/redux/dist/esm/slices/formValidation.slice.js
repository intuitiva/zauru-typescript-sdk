"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearFormErrors = exports.clearFieldError = exports.setFieldError = void 0;
const toolkit_1 = require("@reduxjs/toolkit");
const initialState = {
    formValidations: {},
};
const formValidationSlice = (0, toolkit_1.createSlice)({
    name: "formValidation",
    initialState,
    reducers: {
        setFieldError: (state, action) => {
            if (!state.formValidations[action.payload.formName]) {
                state.formValidations[action.payload.formName] = {};
            }
            state.formValidations[action.payload.formName][action.payload.name] =
                action.payload.error;
        },
        clearFieldError: (state, action) => {
            delete state.formValidations[action.payload.formName]?.[action.payload.name];
        },
        clearFormErrors: (state, action) => {
            delete state.formValidations[action.payload.formName];
        },
    },
});
_a = formValidationSlice.actions, exports.setFieldError = _a.setFieldError, exports.clearFieldError = _a.clearFieldError, exports.clearFormErrors = _a.clearFormErrors;
exports.default = formValidationSlice.reducer;
