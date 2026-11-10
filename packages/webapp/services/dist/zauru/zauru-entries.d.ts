import type { Session } from "@remix-run/node";
import { AxiosUtilsResponse, EntryGraphQL, SplitGraphQL } from "@zauru-sdk/types";
export type CreateEntryBody = Partial<EntryGraphQL> & {
    splits?: Partial<SplitGraphQL>[];
    temp_consolidate_id?: number;
    temp_payment_id?: number;
    temp_invoice_id?: number;
};
/**
 * createEntry
 * POST /accounting/entries.json
 * `entry.account_id` is the credit (from) account; splits are debit (to) accounts.
 * `temp_consolidate_id` / `temp_payment_id` attach EntryConsolidate / EntryPayment after save.
 */
export declare function createEntry(headers: any, body: CreateEntryBody): Promise<AxiosUtilsResponse<EntryGraphQL>>;
/**
 * getEntry
 * GraphQL `entries` + `splits` by id.
 */
export declare function getEntry(session: Session, id: string | number): Promise<AxiosUtilsResponse<EntryGraphQL>>;
/**
 * deleteEntry
 * DELETE /accounting/entries/:id.json
 */
export declare function deleteEntry(headers: any, id: string | number): Promise<AxiosUtilsResponse<boolean>>;
