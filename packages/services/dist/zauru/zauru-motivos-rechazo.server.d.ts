import type { Session } from "@remix-run/node";
import { AxiosUtilsResponse, MotivoRechazo, RegisterMotivosRechazoBody, WebAppRowGraphQL, WebAppTableUpdateResponse } from "@zauru-sdk/types";
export declare function getMotivosRechazo(headers: any, session: Session): Promise<AxiosUtilsResponse<WebAppRowGraphQL<MotivoRechazo>[]>>;
export declare function deleteMotivosRechazo(headers: any, session: Session, id: number): Promise<AxiosUtilsResponse<WebAppTableUpdateResponse>>;
export declare function createMotivoRechazo(headers: any, session: Session, body: MotivoRechazo): Promise<AxiosUtilsResponse<WebAppTableUpdateResponse>>;
export declare function updateMotivosRechazo(headers: any, session: Session, id: number): Promise<AxiosUtilsResponse<WebAppTableUpdateResponse>>;
export declare function saveMotivosDeRechazoByPurchase(headers: any, session: Session, body: RegisterMotivosRechazoBody, extraBody: {
    temp_purchase_order_id: string;
}): Promise<AxiosUtilsResponse<any>>;
