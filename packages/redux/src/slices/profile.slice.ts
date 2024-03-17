import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import type {
  AgencyGraphQL,
  EmployeeGraphQL,
  OauthProfile,
  ProfileResponse,
} from "@zauru-sdk/types";

export type PROFILE_NAMES =
  | "userProfile"
  | "oauthProfile"
  | "employeeProfile"
  | "agencyProfile";

export interface ProfilesState {
  userProfile: { loading: boolean; data: ProfileResponse };
  oauthProfile: { loading: boolean; data: OauthProfile };
  employeeProfile: { loading: boolean; data: EmployeeGraphQL };
  agencyProfile: { loading: boolean; data: AgencyGraphQL };
}

const initialState: ProfilesState = {
  userProfile: { data: {} as ProfileResponse, loading: false },
  oauthProfile: { data: {} as OauthProfile, loading: false },
  employeeProfile: { data: {} as EmployeeGraphQL, loading: false },
  agencyProfile: { data: {} as AgencyGraphQL, loading: false },
};

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    profileFetchStart: (state, action: PayloadAction<PROFILE_NAMES>) => {
      state[action.payload].loading = true;
    },
    profileFetchSuccess: (
      state,
      action: PayloadAction<{ name: PROFILE_NAMES; data: any }>
    ) => {
      state[action.payload.name].data = action.payload.data;
      state[action.payload.name].loading = false;
    },
  },
});

export const { profileFetchStart, profileFetchSuccess } = profileSlice.actions;

export default profileSlice.reducer;
