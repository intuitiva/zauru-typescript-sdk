import { AxiosUtilsResponse, SerialGraphQL } from "@zauru-sdk/types";
import { Session } from "@remix-run/node";
/**
 * getSerials
 */
export declare function getSerials(session: Session, filters?: {
    name?: string;
    id?: number | string;
}): Promise<AxiosUtilsResponse<SerialGraphQL[]>>;
/**
 * createSupportSerialAttended
 * @param headers
 * @param body
 */
export declare function createSupportSerialAttended(headers: any, body: Partial<SerialGraphQL> & {
    payee_id: number;
}): Promise<AxiosUtilsResponse<SerialGraphQL>>;
