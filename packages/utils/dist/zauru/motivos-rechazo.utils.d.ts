import { Session } from "@remix-run/node";
import { AxiosUtilsResponse, BasicIdNameSchema, MotivoRechazo, WebAppRowGraphQL, WebAppTableUpdateResponse } from "@zauru-sdk/types";
export declare function formatearMotivoDeRechazo(entity: WebAppRowGraphQL<MotivoRechazo>): BasicIdNameSchema;
/**
 * Post saveBitacoraPOMassive from the web app table.
 * @param headers Request headers.
 * @param session Session object.
 * @returns A Promise of AxiosUtilsResponse<WebAppRowGraphQL<BitacoraPOMassive>[]>.
 */
export declare function saveRechazoCanastas(headers: any, session: Session, body: any): Promise<AxiosUtilsResponse<WebAppTableUpdateResponse>>;
