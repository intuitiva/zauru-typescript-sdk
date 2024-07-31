import type { Session } from "@remix-run/node";
import { handlePossibleAxiosErrors } from "@zauru-sdk/common";
import { AxiosUtilsResponse, PaymentMethodGraphQL } from "@zauru-sdk/types";
import { getGraphQLAPIHeaders } from "../common.js";
import httpGraphQLAPI from "./httpGraphQL.js";
import { getPaymentMethodsStringQuery } from "@zauru-sdk/graphql";

/**
 * getPaymentTerms
 */
/**
 * getPaymentTerms
 */
export async function getPaymentMethods(
  session: Session,
  config: {
    onlyActives: boolean;
  } = {
    onlyActives: true,
  }
): Promise<AxiosUtilsResponse<PaymentMethodGraphQL[]>> {
  return handlePossibleAxiosErrors(async () => {
    const headers = await getGraphQLAPIHeaders(session);

    const response = await httpGraphQLAPI.post<{
      data: { payment_methods: PaymentMethodGraphQL[] };
      errors?: {
        message: string;
        extensions: { path: string; code: string };
      }[];
    }>(
      "",
      {
        query: getPaymentMethodsStringQuery({
          onlyActives: config.onlyActives,
        }),
      },
      { headers }
    );

    if (response.data.errors) {
      throw new Error(response.data.errors.map((x) => x.message).join(";"));
    }

    const registers = response?.data?.data?.payment_methods;

    return registers;
  });
}
