import { redirect } from "@remix-run/node";
import { commitSession, getSession } from "./sessions/sessions.js";
import chalk from "chalk";
import { httpZauru } from "./zauru/httpZauru.js";
import { getAgencyInfo, getEmployeeInfo, getOauthUserInfo, getProfileInformation, } from "./zauru/zauru-profiles.js";
import { handlePossibleAxiosErrors } from "@zauru-sdk/common";
import { getVariables } from "./zauru/zauru-variables.js";
import { config } from "@zauru-sdk/config";
/**
 * nativeLogin
 * @param session
 * @param codeValue
 * @param cookie
 * @returns
 */
export const nativeLogin = async (session, codeValue) => {
    return handlePossibleAxiosErrors(async () => {
        const userInfoResponse = await getOauthUserInfo(codeValue ?? "");
        if (userInfoResponse.error || !userInfoResponse.data) {
            throw new Error(userInfoResponse.userMsg ??
                "Error al obtener la información del usuario en Oauth.");
        }
        const userInfo = userInfoResponse.data;
        session.set("username", userInfo?.username);
        session.set("token", userInfo?.api_key);
        session.set("code", codeValue);
        session.set("name", userInfo?.name);
        session.set("email", userInfo?.email);
        session.set("employee_id", userInfo?.employee_id);
        session.set("selected_entity", userInfo?.selected_entity);
        return userInfo;
    });
};
/**
 * loginWebApp
 * @param session
 * @param codeValue
 * @param cookie
 * @returns
 */
export const loginWebApp = async (session, codeValue, cookie) => {
    return handlePossibleAxiosErrors(async () => {
        const userInfoResponse = await getOauthUserInfo(codeValue ?? "");
        if (userInfoResponse.error || !userInfoResponse.data) {
            throw new Error(userInfoResponse.userMsg ??
                "Error al obtener la información del usuario en Oauth.");
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
        if (!userInfo?.employee_id) {
            throw new Error("El usuario `" +
                userInfo?.username +
                "` no tiene un empleado asignado en la entidad: `" +
                userInfo?.selected_entity +
                " - " +
                userInfo?.selected_entity_name +
                "` por favor contacte con su administrador.");
        }
        const res_emp = await getEmployeeInfo(userInfo?.employee_id, headers);
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
        const membership = profileInfo?.memberships?.filter((member) => member?.entity?.id === empInfo?.entity_id);
        if (!membership) {
            throw new Error("No se encontró una suscripción para este usuario en la entidad asignada.");
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
            oauthProfile: userInfo,
            employeeProfile: empInfo,
            userProfile: profileInfo,
            agencyProfile: agencyInfoResponse.data,
        };
    });
};
/**
 * Obtiene los headers que se usan en todos los endpoints de zauru
 * @param cookie
 * @param _session La session es opcional, se envía sólo si ya se tiene a la mano, para ya no volverla a consultar.
 * @returns
 */
export const getHeaders = async (cookie, _session, config, extraConfig) => {
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
    };
    if (extraConfig?.withOutContentType) {
        delete headers["Content-type"];
    }
    return headers;
};
export const getCMSHeaders = async () => {
    const token = config.cmsAPIToken;
    return {
        Authorization: `users API-Key ${token}`,
        "Content-Type": "application/json",
    };
};
/**
 * getGraphQLToken
 * @param session
 * @returns
 */
async function getGraphQLToken(session) {
    return handlePossibleAxiosErrors(async () => {
        const token = (await session.get("graphqlToken"));
        const headers = (await getHeaders(null, session));
        // Check if token is missing or within one day of expiration
        const now = Date.now();
        let tokenHasExpired = true;
        if (token && token.expires) {
            const expiresAt = Date.parse(token.expires);
            if (!isNaN(expiresAt)) {
                const oneDayMs = 24 * 60 * 60 * 1000;
                // Refresh if already expired or expires within the next 24 hours
                tokenHasExpired = expiresAt <= now + oneDayMs;
            }
        }
        // If there's no valid token or it's expiring soon, fetch a new one
        if (tokenHasExpired) {
            console.log(chalk.yellow(`=============== ⚠️ EL TOKEN GRAPHQL ESTÁ EXPIRADO O NO EXISTE ⚠️ ====================`));
            const responseToken = await httpZauru.get("/apps/graphql.json", {
                headers,
            });
            if (responseToken.data) {
                session.set("graphqlToken", responseToken.data);
                await commitSession(session, {
                    maxAge: 60 * 60 * 24,
                    path: "/",
                    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                });
                console.log(chalk.green(`=============== ✅ TOKEN GRAPHQL GUARDADO EN SESION Y DEVUELTO ✅ ====================`));
                return responseToken.data;
            }
            console.log(chalk.red(`=============== ❗ NO HAY INFORMACIÓN OBTENIDA DEL REQUEST A ZAURU - GET_TOKEN ❗ ====================`));
            throw new Error("No viene información en la solicitud de getGraphQLToken a Zauru");
        }
        // Return the existing valid token
        return token;
    });
}
/**
 * getGraphQLAPIHeaders
 * @param session
 * @returns
 */
