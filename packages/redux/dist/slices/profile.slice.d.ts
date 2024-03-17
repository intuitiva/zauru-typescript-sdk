import type { AgencyGraphQL, EmployeeGraphQL, OauthProfile, ProfileResponse } from "@zauru-sdk/types";
export type PROFILE_NAMES = "userProfile" | "oauthProfile" | "employeeProfile" | "agencyProfile";
export interface ProfilesState {
    userProfile: {
        loading: boolean;
        data: ProfileResponse;
    };
    oauthProfile: {
        loading: boolean;
        data: OauthProfile;
    };
    employeeProfile: {
        loading: boolean;
        data: EmployeeGraphQL;
    };
    agencyProfile: {
        loading: boolean;
        data: AgencyGraphQL;
    };
}
export declare const profileFetchStart: import("@reduxjs/toolkit").ActionCreatorWithPayload<PROFILE_NAMES, "profile/profileFetchStart">, profileFetchSuccess: import("@reduxjs/toolkit").ActionCreatorWithPayload<{
    name: PROFILE_NAMES;
    data: any;
}, "profile/profileFetchSuccess">;
declare const _default: import("redux").Reducer<ProfilesState>;
export default _default;
