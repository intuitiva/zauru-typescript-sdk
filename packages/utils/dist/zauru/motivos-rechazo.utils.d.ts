import { Session } from "@remix-run/node";
import { AxiosUtilsResponse, BasicIdNameSchema, MotivoRechazo, WebAppRowGraphQL, WebAppTableUpdateResponse } from "@zauru-sdk/types";
export declare const formatearMotivoDeRechazo: (entity: WebAppRowGraphQL<MotivoRechazo>) => BasicIdNameSchema;
/**
 * Post saveRechazoCanastas from the web app table.
 * @param headers Request headers.
 * @param session Session object.
 * @returns A Promise of AxiosUtilsResponse<WebAppRowGraphQL<WebAppTableUpdateResponse>[]>.
 */
export declare const saveRechazoCanastas: (headers: any, session: Session, body: any) => Promise<AxiosUtilsResponse<WebAppTableUpdateResponse>>;
