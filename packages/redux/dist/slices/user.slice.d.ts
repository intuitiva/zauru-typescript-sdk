import { EmployeeGraphQL, OauthProfile, ProfileResponse } from "@zauru-sdk/types";
export interface UserState {
    userProfile: ProfileResponse;
    loadingUserProfile: boolean;
    oauthProfile: OauthProfile;
    loadingOauthProfile: boolean;
    employeeProfile: EmployeeGraphQL;
    loadingEmployeeInfo: boolean;
}
export declare const setUserProfile: import("@reduxjs/toolkit").ActionCreatorWithPayload<ProfileResponse, "user/setUserProfile">, setEmployeeProfile: import("@reduxjs/toolkit").ActionCreatorWithPayload<EmployeeGraphQL, "user/setEmployeeProfile">, setOauthProfile: import("@reduxjs/toolkit").ActionCreatorWithPayload<OauthProfile, "user/setOauthProfile">, setLoadingEmployeeProfile: import("@reduxjs/toolkit").ActionCreatorWithPayload<boolean, "user/setLoadingEmployeeProfile">, setLoadingOauthProfile: import("@reduxjs/toolkit").ActionCreatorWithPayload<boolean, "user/setLoadingOauthProfile">, setLoadingUserProfile: import("@reduxjs/toolkit").ActionCreatorWithPayload<boolean, "user/setLoadingUserProfile">;
declare const _default: import("redux").Reducer<UserState>;
export default _default;
