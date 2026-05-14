import type { Session } from "@remix-run/node";
import { AxiosUtilsResponse, BasicIdNameSchema } from "@zauru-sdk/types";
/**
 * getProvidersList
 * @param headers
 * @param session
 * @param byReceptions
 * @returns
 */
export declare const getProvidersList: (headers: any, session: Session, byReceptions?: boolean) => Promise<AxiosUtilsResponse<{
    vendors: BasicIdNameSchema[];
    vendors_categories: BasicIdNameSchema[];
}>>;
