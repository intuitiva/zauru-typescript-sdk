"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.automaticNumberFetchSuccess = exports.automaticNumberFetchStart = void 0;
const toolkit_1 = require("@reduxjs/toolkit");
const initialState = {
    purchaseOrderIdNumber: { data: "", loading: false },
    dischargeIdNumber: { data: "NCB00000", loading: false },
};
const automaticNumbersSlice = (0, toolkit_1.createSlice)({
    name: "automaticNumbers",
    initialState,
    reducers: {
        automaticNumberFetchStart: (state, action) => {
            state[action.payload].loading = true;
        },
        automaticNumberFetchSuccess: (state, action) => {
            state[action.payload.name].data = action.payload.data;
            state[action.payload.name].loading = false;
        },
    },
});
_a = automaticNumbersSlice.actions, exports.automaticNumberFetchStart = _a.automaticNumberFetchStart, exports.automaticNumberFetchSuccess = _a.automaticNumberFetchSuccess;
exports.default = automaticNumbersSlice.reducer;
