import type { Agency, OauthProfile, ProfileResponse } from "~/services/zauru/zauru-profiles.server";
import type { EmployeeGraphQL } from "~/graphql/queries";
export declare const useGetAgencyProfile: () => {
    loading: boolean;
    data: Agency;
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
