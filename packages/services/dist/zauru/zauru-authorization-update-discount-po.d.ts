import type { Session } from "@remix-run/node";
import { AxiosUtilsResponse, AuthorizationUpdateDiscountPO, WebAppRowGraphQL, WebAppTableUpdateResponse } from "@zauru-sdk/types";
export declare function getAuthorizationUpdateDiscountPO(headers: any, session: Session): Promise<AxiosUtilsResponse<WebAppRowGraphQL<AuthorizationUpdateDiscountPO>[]>>;
export declare function deleteAuthorizationUpdateDiscountPO(headers: any, session: Session, id: number): Promise<AxiosUtilsResponse<WebAppTableUpdateResponse>>;
export declare function createAuthorizationUpdateDiscountPO(headers: any, session: Session, body: AuthorizationUpdateDiscountPO): Promise<AxiosUtilsResponse<WebAppTableUpdateResponse>>;
