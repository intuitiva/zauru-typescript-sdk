"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.setSpecialItems = exports.setLoadingSpecialItems = void 0;
const toolkit_1 = require("@reduxjs/toolkit");
const initialState = {
    specialItems: [],
    loadingSpecialItems: false,
};
const webappTablesSlice = (0, toolkit_1.createSlice)({
    name: "webappTables",
    initialState,
    reducers: {
        setLoadingSpecialItems: (state, action) => {
            state.loadingSpecialItems = action.payload;
        },
        setSpecialItems: (state, action) => {
            state.specialItems = action.payload;
            state.loadingSpecialItems = false;
        },
    },
});
_a = webappTablesSlice.actions, exports.setLoadingSpecialItems = _a.setLoadingSpecialItems, exports.setSpecialItems = _a.setSpecialItems;
exports.default = webappTablesSlice.reducer;
