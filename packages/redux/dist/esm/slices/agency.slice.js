"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.setLoadingAgencyProfile = exports.setAgencyProfile = void 0;
const toolkit_1 = require("@reduxjs/toolkit");
const initialState = {
    agencyProfile: {},
    loadingAgencyProfile: false,
};
const agencySlice = (0, toolkit_1.createSlice)({
    name: "agency",
    initialState,
    reducers: {
        setAgencyProfile: (state, action) => {
            state.agencyProfile = action.payload;
        },
        setLoadingAgencyProfile: (state, action) => {
            state.loadingAgencyProfile = action.payload;
            state.loadingAgencyProfile = false;
        },
    },
});
_a = agencySlice.actions, exports.setAgencyProfile = _a.setAgencyProfile, exports.setLoadingAgencyProfile = _a.setLoadingAgencyProfile;
exports.default = agencySlice.reducer;
