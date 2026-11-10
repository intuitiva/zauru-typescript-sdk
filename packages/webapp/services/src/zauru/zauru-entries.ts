import type { Session } from "@remix-run/node";
import { arrayToObject, handlePossibleAxiosErrors } from "@zauru-sdk/common";
import { AxiosUtilsResponse, EntryGraphQL, SplitGraphQL } from "@zauru-sdk/types";
import { getEntryByIdStringQuery } from "@zauru-sdk/graphql";
import { getGraphQLAPIHeaders } from "../common.js";
import { httpGraphQLAPI } from "./httpGraphQL.js";
import { httpZauru } from "./httpZauru.js";

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
export async function createEntry(
  headers: any,
  body: CreateEntryBody
): Promise<AxiosUtilsResponse<EntryGraphQL>> {
  return handlePossibleAxiosErrors(async () => {
    const {
      splits,
      temp_consolidate_id,
      temp_payment_id,
      temp_invoice_id,
      ...entry
    } = body;
    const sendBody = {
      ...entry,
      amount: entry.amount == null ? entry.amount : String(entry.amount),
      splits_attributes: arrayToObject(
        (splits ?? []).map((split) => ({
          ...split,
          amount: split.amount == null ? split.amount : String(split.amount),
        }))
      ),
    };

    const response = await httpZauru.post<EntryGraphQL>(
      `/accounting/entries.json`,
      {
        entry: sendBody,
        temp_consolidate_id,
        temp_payment_id,
        temp_invoice_id,
      },
      { headers }
    );

    return response.data;
  });
}

/**
 * getEntry
 * GraphQL `entries` + `splits` by id.
 */
export async function getEntry(
  session: Session,
  id: string | number
): Promise<AxiosUtilsResponse<EntryGraphQL>> {
  return handlePossibleAxiosErrors(async () => {
    const headers = await getGraphQLAPIHeaders(session);
    const response = await httpGraphQLAPI.post<{
      data: { entries: EntryGraphQL[] };
      errors?: { message: string }[];
    }>(
      "",
      { query: getEntryByIdStringQuery(Number(id)) },
      { headers }
    );

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
export async function deleteEntry(
  headers: any,
  id: string | number
): Promise<AxiosUtilsResponse<boolean>> {
  return handlePossibleAxiosErrors(async () => {
    await httpZauru.delete(`/accounting/entries/${id}.json`, { headers });
    return true;
  });
}
