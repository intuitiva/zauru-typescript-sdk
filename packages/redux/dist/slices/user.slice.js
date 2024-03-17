import { createSlice } from "@reduxjs/toolkit";
const initialState = {
    userProfile: {},
    loadingUserProfile: false,
    oauthProfile: {},
    loadingOauthProfile: false,
    employeeProfile: {},
    loadingEmployeeInfo: false,
};
const userSlice = createSlice({
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
export const { setUserProfile, setEmployeeProfile, setOauthProfile, setLoadingEmployeeProfile, setLoadingOauthProfile, setLoadingUserProfile, } = userSlice.actions;
export default userSlice.reducer;
