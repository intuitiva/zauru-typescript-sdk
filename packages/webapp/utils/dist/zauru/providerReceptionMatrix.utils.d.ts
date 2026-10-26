import type { Session } from "@remix-run/node";
import type { AxiosUtilsResponse, ProviderReceptionBlockRule, ProviderReceptionException, WebAppRowGraphQL, WebAppTableUpdateResponse } from "@zauru-sdk/types";
export declare const FOUR_PINOS_NON_SELECTABLE_RECEPTION_ITEM_IDS: readonly [782312, 782638];
export declare const filter4PinosSelectableReceptionItems: <T extends {
    id: number;
}>(items: T[]) => T[];
export declare const getProviderReceptionBlockRules: (headers: any, session: Session, filters?: {
    payeeId?: number;
    receptionTypeCode?: string;
}) => Promise<AxiosUtilsResponse<WebAppRowGraphQL<ProviderReceptionBlockRule>[]>>;
export declare const createProviderReceptionBlockRule: (headers: any, session: Session, body: ProviderReceptionBlockRule) => Promise<AxiosUtilsResponse<WebAppTableUpdateResponse>>;
export declare const updateProviderReceptionBlockRule: (headers: any, session: Session, id: number, body: Partial<ProviderReceptionBlockRule>) => Promise<AxiosUtilsResponse<WebAppTableUpdateResponse>>;
export declare const getProviderReceptionExceptions: (headers: any, session: Session, filters?: {
    payeeId?: number;
    receptionTypeCode?: string;
}) => Promise<AxiosUtilsResponse<WebAppRowGraphQL<ProviderReceptionException>[]>>;
export declare const createProviderReceptionException: (headers: any, session: Session, body: ProviderReceptionException) => Promise<AxiosUtilsResponse<WebAppTableUpdateResponse>>;
export declare const updateProviderReceptionException: (headers: any, session: Session, id: number, body: Partial<ProviderReceptionException>) => Promise<AxiosUtilsResponse<WebAppTableUpdateResponse>>;
