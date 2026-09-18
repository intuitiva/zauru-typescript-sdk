import type { RejectionCalculationMemo, RejectionPercentageAdjustmentContext, RejectionPercentageAdjustmentResult, RejectionPercentageAdjustmentRule, RejectionPercentageAdjustmentStep, RejectionPercentageApplication, RejectionPercentageLayers, WebAppRowGraphQL } from "@zauru-sdk/types";
export declare const REJECTION_PERCENTAGE_ADJUSTMENT_RULES_TABLE_VAR = "rejection_percentage_adjustment_rules_web_app_table_id";
export declare const REJECTION_PERCENTAGE_RULE_HISTORY_TYPE: "rechazo_regla_automatica";
export declare const filterActiveRejectionPercentageAdjustmentRules: (rules?: WebAppRowGraphQL<RejectionPercentageAdjustmentRule>[]) => WebAppRowGraphQL<RejectionPercentageAdjustmentRule>[];
export declare const rejectionPercentageAdjustmentRuleMatches: (rule: RejectionPercentageAdjustmentRule, ctx: RejectionPercentageAdjustmentContext) => boolean;
export declare const normalizeRejectionPercentageLayers: (layers?: Partial<RejectionPercentageLayers> | null) => RejectionPercentageLayers;
export declare const applyRejectionPercentageLayers: (layers: RejectionPercentageLayers, application: RejectionPercentageApplication) => RejectionPercentageLayers;
/**
 * Effective rejection % after additive then each successive rate on the remainder.
 * 10% then 10% successive → 19, not 20.
 */
export declare const computeEffectiveRejectionPercentage: (layers: RejectionPercentageLayers, digits?: number) => number;
export declare const hasSuccessiveRejectionLayers: (layers?: Partial<RejectionPercentageLayers> | null) => boolean;
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
