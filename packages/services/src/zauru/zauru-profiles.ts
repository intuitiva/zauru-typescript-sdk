import type { Session } from "@remix-run/node";
import { httpZauru } from "./httpZauru.js";
import httpOauth from "./httpOauth.js";
import {
  AgencyGraphQL,
  EmployeeGraphQL,
  OauthProfile,
  ProfileResponse,
  AxiosUtilsResponse,
} from "@zauru-sdk/types";
import { handlePossibleAxiosErrors } from "@zauru-sdk/common";
import { config } from "@zauru-sdk/config";

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
    `${config.zauruBaseURL}/company.json`,
    JSON.stringify({
      selected_entity_id: entityId,
    }),
    {
      headers,
    }
  );
  return changeEntityFetch.data;
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
