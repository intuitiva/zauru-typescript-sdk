import type { Session } from "@remix-run/node";
import { AxiosUtilsResponse, PesoMaximoPorCanasta, WebAppRowGraphQL, WebAppTableUpdateResponse } from "@zauru-sdk/types";
export declare function get4pinosWeightLimitPerBasket(headers: any, session: Session): Promise<AxiosUtilsResponse<WebAppRowGraphQL<PesoMaximoPorCanasta>[]>>;
export declare function delete4pinosWeightLimitPerBasket(headers: any, session: Session, id: number): Promise<AxiosUtilsResponse<WebAppTableUpdateResponse>>;
export declare function create4pinosWeightLimitPerBasket(headers: any, session: Session, body: PesoMaximoPorCanasta): Promise<AxiosUtilsResponse<WebAppTableUpdateResponse>>;
export declare function update4pinosWeightLimitPerBasket(headers: any, session: Session, id: number, body: Partial<PesoMaximoPorCanasta>): Promise<AxiosUtilsResponse<WebAppTableUpdateResponse>>;
