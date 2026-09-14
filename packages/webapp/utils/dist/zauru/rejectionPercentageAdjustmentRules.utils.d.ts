import type { Session } from "@remix-run/node";
import { AxiosUtilsResponse, RejectionPercentageAdjustmentRule, WebAppRowGraphQL, WebAppTableUpdateResponse } from "@zauru-sdk/types";
export { applyRejectionPercentageAdjustmentRules, applyRejectionPercentageRulesToFinancials, filterActiveRejectionPercentageAdjustmentRules, formatRejectionPercentageAdjustmentDescription, rejectionPercentageAdjustmentRuleMatches, resolveRejectionPercentageBase, resolveRejectionPercentageOrigin, REJECTION_PERCENTAGE_ADJUSTMENT_RULES_TABLE_VAR, } from "@zauru-sdk/common";
export declare const getRejectionPercentageAdjustmentRules: (headers: any, session: Session) => Promise<AxiosUtilsResponse<WebAppRowGraphQL<RejectionPercentageAdjustmentRule>[]>>;
export declare const getActiveRejectionPercentageAdjustmentRules: (headers: any, session?: Session) => Promise<WebAppRowGraphQL<RejectionPercentageAdjustmentRule>[]>;
export declare const createRejectionPercentageAdjustmentRule: (headers: any, session: Session, body: RejectionPercentageAdjustmentRule) => Promise<AxiosUtilsResponse<WebAppTableUpdateResponse>>;
export declare const updateRejectionPercentageAdjustmentRule: (headers: any, session: Session, id: string, body: Partial<RejectionPercentageAdjustmentRule>) => Promise<AxiosUtilsResponse<WebAppTableUpdateResponse>>;
