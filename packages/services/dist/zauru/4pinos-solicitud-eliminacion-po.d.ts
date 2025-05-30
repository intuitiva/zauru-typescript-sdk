import type { Session } from "@remix-run/node";
import { AxiosUtilsResponse, SolicitudEliminacionPO, WebAppRowGraphQL, WebAppTableUpdateResponse } from "@zauru-sdk/types";
export declare function get4pinosSolicitudEliminacionPO(headers: any, session: Session): Promise<AxiosUtilsResponse<WebAppRowGraphQL<SolicitudEliminacionPO>[]>>;
export declare function delete4pinosSolicitudEliminacionPO(headers: any, session: Session, id: number): Promise<AxiosUtilsResponse<WebAppTableUpdateResponse>>;
export declare function create4pinosSolicitudEliminacionPO(headers: any, session: Session, body: SolicitudEliminacionPO): Promise<AxiosUtilsResponse<WebAppTableUpdateResponse>>;
export declare function update4pinosSolicitudEliminacionPO(headers: any, session: Session, id: number, body: SolicitudEliminacionPO): Promise<AxiosUtilsResponse<WebAppTableUpdateResponse>>;
