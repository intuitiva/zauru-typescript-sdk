import { arrayToObject, handlePossibleAxiosErrors } from "@zauru-sdk/common";
import { getEntryByIdStringQuery } from "@zauru-sdk/graphql";
import { getGraphQLAPIHeaders } from "../common.js";
import { httpGraphQLAPI } from "./httpGraphQL.js";
import { httpZauru } from "./httpZauru.js";
/**
 * createEntry
 * POST /accounting/entries.json
 * `entry.account_id` is the credit (from) account; splits are debit (to) accounts.
 * `temp_consolidate_id` / `temp_payment_id` attach EntryConsolidate / EntryPayment after save.
 */
export async function createEntry(headers, body) {
    return handlePossibleAxiosErrors(async () => {
        const { splits, temp_consolidate_id, temp_payment_id, temp_invoice_id, ...entry } = body;
        const sendBody = {
            ...entry,
            amount: entry.amount == null ? entry.amount : String(entry.amount),
            splits_attributes: arrayToObject((splits ?? []).map((split) => ({
                ...split,
                amount: split.amount == null ? split.amount : String(split.amount),
            }))),
        };
        const response = await httpZauru.post(`/accounting/entries.json`, {
            entry: sendBody,
            temp_consolidate_id,
            temp_payment_id,
            temp_invoice_id,
        }, { headers });
        return response.data;
    });
}
/**
 * getEntry
 * GraphQL `entries` + `splits` by id.
 */
export async function getEntry(session, id) {
    return handlePossibleAxiosErrors(async () => {
        const headers = await getGraphQLAPIHeaders(session);
        const response = await httpGraphQLAPI.post("", { query: getEntryByIdStringQuery(Number(id)) }, { headers });
        if (response.data.errors) {
            throw new Error(response.data.errors.map((x) => x.message).join(";"));
        }
        const entry = response.data.data?.entries?.[0];
        if (!entry) {
            throw new Error("No se encontró ninguna partida con este id: " + id);
        }
        return entry;
    });
}
/**
 * deleteEntry
 * DELETE /accounting/entries/:id.json
 */
export async function deleteEntry(headers, id) {
    return handlePossibleAxiosErrors(async () => {
        await httpZauru.delete(`/accounting/entries/${id}.json`, { headers });
        return true;
    });
}
