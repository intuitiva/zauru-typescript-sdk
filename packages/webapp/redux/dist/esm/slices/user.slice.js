"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.setLoadingUserProfile = exports.setLoadingOauthProfile = exports.setLoadingEmployeeProfile = exports.setOauthProfile = exports.setEmployeeProfile = exports.setUserProfile = void 0;
const toolkit_1 = require("@reduxjs/toolkit");
const initialState = {
    userProfile: {},
    loadingUserProfile: false,
    oauthProfile: {},
    loadingOauthProfile: false,
    employeeProfile: {},
    loadingEmployeeInfo: false,
};
const userSlice = (0, toolkit_1.createSlice)({
    name: "user",
    initialState,
    reducers: {
        setUserProfile: (state, action) => {
            state.userProfile = action.payload;
            state.loadingUserProfile = false;
        },
        setLoadingUserProfile: (state, action) => {
            state.loadingUserProfile = action.payload;
        },
        setOauthProfile: (state, action) => {
            state.oauthProfile = action.payload;
            state.loadingOauthProfile = false;
        },
        setLoadingOauthProfile: (state, action) => {
            state.loadingOauthProfile = action.payload;
        },
        setEmployeeProfile: (state, action) => {
            state.employeeProfile = action.payload;
            state.loadingEmployeeInfo = false;
        },
        setLoadingEmployeeProfile: (state, action) => {
            state.loadingEmployeeInfo = action.payload;
        },
    },
});
_a = userSlice.actions, exports.setUserProfile = _a.setUserProfile, exports.setEmployeeProfile = _a.setEmployeeProfile, exports.setOauthProfile = _a.setOauthProfile, exports.setLoadingEmployeeProfile = _a.setLoadingEmployeeProfile, exports.setLoadingOauthProfile = _a.setLoadingOauthProfile, exports.setLoadingUserProfile = _a.setLoadingUserProfile;
exports.default = userSlice.reducer;
