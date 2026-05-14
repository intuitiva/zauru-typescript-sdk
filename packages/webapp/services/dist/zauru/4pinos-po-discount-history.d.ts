import type { Session } from "@remix-run/node";
import { AxiosUtilsResponse, PoDiscountHistory, WebAppRowGraphQL, WebAppTableUpdateResponse } from "@zauru-sdk/types";
export declare function get4pinosPoDiscountHistory(headers: any, session: Session): Promise<AxiosUtilsResponse<WebAppRowGraphQL<PoDiscountHistory>[]>>;
export declare function delete4pinosPoDiscountHistory(headers: any, session: Session, id: number): Promise<AxiosUtilsResponse<WebAppTableUpdateResponse>>;
export declare function create4pinosPoDiscountHistory(headers: any, session: Session, body: PoDiscountHistory): Promise<AxiosUtilsResponse<WebAppTableUpdateResponse>>;
export declare function update4pinosPoDiscountHistory(headers: any, session: Session, id: number, body: PoDiscountHistory): Promise<AxiosUtilsResponse<WebAppTableUpdateResponse>>;
