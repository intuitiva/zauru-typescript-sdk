import { AxiosUtilsResponse, CreateEntryBody } from "@zauru-sdk/types";
/**
 * POST /accounting/entries.json
 * Header `account_id` is the credit; one split is the debit. Amounts are strings.
 */
export declare const createEntry: (headers: any, body: CreateEntryBody) => Promise<AxiosUtilsResponse<{
    id: number;
}>>;
/** DELETE /accounting/entries/:id.json */
export declare const deleteEntry: (headers: any, id: number | string) => Promise<AxiosUtilsResponse<boolean>>;
