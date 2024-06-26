"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.profileFetchSuccess = exports.profileFetchStart = void 0;
const toolkit_1 = require("@reduxjs/toolkit");
const initialState = {
    userProfile: { data: {}, loading: false },
    oauthProfile: { data: {}, loading: false },
    employeeProfile: { data: {}, loading: false },
    agencyProfile: { data: {}, loading: false },
};
const profileSlice = (0, toolkit_1.createSlice)({
    name: "profile",
    initialState,
    reducers: {
        profileFetchStart: (state, action) => {
            state[action.payload].loading = true;
        },
        profileFetchSuccess: (state, action) => {
            state[action.payload.name].data = action.payload.data;
            state[action.payload.name].loading = false;
        },
    },
});
_a = profileSlice.actions, exports.profileFetchStart = _a.profileFetchStart, exports.profileFetchSuccess = _a.profileFetchSuccess;
exports.default = profileSlice.reducer;
