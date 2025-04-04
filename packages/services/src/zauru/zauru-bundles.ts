import type { Session } from "@remix-run/node";
import { arrayToObject, handlePossibleAxiosErrors } from "@zauru-sdk/common";
import { AxiosUtilsResponse, BundleGraphQL } from "@zauru-sdk/types";
import { getGraphQLAPIHeaders } from "../common.js";
import { httpGraphQLAPI } from "./httpGraphQL.js";
import {
  getBundleByNameStringQuery,
  getBundlesByItemCategoryIdStringQuery,
} from "@zauru-sdk/graphql";
import { httpZauru } from "./httpZauru.js";

/**
 * getBundlesByItemCategoryId
 */
export async function getBundlesByItemCategoryId(
  session: Session,
  id: string | number
): Promise<AxiosUtilsResponse<BundleGraphQL[]>> {
  return handlePossibleAxiosErrors(async () => {
    const headers = await getGraphQLAPIHeaders(session);

    const response = await httpGraphQLAPI.post<{
      data: { bundles: BundleGraphQL[] };
      errors?: {
        message: string;
        extensions: { path: string; code: string };
      }[];
    }>(
      "",
      {
        query: getBundlesByItemCategoryIdStringQuery(Number(id)),
      },
      { headers }
    );

    if (response.data.errors) {
      throw new Error(response.data.errors.map((x) => x.message).join(";"));
    }

    const registers = response?.data?.data?.bundles;

    return registers;
  });
}

/**
 * getBundleByName
 */
export async function getBundleByName(
  session: Session,
  name: string
): Promise<AxiosUtilsResponse<BundleGraphQL>> {
  return handlePossibleAxiosErrors(async () => {
    const headers = await getGraphQLAPIHeaders(session);

    const response = await httpGraphQLAPI.post<{
      data: { bundles: BundleGraphQL[] };
      errors?: {
        message: string;
        extensions: { path: string; code: string };
      }[];
    }>(
      "",
      {
        query: getBundleByNameStringQuery,
        variables: {
          name,
        },
      },
      { headers }
    );

    if (response.data.errors) {
      throw new Error(response.data.errors.map((x) => x.message).join(";"));
    }

    if (!response?.data?.data?.bundles[0]) {
      throw new Error(
        `No se encontró ningún bundle con el nombre: ${name} asociado`
      );
    }

    const register = response?.data?.data?.bundles[0];

    return register;
  });
}

/**
 * createBundle
 * @param headers
 * @param body
 */
export async function createBundle(
  headers: any,
  body: Partial<BundleGraphQL>
): Promise<AxiosUtilsResponse<BundleGraphQL>> {
  return handlePossibleAxiosErrors(async () => {
    const sendBody = {
      ...body,
      bundle_details_attributes: arrayToObject(body.bundle_details, {
        withOutId: true,
      }),
    };
    delete sendBody.bundle_details;
    const response = await httpZauru.post<BundleGraphQL>(
      `/inventories/bundles.json`,
      sendBody,
      { headers }
    );
    return response.data;
  });
}

/**
 * updateBundle
 * @param headers
 * @param body
 */
export async function updateBundle(
  headers: any,
  body: Partial<BundleGraphQL>
): Promise<AxiosUtilsResponse<BundleGraphQL>> {
  return handlePossibleAxiosErrors(async () => {
    const sendBody = {
      ...body,
      bundle_details_attributes: arrayToObject(body.bundle_details),
    };
    delete sendBody.bundle_details;
    const response = await httpZauru.patch<BundleGraphQL>(
      `/inventories/bundles/${body.id}.json`,
      sendBody,
      { headers }
    );
    return response.data;
  });
}

/**
 * deleteBundle
 * @param headers
 * @param body
 */
export async function deleteBundle(
  headers: any,
  id: string | number
): Promise<AxiosUtilsResponse<boolean>> {
  return handlePossibleAxiosErrors(async () => {
    await httpZauru.delete<any>(`/inventories/bundles/${id}?destroy=true`, {
      headers,
    });
    return true;
  });
}
