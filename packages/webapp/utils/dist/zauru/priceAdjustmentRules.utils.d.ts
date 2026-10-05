import type { Session } from "@remix-run/node";
import { AxiosUtilsResponse, PriceAdjustmentContext, PriceAdjustmentFilters, PriceAdjustmentResult, PriceAdjustmentRule, PriceAdjustmentReversalPlan, PriceAdjustmentReversalRule, PriceAdjustmentStep, CertificationPenaltyHistoryEntry, WebAppRowGraphQL, WebAppTableUpdateResponse } from "@zauru-sdk/types";
export declare const PRICE_ADJUSTMENT_REVERSAL_RULES_TABLE_VAR = "price_adjustment_reversal_rules_web_app_table_id";
export declare const defaultPriceAdjustmentFilters: () => PriceAdjustmentFilters;
export declare const filterActivePriceAdjustmentRules: (rules?: WebAppRowGraphQL<PriceAdjustmentRule>[]) => WebAppRowGraphQL<PriceAdjustmentRule>[];
export declare const getPriceAdjustmentRules: (headers: any, session: Session) => Promise<AxiosUtilsResponse<WebAppRowGraphQL<PriceAdjustmentRule>[]>>;
export declare const createPriceAdjustmentRule: (headers: any, session: Session, body: PriceAdjustmentRule) => Promise<AxiosUtilsResponse<WebAppTableUpdateResponse>>;
export declare const updatePriceAdjustmentRule: (headers: any, session: Session, id: string, body: Partial<PriceAdjustmentRule>) => Promise<AxiosUtilsResponse<WebAppTableUpdateResponse>>;
export declare const filterActivePriceAdjustmentReversalRules: (rules?: WebAppRowGraphQL<PriceAdjustmentReversalRule>[]) => WebAppRowGraphQL<PriceAdjustmentReversalRule>[];
export declare const getPriceAdjustmentReversalRules: (headers: any, session: Session) => Promise<AxiosUtilsResponse<WebAppRowGraphQL<PriceAdjustmentReversalRule>[]>>;
export declare const createPriceAdjustmentReversalRule: (headers: any, session: Session, body: PriceAdjustmentReversalRule) => Promise<AxiosUtilsResponse<WebAppTableUpdateResponse>>;
export declare const updatePriceAdjustmentReversalRule: (headers: any, session: Session, id: string | number, body: Partial<PriceAdjustmentReversalRule>) => Promise<AxiosUtilsResponse<WebAppTableUpdateResponse>>;
export declare const normalizeComparableValue: (value: string | number | undefined | null) => string;
export declare const formatReceptionTypeValue: (type?: {
    Nombre?: string;
    Codigo?: string;
} | null) => string;
export declare const priceAdjustmentRuleMatches: (rule: PriceAdjustmentRule, ctx: PriceAdjustmentContext) => boolean;
export declare const formatPriceAdjustmentDescription: (result: Pick<PriceAdjustmentResult, "basePrice" | "finalPrice" | "steps">, baseLabel?: string) => string;
export declare const applyPriceAdjustmentRules: (basePrice: number, rules: Array<PriceAdjustmentRule | WebAppRowGraphQL<PriceAdjustmentRule>>, ctx: PriceAdjustmentContext) => PriceAdjustmentResult;
export declare const buildPriceAdjustmentReversalPlan: ({ calculation, currentPrice, reversalRules, history, }: {
    calculation: {
        calculationId?: string;
        detailId?: number;
        itemId: number;
        finalPrice: number;
        steps: PriceAdjustmentStep[];
    };
    currentPrice: number;
    reversalRules: WebAppRowGraphQL<PriceAdjustmentReversalRule>[];
    history?: CertificationPenaltyHistoryEntry[];
}) => PriceAdjustmentReversalPlan;
