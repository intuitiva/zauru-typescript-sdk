import { Session } from "@remix-run/node";
import { PoDiscountHistory, PoDiscountHistoryEntry, RejectionPercentageAdjustmentStep } from "@zauru-sdk/types";
export declare const mapRejectionRuleStepsToDiscountHistory: (steps: RejectionPercentageAdjustmentStep[], meta: {
    agency_id: number;
    employee_id?: number;
    created_at?: string;
}) => PoDiscountHistoryEntry[];
export declare const add4pinosPoDiscountsHistory: (session: Session, headers: any, purchaseOrderId: number | string, discounts: PoDiscountHistory["discounts"]) => Promise<import("@zauru-sdk/types").AxiosUtilsResponse<void>>;
