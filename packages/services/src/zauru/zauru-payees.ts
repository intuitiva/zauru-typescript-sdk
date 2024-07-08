import type { Session } from "@remix-run/node";
import { handlePossibleAxiosErrors } from "@zauru-sdk/common";
import {
  AxiosUtilsResponse,
  PayeeCategoryGraphQL,
  PayeeGraphQL,
} from "@zauru-sdk/types";
import httpGraphQLAPI from "./httpGraphQL.js";
import { getGraphQLAPIHeaders } from "../common.js";
import {
  getClientCategoriesStringQuery,
  getPayeeByIdStringQuery,
  getPayeeCategoriesByNotesMatchStringQuery,
  getPayeeCategoriesStringQuery,
  getPayeeCategoryByIdStringQuery,
  getPayeesStringQuery,
  getProviderCategoriesStringQuery,
  getProvidersStringQuery,
} from "@zauru-sdk/graphql";
import httpZauru from "./httpZauru.js";

/**
 * getPayees
 * @param headers
 * @returns
 */
export async function getPayees(
  session: Session
): Promise<AxiosUtilsResponse<PayeeGraphQL[]>> {
  return handlePossibleAxiosErrors(async () => {
    const headers = await getGraphQLAPIHeaders(session);
    const response = await httpGraphQLAPI.post<{
      data: { payees: PayeeGraphQL[] };
    }>(
      ``,
      {
        query: getPayeesStringQuery,
      },
      {
        headers,
      }
    );

    return response.data?.data.payees;
  });
}

/**
 * getProviders
 * @param headers
 * @returns
 */
export async function getProviders(
  session: Session
): Promise<AxiosUtilsResponse<PayeeGraphQL[]>> {
  return handlePossibleAxiosErrors(async () => {
    const headers = await getGraphQLAPIHeaders(session);
    const response = await httpGraphQLAPI.post<{
      data: { payees: PayeeGraphQL[] };
    }>(
      ``,
      {
        query: getProvidersStringQuery,
      },
      {
        headers,
      }
    );

    return response.data?.data.payees;
  });
}

/**
 * getPayee
 * @param session
 * @param id
 */
export async function getPayee(
  session: Session,
  id: number | string
): Promise<AxiosUtilsResponse<PayeeGraphQL | undefined>> {
  return handlePossibleAxiosErrors(async () => {
    const headers = await getGraphQLAPIHeaders(session);

    const responsePayee = await httpGraphQLAPI.post<{
      data: { payees: PayeeGraphQL[] };
    }>(
      "",
      {
        query: getPayeeByIdStringQuery,
        variables: {
          id,
        },
      },
      { headers }
    );

    if (!responsePayee?.data?.data?.payees[0]) {
      throw new Error("No se encontró el beneficiario indicado");
    }

    return responsePayee?.data?.data?.payees[0];
  });
}

/**
 * getCreatePayee
 * @param headers
 * @param session
 * @param id
 * @returns
 */
export async function getCreatePayee(
  headers: any,
  search: {
    tin?: string;
  }
): Promise<AxiosUtilsResponse<PayeeGraphQL | undefined>> {
  return handlePossibleAxiosErrors(async () => {
    const response = await httpZauru.post<PayeeGraphQL>(
      `/settings/payees/search_payee.json`,
      search,
      {
        headers,
      }
    );
    return response.data;
  });
}

/**
 * getPayeesByCategoryId
 * @param session
 * @param categoryId
 * @returns
 */
export async function getPayeesByCategoryId(
  session: Session,
  id: number | string
): Promise<AxiosUtilsResponse<PayeeGraphQL[]>> {
  return handlePossibleAxiosErrors(async () => {
    const headers = await getGraphQLAPIHeaders(session);
    const response = await httpGraphQLAPI.post<{
      data: {
        payee_categories: { payees: PayeeGraphQL[] }[];
      };
      errors?: {
        message: string;
        extensions: { path: string; code: string };
      }[];
    }>(
      ``,
      {
        query: getPayeeCategoryByIdStringQuery,
        variables: { id },
      },
      { headers }
    );

    if (response.data.errors) {
      throw new Error(response.data.errors.map((x) => x.message).join(";"));
    }

    if (!response?.data?.data?.payee_categories[0]) {
      return [];
    }

    return response.data?.data?.payee_categories[0]?.payees;
  });
}

/**
 * getPayeeCategoriesByNotesMatch
 * @param session
 * @param match
 * @returns
 */
export async function getPayeeCategoriesByNotesMatch(
  session: Session,
  match: string
): Promise<AxiosUtilsResponse<PayeeCategoryGraphQL[]>> {
  return handlePossibleAxiosErrors(async () => {
    const headers = await getGraphQLAPIHeaders(session);
    const response = await httpGraphQLAPI.post<{
      data: {
        payee_categories: PayeeCategoryGraphQL[];
      };
      errors?: {
        message: string;
        extensions: { path: string; code: string };
      }[];
    }>(
      ``,
      {
        query: getPayeeCategoriesByNotesMatchStringQuery(match),
      },
      { headers }
    );

    if (response.data.errors) {
      throw new Error(response.data.errors.map((x) => x.message).join(";"));
    }

    return response.data?.data?.payee_categories;
  });
}