export const getGraphQLAPIHeaders = async (session) => {
    const { data: token, error, userMsg } = await getGraphQLToken(session);
    if (error) {
        console.log(chalk.red(`=============== ❗ OCURRIÓ UN ERROR DEL REQUEST A ZAURU - GET_TOKEN ❗ ==================== ${userMsg}`));
        return {
            Authorization: `Bearer token_no_existe`,
            "Content-Type": "application/json",
        };
    }
    return {
        Authorization: `Bearer ${token?.token}`,
        "Content-Type": "application/json",
    };
};
export const saveSessionMessage = async (session, info) => {
    const updateTasks = (session.get("sessionMessages") ??
        []);
    session.set("updateTasks", [...updateTasks, info]);
    await commitSession(session);
};
export const deleteSessionMessage = async (session, id) => {
    let updateTasks = session.get("sessionMessages");
    if (Array.isArray(updateTasks) &&
        updateTasks.some((task) => task.id === id)) {
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
export function generateDistinctCode(prefix) {
    const uuid = generarUUID();
    const codigoProducto = `${prefix}-${uuid}`;
    return codigoProducto;
}
const getCachedSessionVariables = (session) => {
    const tempVars = session.get("variables");
    return Array.isArray(tempVars) && tempVars.length ? tempVars : [];
};
const pickVariablesByName = (variables, names) => {
    const returnObject = {};
    for (const variable of variables) {
        if (names.includes(variable.name)) {
            returnObject[variable.name] = variable.value;
        }
    }
    return returnObject;
};
const missingVariableNames = (names, found) => names.filter((name) => !Object.keys(found).includes(name));
/**
 * Actualiza las variables en la sesión desde Zauru.
 */
export async function actualizarVariables(headers, session) {
    const response = await getVariables(headers);
    if (response.error) {
        throw new Error(`${response.userMsg} - ${response.msg}`);
    }
    const variables = response.data ?? [];
    session.set("variables", variables);
    await commitSession(session);
    console.log("Variables actualizadas y sesión refrescada.");
    return variables;
}
const getSessionVariables = async (headers, session, options) => {
    if (!options?.refresh) {
        const cached = getCachedSessionVariables(session);
        if (cached.length) {
            return { variables: cached, refreshed: false };
        }
    }
    return {
        variables: await actualizarVariables(headers, session),
        refreshed: true,
    };
};
const assertRequestedVariablesFound = (names, found) => {
    const noEncontradas = missingVariableNames(names, found);
    if (noEncontradas.length) {
        throw new Error(`No se encontraron las variables: ${noEncontradas.join(",")} pruebe cerrar e iniciar sesión nuevamente para continuar.`);
    }
};
/**
 *
 * @param headers
 * @param session
 * @param names
 * @returns
 */
export async function getVariablesByName(headers, session, names) {
    let { variables, refreshed } = await getSessionVariables(headers, session);
    let returnObject = pickVariablesByName(variables, names);
    if (missingVariableNames(names, returnObject).length) {
        if (!refreshed) {
            ({ variables } = await getSessionVariables(headers, session, {
                refresh: true,
            }));
            returnObject = pickVariablesByName(variables, names);
        }
        assertRequestedVariablesFound(names, returnObject);
    }
    return returnObject;
}
export async function getVariablesSchemaByName(headers, session, names) {
    let { variables, refreshed } = await getSessionVariables(headers, session);
    let filtrados = variables.filter((value) => names.includes(value.name));
    if (filtrados.length !== names.length && !refreshed) {
        ({ variables } = await getSessionVariables(headers, session, {
            refresh: true,
        }));
        filtrados = variables.filter((value) => names.includes(value.name));
    }
    return filtrados;
}
