import { Session } from "@remix-run/node";
import { PoDiscountHistory } from "@zauru-sdk/types";
export declare const add4pinosPoDiscountsHistory: (session: Session, headers: any, purchaseOrderId: number | string, discounts: PoDiscountHistory["discounts"]) => Promise<import("@zauru-sdk/types").AxiosUtilsResponse<void>>;
