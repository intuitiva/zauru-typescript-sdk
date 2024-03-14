import { Session, redirect } from "@remix-run/node";
import { commitSession, getSession } from "@zauru-sdk/services";
import { CONSOLE_LOG_COLORS } from "./common";
import { AxiosRequestHeaders } from "axios";
import httpZauru, {
  AxiosUtilsResponse,
  handlePossibleAxiosErrors,
} from "@zauru-sdk/services";
import {
  Agency,
  OauthProfile,
  ProfileResponse,
  getAgencyInfo,
  getEmployeeInfo,
  getOauthUserInfo,
  getProfileInformation,
} from "@zauru-sdk/services";
import { EmployeeGraphQL } from "@zauru-sdk/graphql";

/**
 * loginWebApp
 * @param session
 * @param codeValue
 * @param cookie
 * @returns
 */
export const loginWebApp = async (
  session: Session,
  codeValue: string,
  cookie: string
): Promise<
  AxiosUtilsResponse<{
    headers: any;
    oauthProfile: OauthProfile;
    employeeProfile: EmployeeGraphQL;
    userProfile: ProfileResponse;
    agencyProfile: Agency;
  }>
> => {
  return handlePossibleAxiosErrors(async () => {
    const userInfoResponse = await getOauthUserInfo(codeValue ?? "");
    if (userInfoResponse.error) {
      throw new Error(userInfoResponse.userMsg);
    }

    const userInfo = userInfoResponse.data;
    session.set("username", userInfo?.username);
    session.set("token", userInfo?.api_key);
    session.set("code", codeValue);
    session.set("name", userInfo?.name);
    session.set("email", userInfo?.email);
    session.set("employee_id", userInfo?.employee_id);

    const headers = await getHeaders(cookie, session, {
      token: userInfo?.api_key ?? "",
      username: userInfo?.username ?? "",
    });

    const res_emp = await getEmployeeInfo(userInfo?.employee_id ?? 0, headers);
    if (res_emp.error) {
      throw new Error(res_emp.userMsg);
    }

    const empInfo = res_emp.data;
    session.set("agency_id", empInfo?.agency_id);
    session.set("email", empInfo?.email);
    session.set("selectedEntity", empInfo?.entity_id);

    const profileInfoResponse = await getProfileInformation(headers);
    if (profileInfoResponse.error) {
      throw new Error(profileInfoResponse.userMsg);
    }
    const profileInfo = profileInfoResponse.data;

    if (!profileInfo?.memberships?.length) {
      throw new Error("El usuario no tiene suscripciones...");
    }

    const membership = profileInfo?.memberships?.filter(
      (member: any) => member?.entity?.id === empInfo?.entity_id
    );

    if (!membership) {
      throw new Error(
        "No se encontró una suscripción para este usuario en la entidad asignada."
      );
    }

    if (membership?.length)
      session.set("entityName", membership[0]?.entity?.name);

    const agencyInfoResponse = await getAgencyInfo(headers, session);
    if (agencyInfoResponse.error) {
      throw new Error(agencyInfoResponse.userMsg);
    }
    session.set("agency_name", agencyInfoResponse.data?.name);

    return {
      headers,
      oauthProfile: userInfo as OauthProfile,
      employeeProfile: empInfo as EmployeeGraphQL,
      userProfile: profileInfo as ProfileResponse,
      agencyProfile: agencyInfoResponse.data as Agency,
    };
  });
};

export type GraphQLToken = {
  status: number;
  message: string;
  token: string;
  expires: string;
  expiresMsg: string;
  graphqlUrl: string;
};

/**
 * Obtiene los headers que se usan en todos los endpoints de zauru
 * @param cookie
 * @param _session La session es opcional, se envía sólo si ya se tiene a la mano, para ya no volverla a consultar.
 * @returns
 */
export const getHeaders = async (
  cookie: string | null,
  _session?: Session | null,
  config?: { token: string; username: string } | null,
  extraConfig?: { withOutContentType: string }
) => {
  // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>Session and Header Info<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
  const session = _session ?? (await getSession(cookie));

  if (!session.has("username") && !config) {
    redirect("/");
    return {};
  }

  const headers = {
    "X-User-Email": config?.username ?? session.get("username"),
    "X-User-Token": config?.token ?? session.get("token"),
    "Content-type": "application/json",
    Accept: "application/json",
  } as { [key: string]: string };

  if (extraConfig?.withOutContentType) {
    delete headers["Content-type"];
  }

  return headers;
};

/**
 * getGraphQLToken
 * @param session
 * @returns
 */
