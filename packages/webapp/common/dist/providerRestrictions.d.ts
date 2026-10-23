import type { ProviderRestrictionCheckResult, ProviderRestrictionMode, ProviderRestrictionRule, ReceptionType } from "@zauru-sdk/types";
export declare const PROVIDER_TYPE_RESTRICTIONS_TABLE_VAR = "ctl_calidad_admin_restricciones_tipos_proveedor_web_app_table_id";
export declare const PROVIDER_ITEM_RESTRICTIONS_TABLE_VAR = "ctl_calidad_admin_restricciones_verduras_proveedor_web_app_table_id";
export declare const normalizeRestrictionValue: (value: string | number | undefined | null) => string;
export declare const formatRestrictionTypeValue: (type?: {
    Nombre?: string;
    Codigo?: string;
} | null) => string;
export declare const isProviderRestrictionMode: (value: unknown) => value is ProviderRestrictionMode;
export declare const normalizeProviderRestrictionValues: (values: unknown) => string[];
export declare const restrictionHasDateRange: (rule: Pick<ProviderRestrictionRule, "start_date" | "end_date">) => boolean;
export declare const isRestrictionActiveOnDate: (rule: ProviderRestrictionRule, date: string) => boolean;
export declare const filterActiveProviderRestrictions: (rules: ProviderRestrictionRule[] | undefined, payeeId: number, date: string) => ProviderRestrictionRule[];
export declare const resolveAllowedRestrictionValues: (input: {
    payeeId: number;
    date: string;
    rules: ProviderRestrictionRule[] | undefined;
    universe: Array<string | number>;
}) => string[];
export declare const isRestrictionValueAllowed: (input: {
    payeeId: number;
    date: string;
    value: string | number;
    rules: ProviderRestrictionRule[] | undefined;
    universe: Array<string | number>;
}) => boolean;
export declare const matchReceptionTypeCode: (formValue: string, types: Array<ReceptionType | {
    data?: ReceptionType;
}> | undefined) => string;
export type ProviderRestrictionInput = {
    payee_id: number;
    mode: ProviderRestrictionMode | string;
    values: unknown;
    start_date?: string;
    end_date?: string;
    motivo?: string;
};
export type ProviderRestrictionInputError = {
    field: string;
    message: string;
};
export type ValidateProviderRestrictionOptions = {
    universe?: Array<string | number>;
    otherRules?: ProviderRestrictionRule[];
    valueNoun?: string;
};
export declare const sampleDatesForRestrictionRules: (rules: Array<Pick<ProviderRestrictionRule, "start_date" | "end_date">>) => string[];
export declare const restrictionLeavesNoAllowedValues: (input: {
    payeeId: number;
    rules: ProviderRestrictionRule[] | undefined;
    universe: Array<string | number>;
}) => boolean;
export declare const validateProviderRestrictionInput: (input: ProviderRestrictionInput, options?: ValidateProviderRestrictionOptions) => ProviderRestrictionInputError[];
export declare const checkProviderRestrictionValue: (input: {
    payeeId: number;
    date: string;
    value: string | number;
    rules: ProviderRestrictionRule[] | undefined;
    universe: Array<string | number>;
    label: string;
    valueLabel?: string;
}) => ProviderRestrictionCheckResult;
