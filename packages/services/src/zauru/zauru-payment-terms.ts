import type { Session } from "@remix-run/node";
import { handlePossibleAxiosErrors } from "@zauru-sdk/common";
import { AxiosUtilsResponse, PaymentTermGraphQL } from "@zauru-sdk/types";
import { getGraphQLAPIHeaders } from "../common.js";
import { httpGraphQLAPI } from "./httpGraphQL.js";
import {
  getPaymentTermByIdStringQuery,
  getPaymentTermsStringQuery,
} from "@zauru-sdk/graphql";
import { httpZauru } from "./httpZauru.js";

/**
 * getPaymentTerms
 */
export async function getPaymentTerms(
  session: Session,
  config?: {
    includeAllowedDiscounts?: boolean;
    includeAllowedPaymentTerms?: boolean;
    onlyActives?: boolean;
  }
): Promise<AxiosUtilsResponse<PaymentTermGraphQL[]>> {
  return handlePossibleAxiosErrors(async () => {
    const headers = await getGraphQLAPIHeaders(session);

    const defaultConfig = {
      includeAllowedDiscounts: false,
      includeAllowedPaymentTerms: false,
      onlyActives: true,
    };

    const query = getPaymentTermsStringQuery({ ...defaultConfig, ...config });

    const response = await httpGraphQLAPI.post<{
      data: { payment_terms: PaymentTermGraphQL[] };
      errors?: {
        message: string;
        extensions: { path: string; code: string };
      }[];
    }>(
      "",
      {
        query,
      },
      { headers }
    );

    if (response.data.errors) {
      throw new Error(response.data.errors.map((x) => x.message).join(";"));
    }

    const registers = response?.data?.data?.payment_terms;

    return registers;
  });
}

/**
 * getPaymentTermById
 */
export async function getPaymentTermById(
  session: Session,
  id: string | number
): Promise<AxiosUtilsResponse<PaymentTermGraphQL>> {
  return handlePossibleAxiosErrors(async () => {
    const headers = await getGraphQLAPIHeaders(session);

    const response = await httpGraphQLAPI.post<{
      data: { payment_terms: PaymentTermGraphQL[] };
      errors?: {
        message: string;
        extensions: { path: string; code: string };
      }[];
    }>(
      "",
      {
        query: getPaymentTermByIdStringQuery(Number(id)),
      },
      { headers }
    );

    if (response.data.errors) {
      throw new Error(response.data.errors.map((x) => x.message).join(";"));
    }

    if (!response?.data?.data?.payment_terms[0]) {
      throw new Error(
        "No se encontró ningún método de pago con este id: " + id
      );
    }

    const registers = response?.data?.data?.payment_terms[0] ?? [];

    return registers;
  });
}

/**
 * createPaymentTerm
 * @param headers
 */
export async function createPaymentTerm(
  headers: any,
  payment_term: PaymentTermGraphQL
): Promise<AxiosUtilsResponse<PaymentTermGraphQL>> {
  return handlePossibleAxiosErrors(async () => {
    const response = await httpZauru.patch<PaymentTermGraphQL>(
      `/sales/settings/payment_terms.json`,
      {
        payment_term,
      },
      { headers }
    );

    return response.data;
  });
}

/**
 * updatePaymentTerm
 * @param headers
 */
export async function updatePaymentTerm(
  headers: any,
  payment_term: Partial<PaymentTermGraphQL> & any
): Promise<AxiosUtilsResponse<PaymentTermGraphQL>> {
  return handlePossibleAxiosErrors(async () => {
    const response = await httpZauru.patch<PaymentTermGraphQL>(
      `/sales/settings/payment_terms/${payment_term.id}.json`,
      {
        payment_term,
      },
      { headers }
    );

    return response.data;
  });
}
