import type { RejectionCalculationMemo, RejectionPercentageAdjustmentContext, RejectionPercentageAdjustmentResult, RejectionPercentageAdjustmentRule, RejectionPercentageAdjustmentStep, WebAppRowGraphQL } from "@zauru-sdk/types";
export declare const REJECTION_PERCENTAGE_ADJUSTMENT_RULES_TABLE_VAR = "rejection_percentage_adjustment_rules_web_app_table_id";
export declare const REJECTION_PERCENTAGE_RULE_HISTORY_TYPE: "rechazo_regla_automatica";
export declare const filterActiveRejectionPercentageAdjustmentRules: (rules?: WebAppRowGraphQL<RejectionPercentageAdjustmentRule>[]) => WebAppRowGraphQL<RejectionPercentageAdjustmentRule>[];
export declare const rejectionPercentageAdjustmentRuleMatches: (rule: RejectionPercentageAdjustmentRule, ctx: RejectionPercentageAdjustmentContext) => boolean;
export declare const formatRejectionPercentageAdjustmentDescription: (result: Pick<RejectionPercentageAdjustmentResult, "basePercentage" | "finalPercentage" | "steps">, baseLabel?: string) => string;
/**
 * Callers may pass the origin % or the previously stored final %. With the
 * previous calculations we go back to the origin so the rules never stack twice.
 */
export declare const resolveRejectionPercentageOrigin: (passedPercentage: number, previousCalculations?: RejectionCalculationMemo | null) => number;
export declare const rejectionRuleStepKey: (step: Pick<RejectionPercentageAdjustmentStep, "ruleName" | "operation" | "value">) => string;
/**
 * Rules already stored in the memo are skipped so a later edit does not
 * create a second history line (or a second +2%) for the same rule.
 */
export declare const getNewlyAppliedRejectionRuleSteps: (previous?: RejectionCalculationMemo | null, next?: RejectionCalculationMemo | null) => RejectionPercentageAdjustmentStep[];
export declare const formatAutomaticRejectionRuleHistoryDescription: (step: RejectionPercentageAdjustmentStep) => string;
export declare const isAutomaticRejectionRuleHistoryType: (type: string | undefined) => boolean;
export declare const applyRejectionPercentageAdjustmentRules: (basePercentage: number, rules: Array<RejectionPercentageAdjustmentRule | WebAppRowGraphQL<RejectionPercentageAdjustmentRule>>, ctx: RejectionPercentageAdjustmentContext) => RejectionPercentageAdjustmentResult;
