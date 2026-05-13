"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setSessionValue = void 0;
const toolkit_1 = require("@reduxjs/toolkit");
const initialState = {};
const sessionSlice = (0, toolkit_1.createSlice)({
    name: "session",
    initialState,
    reducers: {
        setSessionValue: (state, action) => {
            state[action.payload.name] = action.payload.data;
        },
    },
});
exports.setSessionValue = sessionSlice.actions.setSessionValue;
exports.default = sessionSlice.reducer;
