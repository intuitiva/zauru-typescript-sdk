import type { Session } from "@remix-run/node";
import { AxiosUtilsResponse, CCPorcentajeRechazo, WebAppRowGraphQL, WebAppTableUpdateResponse } from "@zauru-sdk/types";
export declare function getCCPorcentajesDeRechazo(headers: any, session: Session): Promise<AxiosUtilsResponse<WebAppRowGraphQL<CCPorcentajeRechazo>[]>>;
export declare function deleteCCPorcentajesDeRechazo(headers: any, session: Session, id: number): Promise<AxiosUtilsResponse<WebAppTableUpdateResponse>>;
export declare function createCCPorcentajesDeRechazo(headers: any, session: Session, body: CCPorcentajeRechazo): Promise<AxiosUtilsResponse<WebAppTableUpdateResponse>>;
export declare function updateCCPorcentajesDeRechazo(headers: any, session: Session, id: number, body: CCPorcentajeRechazo): Promise<AxiosUtilsResponse<WebAppTableUpdateResponse>>;
