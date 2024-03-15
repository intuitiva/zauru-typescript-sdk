import type { Session } from "@remix-run/node";
import type { AxiosUtilsResponse } from "./httpZauru.server.js";
import { EmployeeGraphQL } from "@zauru-sdk/graphql";
interface Logo {
    url: null | string;
    thumb: {
        url: null | string;
    };
    standard: {
        url: null | string;
    };
    header: {
        url: null | string;
    };
}
export type OauthProfile = {
    id: number;
    uid: number;
    username: string;
    name: string;
    time_zone: string;
    mobile_phone: string;
    admin: boolean;
    selected_entity: number;
    selected_entity_name: string;
    selected_entity_logo: string;
    selected_entity_role: number;
    employee_id: number;
    crm_admin: boolean;
    crm_supervisor: boolean;
    crm_user: boolean;
    currency_id: number;
    currency_name: string;
    currency_prefix: string;
    api_key: string;
    scope: string;
    email: string;
};
interface Entity {
    id: number;
    name: string;
    tin: string;
    country: string;
    currency_id: number;
    entity_type_id: number;
    industry: string;
    web: string;
    notes: string;
    vat: number;
    vat_included: boolean;
    logo: Logo;
    logo_2: Logo;
    created_at: string;
    updated_at: string;
    distributor: number;
    costing_method: string;
    address: string;
    state: string;
    city: string;
    income_tax: number;
    report_logo: Logo;
    distributor_contract_id: number | null;
    producer_contract_id: number | null;
    legal_representative_name: string | null;
    legal_representative_identification: string | null;
    legal_representative_birthday: string | null;
    legal_representative_gender: boolean;
    legal_representative_marital_status: string | null;
    legal_representative_occupation: string | null;
    legal_representative_nationality: string | null;
    exporter_code: string | null;
}
export type Agency = {
    id: number;
    zid: number;
    active: boolean;
    ean13: string;
    name: string;
    employee_id: number | null;
    updater_id: number;
    entity_id: number;
    virtual: boolean;
    virtual_type: string | null;
    warehouse: boolean;
    point_of_sale: boolean;
    workshop: boolean;
    factory: boolean;
    contact: string;
    city: string;
    address_line_1: string;
    address_line_2: string;
    phone: string;
    notes: string;
    created_at: string;
    updated_at: string;
    price_list_id: number | null;
    quote: boolean;
    ecommerce: boolean;
    external_storage_service_name: string;
    agency_category_id: number | null;
};
export type Membership = {
    id: number;
    active: boolean;
    current: boolean;
    reference: string;
    starts: string;
    expires: string;
    eternal: boolean;
    entity_id: number;
    notes: string;
    created_at: string;
    updated_at: string;
    licenses_count: number;
    entity: Entity;
};
type Profile = {
    id: number;
    email: string;
    active: boolean;
    admin: boolean;
    name: string;
    address: null | string;
    mobile_phone: string;
    birthday: null | string;
    gender: boolean;
    notes: null | string;
    time_zone: string;
    language: string;
    selected_entity_id: number;
    created_at: string;
    updated_at: string;
    authentication_token: string;
    provider: string;
    provider_token: string;
};
export type ProfileResponse = {
    profile: Profile;
    memberships: Membership[];
};
/**
 * getOauthUserInfo
 * @param codeValue
 * @returns
 */
export declare const getOauthUserInfo: (codeValue: string) => Promise<AxiosUtilsResponse<OauthProfile>>;
/**
 *
 * @param employeeId
 * @param headers
 * @returns
 */
export declare const getEmployeeInfo: (id: number, headers: any) => Promise<AxiosUtilsResponse<EmployeeGraphQL>>;
/**
 * getProfileInformation
 * @param headers
 * @returns
 */
export declare const getProfileInformation: (headers: any) => Promise<AxiosUtilsResponse<ProfileResponse>>;
export declare const changeEntity: (headers: any, entityId: string) => Promise<any>;
/**
 *
 * @param headers
 * @returns
 */
export declare const getAgencyInfo: (headers: any, session: Session) => Promise<AxiosUtilsResponse<Agency>>;
export {};
