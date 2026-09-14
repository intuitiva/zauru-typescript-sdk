import type { PurchaseOrderFinancialDetail, RejectionPercentageAdjustmentContext, RejectionPercentageAdjustmentResult, RejectionPercentageAdjustmentRule, WebAppRowGraphQL } from "@zauru-sdk/types";
export declare const REJECTION_PERCENTAGE_ADJUSTMENT_RULES_TABLE_VAR = "rejection_percentage_adjustment_rules_web_app_table_id";
export declare const filterActiveRejectionPercentageAdjustmentRules: (rules?: WebAppRowGraphQL<RejectionPercentageAdjustmentRule>[]) => WebAppRowGraphQL<RejectionPercentageAdjustmentRule>[];
export declare const rejectionPercentageAdjustmentRuleMatches: (rule: RejectionPercentageAdjustmentRule, ctx: RejectionPercentageAdjustmentContext) => boolean;
export declare const formatRejectionPercentageAdjustmentDescription: (result: Pick<RejectionPercentageAdjustmentResult, "basePercentage" | "finalPercentage" | "steps">, baseLabel?: string) => string;
export declare const resolveRejectionPercentageOrigin: (passedPercentage: number, memo?: string | object) => number;
export declare const resolveRejectionPercentageBase: (memo?: string | object) => number;
export declare const applyRejectionPercentageAdjustmentRules: (basePercentage: number, rules: Array<RejectionPercentageAdjustmentRule | WebAppRowGraphQL<RejectionPercentageAdjustmentRule>>, ctx: RejectionPercentageAdjustmentContext) => RejectionPercentageAdjustmentResult;
export declare const applyRejectionPercentageRulesToFinancials: (input: {
    memo?: string | object;
    originPercentage: number;
    details: PurchaseOrderFinancialDetail[];
    rules: Array<RejectionPercentageAdjustmentRule | WebAppRowGraphQL<RejectionPercentageAdjustmentRule>>;
    ctx: RejectionPercentageAdjustmentContext;
}) => {
    memo: string;
    discount: number;
    finalPercentage: number;
};