async function getGraphQLToken(
  session: Session
): Promise<AxiosUtilsResponse<GraphQLToken>> {
  return handlePossibleAxiosErrors(async () => {
    const token = (await session.get("graphqlToken")) as GraphQLToken;
    const headers = (await getHeaders(null, session)) as any;

    const tokenHasExpired =
      token &&
      token.expires &&
      new Date(new Date().getTime() - 3 * 60 * 60 * 1000) >=
        new Date(token.expires);

    //Si no hay token, es la primera vez que se recibe, lo voy a traer de zauru
    if (!token || tokenHasExpired) {
      tokenHasExpired
        ? console.log(
            `${CONSOLE_LOG_COLORS.FgYellow}%s${CONSOLE_LOG_COLORS.Reset}`,
            `=============== ⚠️ EL TOKEN GRAPHQL ESTÁ EXPIRADO ⚠️ ====================`
          )
        : console.log(
            `${CONSOLE_LOG_COLORS.FgYellow}%s${CONSOLE_LOG_COLORS.Reset}`,
            `=============== ⚠️ NO HAY UN TOKEN GRAPHQL GUARDADO ⚠️ ====================`
          );

      const responseToken = await httpZauru.get<GraphQLToken>(
        "/apps/graphql.json",
        {
          headers,
        }
      );

      if (responseToken.data) {
        session.set("graphqlToken", responseToken.data);
        await commitSession(session);
        console.log(
          `${CONSOLE_LOG_COLORS.FgGreen}%s${CONSOLE_LOG_COLORS.Reset}`,
          `=============== ✅ TOKEN GRAPHQL GUARDADO EN SESION Y DEVUELTO ✅ ====================`
        );
        return responseToken.data;
      }

      console.log(
        `${CONSOLE_LOG_COLORS.FgRed}%s${CONSOLE_LOG_COLORS.Reset}`,
        `=============== ❗ NO HAY INFORMACIÓN OBTENIDA DEL REQUEST A ZAURU - GET_TOKEN ❗ ====================`
      );
      throw new Error(
        "No viene información en la solicitud de getGraphQLToken a Zauru"
      );
    }

    //Si ya está guardado un token en la sesión y aún no a expirado.
    return token;
  });
}

/**
 * getGraphQLAPIHeaders
 * @param session
 * @returns
 */
export const getGraphQLAPIHeaders = async (session: Session) => {
  const { data: token, error, userMsg } = await getGraphQLToken(session);

  if (error) {
    console.log(
      `${CONSOLE_LOG_COLORS.FgRed}%s${CONSOLE_LOG_COLORS.Reset}`,
      `=============== ❗ OCURRIÓ UN ERROR DEL REQUEST A ZAURU - GET_TOKEN ❗ ==================== ${userMsg}`
    );
    return {
      Authorization: `Bearer token_no_existe`,
      "Content-Type": "application/json",
    } as AxiosRequestHeaders;
  }

  return {
    Authorization: `Bearer ${token?.token}`,
    "Content-Type": "application/json",
  } as AxiosRequestHeaders;
};

export type SessionMessage = { id: string; title: string; message: string };
export const saveSessionMessage = async (
  session: Session,
  info: SessionMessage
): Promise<void> => {
  const updateTasks = (session.get("sessionMessages") ??
    []) as SessionMessage[];
  session.set("updateTasks", [...updateTasks, info]);
  await commitSession(session);
};

export const deleteSessionMessage = async (
  session: Session,
  id: string
): Promise<boolean> => {
  let updateTasks = session.get("sessionMessages") as Array<SessionMessage>;
  if (
    Array.isArray(updateTasks) &&
    updateTasks.some((task: SessionMessage) => task.id === id)
  ) {
    //La elimino de la lista
    updateTasks = updateTasks.filter((task) => task.id !== id);
    session.set("sessionMessages", updateTasks);
    await commitSession(session);
    return true;
  }
  return false;
};

function generarUUID() {
  // Retorna un arreglo de 9 bytes con valores aleatorios
  const array = new Uint8Array(9);
  crypto.getRandomValues(array);

  // Convertir Uint8Array a array normal
  const normalArray = Array.from(array);

  // Codificación en base 64
  const base64 = btoa(String.fromCharCode.apply(null, normalArray))
    .replace("+", "0") // Reemplaza caracteres no alfanuméricos
    .replace("/", "1")
    .substring(0, 11); // Acorta a 11 caracteres

  return base64;
}

// Función para generar un código de producto a partir de un UUID
export function generateDistinctCode(prefix: string) {
  const uuid = generarUUID();
  const codigoProducto = `${prefix}-${uuid}`;
  return codigoProducto;
}
