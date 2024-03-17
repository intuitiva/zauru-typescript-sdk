import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import {
  EmployeeGraphQL,
  OauthProfile,
  ProfileResponse,
} from "@zauru-sdk/types";

export interface UserState {
  userProfile: ProfileResponse;
  loadingUserProfile: boolean;
  oauthProfile: OauthProfile;
  loadingOauthProfile: boolean;
  employeeProfile: EmployeeGraphQL;
  loadingEmployeeInfo: boolean;
}

const initialState: UserState = {
  userProfile: {} as ProfileResponse,
  loadingUserProfile: false,
  oauthProfile: {} as OauthProfile,
  loadingOauthProfile: false,
  employeeProfile: {} as EmployeeGraphQL,
  loadingEmployeeInfo: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserProfile: (state, action: PayloadAction<ProfileResponse>) => {
      state.userProfile = action.payload;
      state.loadingUserProfile = false;
    },
    setLoadingUserProfile: (state, action: PayloadAction<boolean>) => {
      state.loadingUserProfile = action.payload;
    },
    setOauthProfile: (state, action: PayloadAction<OauthProfile>) => {
      state.oauthProfile = action.payload;
      state.loadingOauthProfile = false;
    },
    setLoadingOauthProfile: (state, action: PayloadAction<boolean>) => {
      state.loadingOauthProfile = action.payload;
    },
    setEmployeeProfile: (state, action: PayloadAction<EmployeeGraphQL>) => {
      state.employeeProfile = action.payload;
      state.loadingEmployeeInfo = false;
    },
    setLoadingEmployeeProfile: (state, action: PayloadAction<boolean>) => {
      state.loadingEmployeeInfo = action.payload;
    },
  },
});

export const {
  setUserProfile,
  setEmployeeProfile,
  setOauthProfile,
  setLoadingEmployeeProfile,
  setLoadingOauthProfile,
  setLoadingUserProfile,
} = userSlice.actions;

export default userSlice.reducer;
