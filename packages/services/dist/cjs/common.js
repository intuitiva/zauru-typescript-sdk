"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getVariablesByName = exports.generateDistinctCode = exports.deleteSessionMessage = exports.saveSessionMessage = exports.getGraphQLAPIHeaders = exports.getHeaders = exports.loginWebApp = void 0;
const node_1 = require("@remix-run/node");
const sessions_js_1 = require("./sessions/sessions.js");
const chalk_1 = __importDefault(require("chalk"));
const httpZauru_js_1 = __importDefault(require("./zauru/httpZauru.js"));
const zauru_profiles_js_1 = require("./zauru/zauru-profiles.js");
const common_1 = require("@zauru-sdk/common");
const zauru_variables_js_1 = require("./zauru/zauru-variables.js");
/**
 * loginWebApp
 * @param session
 * @param codeValue
 * @param cookie
 * @returns
 */
const loginWebApp = async (session, codeValue, cookie) => {
    return (0, common_1.handlePossibleAxiosErrors)(async () => {
        const userInfoResponse = await (0, zauru_profiles_js_1.getOauthUserInfo)(codeValue ?? "");
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
        const headers = await (0, exports.getHeaders)(cookie, session, {
            token: userInfo?.api_key ?? "",
            username: userInfo?.username ?? "",
        });
        const res_emp = await (0, zauru_profiles_js_1.getEmployeeInfo)(userInfo?.employee_id ?? 0, headers);
        if (res_emp.error) {
            throw new Error(res_emp.userMsg);
        }
        const empInfo = res_emp.data;
        session.set("agency_id", empInfo?.agency_id);
        session.set("email", empInfo?.email);
        session.set("selectedEntity", empInfo?.entity_id);
        const profileInfoResponse = await (0, zauru_profiles_js_1.getProfileInformation)(headers);
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
        const agencyInfoResponse = await (0, zauru_profiles_js_1.getAgencyInfo)(headers, session);
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
exports.loginWebApp = loginWebApp;
/**
 * Obtiene los headers que se usan en todos los endpoints de zauru
 * @param cookie
 * @param _session La session es opcional, se envía sólo si ya se tiene a la mano, para ya no volverla a consultar.
 * @returns
 */
const getHeaders = async (cookie, _session, config, extraConfig) => {
    // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>Session and Header Info<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
    const session = _session ?? (await (0, sessions_js_1.getSession)(cookie));
    if (!session.has("username") && !config) {
        (0, node_1.redirect)("/");
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
exports.getHeaders = getHeaders;
/**
 * getGraphQLToken
 * @param session
 * @returns
 */
async function getGraphQLToken(session) {
    return (0, common_1.handlePossibleAxiosErrors)(async () => {
        const token = (await session.get("graphqlToken"));
        const headers = (await (0, exports.getHeaders)(null, session));
        const tokenHasExpired = token &&
            token.expires &&
            new Date(new Date().getTime() - 3 * 60 * 60 * 1000) >=
                new Date(token.expires);
        //Si no hay token, es la primera vez que se recibe, lo voy a traer de zauru
        if (!token || tokenHasExpired) {
            tokenHasExpired
                ? console.log(chalk_1.default.yellow(`=============== ⚠️ EL TOKEN GRAPHQL ESTÁ EXPIRADO ⚠️ ====================`))
                : console.log(chalk_1.default.yellow(`=============== ⚠️ NO HAY UN TOKEN GRAPHQL GUARDADO ⚠️ ====================`));
            const responseToken = await httpZauru_js_1.default.get("/apps/graphql.json", {
                headers,
            });
            if (responseToken.data) {
                session.set("graphqlToken", responseToken.data);
                await (0, sessions_js_1.commitSession)(session);
                console.log(chalk_1.default.green(`=============== ✅ TOKEN GRAPHQL GUARDADO EN SESION Y DEVUELTO ✅ ====================`));
                return responseToken.data;
            }
            console.log(chalk_1.default.red(`=============== ❗ NO HAY INFORMACIÓN OBTENIDA DEL REQUEST A ZAURU - GET_TOKEN ❗ ====================`));
            throw new Error("No viene información en la solicitud de getGraphQLToken a Zauru");
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
const getGraphQLAPIHeaders = async (session) => {
    const { data: token, error, userMsg } = await getGraphQLToken(session);
    if (error) {
        console.log(chalk_1.default.red(`=============== ❗ OCURRIÓ UN ERROR DEL REQUEST A ZAURU - GET_TOKEN ❗ ==================== ${userMsg}`));
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
exports.getGraphQLAPIHeaders = getGraphQLAPIHeaders;
const saveSessionMessage = async (session, info) => {
    const updateTasks = (session.get("sessionMessages") ??
        []);
    session.set("updateTasks", [...updateTasks, info]);
    await (0, sessions_js_1.commitSession)(session);
};
exports.saveSessionMessage = saveSessionMessage;
const deleteSessionMessage = async (session, id) => {
    let updateTasks = session.get("sessionMessages");
    if (Array.isArray(updateTasks) &&
        updateTasks.some((task) => task.id === id)) {
        //La elimino de la lista
        updateTasks = updateTasks.filter((task) => task.id !== id);
        session.set("sessionMessages", updateTasks);
        await (0, sessions_js_1.commitSession)(session);
        return true;
    }
    return false;
};
exports.deleteSessionMessage = deleteSessionMessage;
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
function generateDistinctCode(prefix) {
    const uuid = generarUUID();
    const codigoProducto = `${prefix}-${uuid}`;
    return codigoProducto;
}
exports.generateDistinctCode = generateDistinctCode;
/**
 *
 * @param headers
 * @param session
 * @param names
 * @returns
 */
async function getVariablesByName(headers, session, names) {
    //variables
    let variables = [];
    //consulto si ya están guardadas en la sesión
    const tempVars = session.get("variables");
    if (Array.isArray(tempVars) && tempVars.length) {
        //si ya están guardadas, uso esas
        variables = tempVars;
    }
    else {
        //si no están en la sesión, las obtengo de zauru y luego las guardo en la sesión
        //Obtengo mis variables, para tener los tags solicitados
        const response = await (0, zauru_variables_js_1.getVariables)(headers);
        if (response.error) {
            throw new Error(`${response.userMsg} - ${response.msg}`);
        }
        session.set("variables", response.data);
        await (0, sessions_js_1.commitSession)(session);
        variables = response.data ?? [];
    }
    const filtrados = variables.filter((value) => names.includes(value.name));
    const returnObject = {};
    filtrados.forEach((variable) => {
        returnObject[`${variable.name}`] = variable.value;
    });
    //Pregunto si todas las variables fueron encontradas o no
    if (!names.every((variable) => Object.keys(returnObject).includes(variable))) {
        const noEncontradas = names
            .filter((variable) => !Object.keys(returnObject).includes(variable))
            .join(",");
        throw new Error(`No se encontraron las variables: ${noEncontradas} pruebe cerrar e iniciar sesión nuevamente para continuar.`);
    }
    return returnObject;
}
exports.getVariablesByName = getVariablesByName;
