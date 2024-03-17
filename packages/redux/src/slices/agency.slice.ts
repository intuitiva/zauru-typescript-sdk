import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import { AgencyGraphQL } from "@zauru-sdk/types";

export interface AgencyState {
  agencyProfile: AgencyGraphQL;
  loadingAgencyProfile: boolean;
}

const initialState: AgencyState = {
  agencyProfile: {} as AgencyGraphQL,
  loadingAgencyProfile: false,
};

const agencySlice = createSlice({
  name: "agency",
  initialState,
  reducers: {
    setAgencyProfile: (state, action: PayloadAction<AgencyGraphQL>) => {
      state.agencyProfile = action.payload;
    },
    setLoadingAgencyProfile: (state, action: PayloadAction<boolean>) => {
      state.loadingAgencyProfile = action.payload;
      state.loadingAgencyProfile = false;
    },
  },
});

export const { setAgencyProfile, setLoadingAgencyProfile } =
  agencySlice.actions;

export default agencySlice.reducer;
