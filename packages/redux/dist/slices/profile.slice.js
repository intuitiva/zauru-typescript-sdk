import { createSlice } from "@reduxjs/toolkit";
const initialState = {
    userProfile: { data: {}, loading: false },
    oauthProfile: { data: {}, loading: false },
    employeeProfile: { data: {}, loading: false },
    agencyProfile: { data: {}, loading: false },
};
const profileSlice = createSlice({
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
export const { profileFetchStart, profileFetchSuccess } = profileSlice.actions;
export default profileSlice.reducer;
