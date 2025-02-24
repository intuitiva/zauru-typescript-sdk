"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setFormFieldSavedData = void 0;
const toolkit_1 = require("@reduxjs/toolkit");
const initialState = {
    formSavedData: {},
};
const formSavedDataSlice = (0, toolkit_1.createSlice)({
    name: "formSavedData",
    initialState,
    reducers: {
        setFormFieldSavedData: (state, action) => {
            state.formSavedData[action.payload.formName][action.payload.name] =
                action.payload.value;
        },
    },
});
exports.setFormFieldSavedData = formSavedDataSlice.actions.setFormFieldSavedData;
exports.default = formSavedDataSlice.reducer;
