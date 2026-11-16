import { arrayToObject, handlePossibleAxiosErrors } from "@zauru-sdk/common";
import { AxiosUtilsResponse, CreateEntryBody } from "@zauru-sdk/types";
import { httpZauru } from "./httpZauru.js";

/**
 * POST /accounting/entries.json
 * Header `account_id` is the credit; one split is the debit. Amounts are strings.
 */
export const createEntry = async (
  headers: any,
  body: CreateEntryBody,
): Promise<AxiosUtilsResponse<{ id: number }>> => {
  return handlePossibleAxiosErrors(async () => {
    const amount = body.amount.toFixed(2);
    const response = await httpZauru.post<{ id: number }>(
      `/accounting/entries.json`,
      {
        entry: {
          date: body.date,
          reference: body.reference,
          memo: body.memo,
          account_id: body.credit_account_id,
          amount,
          splits_attributes: arrayToObject([
            { account_id: body.debit_account_id, amount },
          ]),
        },
      },
      { headers },
    );
    return response.data;
  });
};

/** DELETE /accounting/entries/:id.json */
export const deleteEntry = async (
  headers: any,
  id: number | string,
): Promise<AxiosUtilsResponse<boolean>> => {
  return handlePossibleAxiosErrors(async () => {
    await httpZauru.delete(`/accounting/entries/${id}.json`, { headers });
    return true;
  });
};
