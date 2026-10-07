import { redirect } from "@remix-run/node";
import { config } from "@zauru-sdk/config";
import { commitSession, destroySession, getHeaders, getRefreshSession, getSession, loginWebApp, } from "@zauru-sdk/services";
const loginErrorPayload = (description, title) => ({
    error: true,
    type: "error",
    title: title ??
        "Ocurrió un error al cargar la información de inicio de sesión (Carga de webapp)",
    description,
});
const isDenied = (result) => result === false;
const isResponse = (value) => typeof Response !== "undefined" && value instanceof Response;
const deniedLoginPayload = () => loginErrorPayload("No tienes permiso para acceder a esta aplicación. Si crees que esto es un error, contacta al administrador.", "Acceso denegado");
const evaluateLoginAccess = async (extras, session, headers) => {
    try {
        if (isDenied(await extras?.requireAccess?.(session, headers))) {
            return Response.json(deniedLoginPayload());
        }
        return null;
    }
    catch (error) {
        if (isResponse(error)) {
            throw error;
        }
        const description = error instanceof Error ? error.message : String(error);
        return Response.json(loginErrorPayload(description));
    }
};
const authorizeUrl = (request) => {
    const url = new URL(request.url);
    const hostname = `${url.port ? "http://" : "https://"}${url.hostname}${url.port ? `:${url.port}` : ""}`;
    return `${config.oauthBaseURL}/dialog/authorize?client_id=${config.oauthClientID}&response_type=code&redirect_uri=${hostname}/login`;
};
export function createLoginLoader() {
    return async () => Response.json({});
}
/**
 * Remix action for `/login`: OAuth authorize, `loginWebApp`, cookie commit.
 * `afterLogin` runs before `commitSession`. `requireAccess` can deny after
 * a successful OAuth exchange or when a session already has `code`.
 */
export function createLoginAction(extras) {
    return async ({ request }) => {
        const formData = await request.formData();
        const { action, ...values } = Object.fromEntries(formData);
        if (action === "redirect") {
            const cookie = values?.cookie?.toString() ?? "";
            return redirect("/home", {
                headers: {
                    "Set-Cookie": cookie,
                },
            });
        }
        const codeValue = new URL(request.url).searchParams.get("code") ?? "";
        const cookie = request.headers.get("Cookie") ?? "";
        const session = await getSession(cookie);
        if (!session.has("code") && !codeValue) {
            return redirect(authorizeUrl(request));
        }
        if (session.has("code")) {
            const existingHeaders = await getHeaders(null, session);
            try {
                if (isDenied(await extras?.requireAccess?.(session, existingHeaders))) {
                    return redirect("/");
                }
            }
            catch (error) {
                if (isResponse(error)) {
                    throw error;
                }
                return redirect("/");
            }
            return redirect("/home");
        }
        const loginResponse = await loginWebApp(session, codeValue, cookie);
        if (loginResponse.error || !loginResponse.data) {
            return Response.json(loginErrorPayload(loginResponse.userMsg?.toString() ?? ""));
        }
        const denied = await evaluateLoginAccess(extras, session, loginResponse.data.headers);
        if (denied) {
            return denied;
        }
        if (extras?.afterLogin) {
            await extras.afterLogin({
                request,
                session,
                headers: loginResponse.data.headers,
                loginData: loginResponse.data,
            });
        }
        const expires = new Date();
        expires.setSeconds(expires.getSeconds() + Number(config.expirationDurationInSeconds));
        return Response.json({
            ...loginResponse.data,
            cookie: await commitSession(session, { expires }),
        });
    };
}
/**
 * Guard for `/home` and `/reload-catalogs`: no `username` → `/`.
 */
export function createSessionGuardLoader(extras) {
    return async ({ request }) => {
        const session = await getSession(request.headers.get("Cookie"));
        if (!session.has("username")) {
            return redirect("/");
        }
        const headers = await getHeaders(null, session);
        if (isDenied(await extras?.requireAccess?.(session, headers))) {
            return redirect("/");
        }
        return Response.json({});
    };
}
export function createLogoutLoader(extras) {
    return createSessionGuardLoader(extras);
}
export function createLogoutAction() {
    return async ({ request }) => {
        const session = await getSession(request.headers.get("Cookie"));
        return redirect(`${config.oauthBaseURL}/logout`, {
            headers: {
                "Set-Cookie": await destroySession(session),
            },
        });
    };
}
/**
 * `/` welcome: existing session (and optional access) → `/home`.
 */
export function createIndexLoader(extras) {
    return async ({ request }) => {
        const session = await getSession(request.headers.get("Cookie"));
        if (session.has("username")) {
            const headers = await getHeaders(null, session);
            if (isDenied(await extras?.requireAccess?.(session, headers))) {
                return Response.json({});
            }
            return redirect("/home");
        }
        return Response.json({});
    };
}
/**
 * `/reload-catalogs`: session guard plus optional cookie refresh.
 */
export function createReloadCatalogsLoader(extras) {
    return async ({ request }) => {
        const session = await getSession(request.headers.get("Cookie"));
        if (!session.has("username")) {
            return redirect("/");
        }
        const headers = await getHeaders(null, session);
        if (isDenied(await extras?.requireAccess?.(session, headers))) {
            return redirect("/");
        }
        try {
            const refreshSession = await getRefreshSession(request);
            return Response.json({}, refreshSession
                ? {
                    headers: {
                        "Set-Cookie": refreshSession,
                    },
                }
                : {});
        }
        catch {
            return Response.json({});
        }
    };
}
