"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setFieldError = void 0;
const toolkit_1 = require("@reduxjs/toolkit");
const initialState = {
    formValidations: {},
};
const formValidationsSlice = (0, toolkit_1.createSlice)({
    name: "formValidations",
    initialState,
    reducers: {
        setFieldError: (state, action) => {
            state.formValidations[action.payload.formName][action.payload.name] =
                action.payload.error;
        },
    },
});
exports.setFieldError = formValidationsSlice.actions.setFieldError;
exports.default = formValidationsSlice.reducer;
