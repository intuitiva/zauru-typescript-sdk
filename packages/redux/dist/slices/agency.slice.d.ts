import { AgencyGraphQL } from "@zauru-sdk/types";
export interface AgencyState {
    agencyProfile: AgencyGraphQL;
    loadingAgencyProfile: boolean;
}
export declare const setAgencyProfile: import("@reduxjs/toolkit").ActionCreatorWithPayload<AgencyGraphQL, "agency/setAgencyProfile">, setLoadingAgencyProfile: import("@reduxjs/toolkit").ActionCreatorWithPayload<boolean, "agency/setLoadingAgencyProfile">;
declare const _default: import("redux").Reducer<AgencyState>;
export default _default;