/**
 * getPayeeCategories
 * @param session
 * @param match
 * @returns
 */
export async function getPayeeCategories(
  session: Session
): Promise<AxiosUtilsResponse<PayeeCategoryGraphQL[]>> {
  return handlePossibleAxiosErrors(async () => {
    const headers = await getGraphQLAPIHeaders(session);
    const response = await httpGraphQLAPI.post<{
      data: {
        payee_categories: PayeeCategoryGraphQL[];
      };
      errors?: {
        message: string;
        extensions: { path: string; code: string };
      }[];
    }>(
      ``,
      {
        query: getPayeeCategoriesStringQuery,
      },
      { headers }
    );

    if (response.data.errors) {
      throw new Error(response.data.errors.map((x) => x.message).join(";"));
    }

    return response.data?.data?.payee_categories;
  });
}

/**
 * getProviderCategories
 * @param session
 * @param match
 * @returns
 */
export async function getProviderCategories(
  session: Session
): Promise<AxiosUtilsResponse<PayeeCategoryGraphQL[]>> {
  return handlePossibleAxiosErrors(async () => {
    const headers = await getGraphQLAPIHeaders(session);
    const response = await httpGraphQLAPI.post<{
      data: {
        payee_categories: PayeeCategoryGraphQL[];
      };
      errors?: {
        message: string;
        extensions: { path: string; code: string };
      }[];
    }>(
      ``,
      {
        query: getProviderCategoriesStringQuery,
      },
      { headers }
    );

    if (response.data.errors) {
      throw new Error(response.data.errors.map((x) => x.message).join(";"));
    }

    return response.data?.data?.payee_categories;
  });
}

/**
 * getProviderCategories
 * @param session
 * @param match
 * @returns
 */
export async function getClientCategories(
  session: Session
): Promise<AxiosUtilsResponse<PayeeCategoryGraphQL[]>> {
  return handlePossibleAxiosErrors(async () => {
    const headers = await getGraphQLAPIHeaders(session);
    const response = await httpGraphQLAPI.post<{
      data: {
        payee_categories: PayeeCategoryGraphQL[];
      };
      errors?: {
        message: string;
        extensions: { path: string; code: string };
      }[];
    }>(
      ``,
      {
        query: getClientCategoriesStringQuery,
      },
      { headers }
    );

    if (response.data.errors) {
      throw new Error(response.data.errors.map((x) => x.message).join(";"));
    }

    return response.data?.data?.payee_categories;
  });
}

/**
 * createPayee
 * @param session
 * @param headers
 * @returns
 */
export async function createPayee(
  headers: any,
  body: Partial<PayeeGraphQL>
): Promise<AxiosUtilsResponse<boolean>> {
  return handlePossibleAxiosErrors(async () => {
    await httpZauru.post<any>("/settings/payees", { payee: body }, { headers });
    return true;
  });
}

/**
 * deletePayee
 * @param headers
 * @param id
 * @returns
 */
export async function deletePayee(
  headers: any,
  id: string | number
): Promise<AxiosUtilsResponse<boolean>> {
  return handlePossibleAxiosErrors(async () => {
    await httpZauru.delete<any>(`/settings/payees/${id}?destroy=true`, {
      headers,
    });
    return true;
  });
}

/**
 * updatePayee
 * @param session
 * @param headers
 * @returns
 */
export async function updatePayee(
  headers: any,
  body: Partial<PayeeGraphQL>
): Promise<AxiosUtilsResponse<boolean>> {
  return handlePossibleAxiosErrors(async () => {
    await httpZauru.patch<any>(
      `/settings/payees/${body.id}`,
      { payee: body },
      { headers }
    );
    return true;
  });
}

/**
 * createPayeeCategory
 * @param session
 * @param headers
 * @returns
 */
export async function createPayeeCategory(
  headers: any,
  body: Partial<PayeeCategoryGraphQL>
): Promise<AxiosUtilsResponse<PayeeCategoryGraphQL>> {
  return handlePossibleAxiosErrors(async () => {
    const response = await httpZauru.post<any>(
      "/settings/payees/payee_categories",
      { payee_category: body },
      { headers }
    );
    return response.data;
  });
}

/**
 * updatePayeeCategory
 * @param session
 * @param headers
 * @returns
 */
export async function updatePayeeCategory(
  headers: any,
  body: Partial<PayeeCategoryGraphQL>
): Promise<AxiosUtilsResponse<boolean>> {
  return handlePossibleAxiosErrors(async () => {
    await httpZauru.patch<any>(
      `/settings/payees/payee_categories/${body.id}`,
      { payee_category: body },
      { headers }
    );
    return true;
  });
}

/**
 * deletePayeeCategory
 * @param headers
 * @param id
 * @returns
 */
export async function deletePayeeCategory(
  headers: any,
  id: string | number
): Promise<AxiosUtilsResponse<boolean>> {
  return handlePossibleAxiosErrors(async () => {
    await httpZauru.delete<any>(
      `/settings/payees/payee_categories/${id}?destroy=true`,
      {
        headers,
      }
    );
    return true;
  });
}
