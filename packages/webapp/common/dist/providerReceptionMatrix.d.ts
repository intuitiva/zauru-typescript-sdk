import type { ProviderReceptionBlockRule, ProviderReceptionException, ProviderRestrictionCheckResult } from "@zauru-sdk/types";
export declare const PROVIDER_RECEPTION_MATRIX_TABLE_VAR = "ctl_calidad_admin_matriz_recepcion_proveedor_web_app_table_id";
export declare const PROVIDER_RECEPTION_EXCEPTIONS_TABLE_VAR = "ctl_calidad_admin_excepciones_recepcion_proveedor_web_app_table_id";
export declare const resolveAllowedProviderReceptionItems: (input: {
    payeeId: number;
    receptionTypeCode: string;
    date: string;
    universe: Array<string | number>;
    blockRules?: ProviderReceptionBlockRule[];
    exceptions?: ProviderReceptionException[];
}) => string[];
export declare const resolveAllowedProviderReceptionTypes: (input: {
    payeeId: number;
    date: string;
    receptionTypeCodes: Array<string | number>;
    itemIds: Array<string | number>;
    blockRules?: ProviderReceptionBlockRule[];
    exceptions?: ProviderReceptionException[];
}) => string[];
export declare const providerReceptionMatrixLeavesNoAllowedCombination: (input: {
    payeeId: number;
    receptionTypeCodes: Array<string | number>;
    itemIds: Array<string | number>;
    blockRules?: ProviderReceptionBlockRule[];
    exceptions?: ProviderReceptionException[];
}) => boolean;
export declare const validateProviderReceptionException: (row: ProviderReceptionException, options: {
    receptionTypeCodes: Array<string | number>;
    itemIds: Array<string | number>;
}) => string[];
export declare const evaluateProviderReceptionMatrix: (input: {
    payeeId: number;
    receptionTypeCode: string;
    date: string;
    itemId: string | number;
    itemLabel?: string;
    itemIds: Array<string | number>;
    blockRules?: ProviderReceptionBlockRule[];
    exceptions?: ProviderReceptionException[];
}) => ProviderRestrictionCheckResult;
