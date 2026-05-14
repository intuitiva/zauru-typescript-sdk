import type { AgencyGraphQL, EmployeeGraphQL, OauthProfile, ProfileResponse } from "@zauru-sdk/types";
export declare const useGetAgencyProfile: () => {
    loading: boolean;
    data: AgencyGraphQL;
};
export declare const useGetUserProfile: () => {
    loading: boolean;
    data: ProfileResponse;
};
export declare const useGetOauthProfile: () => {
    loading: boolean;
    data: OauthProfile;
};
export declare const useGetEmployeeProfile: () => {
    loading: boolean;
    data: EmployeeGraphQL;
};
