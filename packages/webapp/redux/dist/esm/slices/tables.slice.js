"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tableSetPage = void 0;
const toolkit_1 = require("@reduxjs/toolkit");
const initialState = {
    pageTable1: 1,
    pageTable2: 1,
    pageTable3: 1,
};
const tableSlice = (0, toolkit_1.createSlice)({
    name: "table",
    initialState,
    reducers: {
        tableSetPage: (state, action) => {
            state[action.payload.name] = action.payload.data;
        },
    },
});
exports.tableSetPage = tableSlice.actions.tableSetPage;
exports.default = tableSlice.reducer;
