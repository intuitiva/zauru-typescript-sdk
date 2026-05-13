"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.templateFetchSuccess = exports.templateFetchStart = void 0;
const toolkit_1 = require("@reduxjs/toolkit");
const initialState = {
    receptionTemplate: { data: "", loading: false },
};
const templateSlice = (0, toolkit_1.createSlice)({
    name: "template",
    initialState,
    reducers: {
        templateFetchStart: (state, action) => {
            state[action.payload].loading = true;
        },
        templateFetchSuccess: (state, action) => {
            state[action.payload.name].data = action.payload.data;
            state[action.payload.name].loading = false;
        },
    },
});
_a = templateSlice.actions, exports.templateFetchStart = _a.templateFetchStart, exports.templateFetchSuccess = _a.templateFetchSuccess;
exports.default = templateSlice.reducer;
