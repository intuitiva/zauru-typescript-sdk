import { createSlice } from "@reduxjs/toolkit";
const initialState = {
    agencyProfile: {},
    loadingAgencyProfile: false,
};
const agencySlice = createSlice({
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
export const { setAgencyProfile, setLoadingAgencyProfile } = agencySlice.actions;
export default agencySlice.reducer;
