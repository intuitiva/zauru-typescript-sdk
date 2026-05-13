import type { Session } from "@remix-run/node";
import { AxiosUtilsResponse, CurrencyGraphQL } from "@zauru-sdk/webapp-types";
/**
 * getCurrencies
 */
export declare function getCurrencies(session: Session): Promise<AxiosUtilsResponse<CurrencyGraphQL[]>>;
