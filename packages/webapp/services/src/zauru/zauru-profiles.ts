import type { Session } from "@remix-run/node";
import { httpZauru } from "./httpZauru.js";
import { httpOauth } from "./httpOauth.js";
import {
  AgencyGraphQL,
  EmployeeGraphQL,
  GraphQLToken,
  OauthProfile,
  ProfileResponse,
  AxiosUtilsResponse,
} from "@zauru-sdk/types";
import { handlePossibleAxiosErrors } from "@zauru-sdk/common";

/**
 * getOauthUserInfo
 * @param codeValue
 * @returns
 */
export const getOauthUserInfo = async (
  codeValue: string
): Promise<AxiosUtilsResponse<OauthProfile>> => {
  return handlePossibleAxiosErrors(async () => {
    const response = await httpOauth.get<OauthProfile>(`/api/userinfo`, {
      headers: {
        Authorization: `Bearer ${codeValue}`,
      },
    });
    return response.data;
  });
};

/**
 *
 * @param employeeId
 * @param headers
 * @returns
 */
export const getEmployeeInfo = async (
  id: number,
  headers: any
): Promise<AxiosUtilsResponse<EmployeeGraphQL>> => {
  return handlePossibleAxiosErrors(async () => {
    const employeeInfo = await httpZauru.get<EmployeeGraphQL>(
      `/settings/employees/${id}.json`,
      { headers }
    );
    return employeeInfo.data;
  });
};

/**
 * getProfileInformation
 * @param headers
 * @returns
 */
export const getProfileInformation = async (
  headers: any
): Promise<AxiosUtilsResponse<ProfileResponse>> => {
  return handlePossibleAxiosErrors(async () => {
    const response = await httpZauru.get<ProfileResponse>(`/profile.json`, {
      headers,
    });

    return response.data;
  });
};

export const changeEntity = async (headers: any, entityId: string) => {
  const changeEntityFetch = await httpZauru.patch<any>(
    `/company.json`,
    { selected_entity_id: String(entityId) },
    {
      headers,
    }
  );
  return changeEntityFetch.data;
};

export const withSelectedEntity = async <T>(
  headers: any,
  entityId: string | number,
  fn: (ctx: {
    restHeaders: any;
    graphqlHeaders: Record<string, string>;
  }) => Promise<T>,
): Promise<T> => {
  await changeEntity(headers, String(entityId));
  const responseToken = await httpZauru.get<GraphQLToken>("/apps/graphql.json", {
    headers,
  });
  if (!responseToken.data?.token) {
    throw new Error(
      "No viene información en la solicitud de getGraphQLToken a Zauru",
    );
  }
  const graphqlHeaders = {
    Authorization: `Bearer ${responseToken.data.token}`,
    "Content-Type": "application/json",
  };
  return fn({ restHeaders: headers, graphqlHeaders });
};

/**
 *
 * @param headers
 * @returns
 */
export const getAgencyInfo = async (
  headers: any,
  session: Session
): Promise<AxiosUtilsResponse<AgencyGraphQL>> => {
  return handlePossibleAxiosErrors(async () => {
    const agency_id = session.get("agency_id");
    if (!agency_id) {
      throw new Error(
        "No hay una agencia asignada para este usuario... Contacte con su administrador."
      );
    }
    const response = await httpZauru.get<AgencyGraphQL>(
      `/settings/agencies/${agency_id}.json`,
      {
        headers,
      }
    );

    return response?.data;
  });
};
