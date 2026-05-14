import type { Session } from "@remix-run/node";
import { handlePossibleAxiosErrors } from "@zauru-sdk/common";
import {
  AxiosUtilsResponse,
  AuthorizationUpdateDiscountPO,
  WebAppRowGraphQL,
  WebAppTableUpdateResponse,
} from "@zauru-sdk/types";
import { getVariablesByName } from "../common.js";
import {
  createWebAppTableRegister,
  deleteWebAppTableRegister,
  getWebAppTableRegisters,
} from "./zauru-web-app-tables.js";

export async function getAuthorizationUpdateDiscountPO(
  headers: any,
  session: Session
): Promise<
  AxiosUtilsResponse<WebAppRowGraphQL<AuthorizationUpdateDiscountPO>[]>
> {
  return handlePossibleAxiosErrors(async () => {
    const { cc_autorizaciones } = await getVariablesByName(headers, session, [
      "cc_autorizaciones",
    ]);

    const response =
      await getWebAppTableRegisters<AuthorizationUpdateDiscountPO>(
        session,
        cc_autorizaciones
      );

    if (response.error || !response.data) {
      throw new Error(response.userMsg);
    }

    return response?.data;
  });
}

export async function deleteAuthorizationUpdateDiscountPO(
  headers: any,
  session: Session,
  id: number
): Promise<AxiosUtilsResponse<WebAppTableUpdateResponse>> {
  return handlePossibleAxiosErrors(async () => {
    const { cc_autorizaciones } = await getVariablesByName(headers, session, [
      "cc_autorizaciones",
    ]);

    const response = await deleteWebAppTableRegister(
      headers,
      cc_autorizaciones,
      id
    );

    return response;
  });
}

export async function createAuthorizationUpdateDiscountPO(
  headers: any,
  session: Session,
  body: AuthorizationUpdateDiscountPO
): Promise<AxiosUtilsResponse<WebAppTableUpdateResponse>> {
  return handlePossibleAxiosErrors(async () => {
    const { cc_autorizaciones } = await getVariablesByName(headers, session, [
      "cc_autorizaciones",
    ]);
    const response =
      await createWebAppTableRegister<AuthorizationUpdateDiscountPO>(
        headers,
        cc_autorizaciones,
        body
      );
    return response;
  });
}
