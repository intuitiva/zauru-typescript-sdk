import { Session } from "@remix-run/node";
import { PoDiscountHistory } from "@zauru-sdk/webapp-types";
export declare const add4pinosPoDiscountsHistory: (session: Session, headers: any, purchaseOrderId: number | string, discounts: PoDiscountHistory["discounts"]) => Promise<import("@zauru-sdk/webapp-types").AxiosUtilsResponse<void>>;
