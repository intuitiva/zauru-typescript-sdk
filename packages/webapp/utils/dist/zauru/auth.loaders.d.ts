import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { getSession, loginWebApp } from "@zauru-sdk/services";
export type AuthSession = Awaited<ReturnType<typeof getSession>>;
export type LoginWebAppData = NonNullable<Awaited<ReturnType<typeof loginWebApp>>["data"]>;
export type AuthAccessExtras = {
    /**
     * Return `false` to deny. Throw `redirect(...)` to send the user elsewhere.
     * Any other return (including `void`) allows access.
     */
    requireAccess?: (session: AuthSession) => boolean | void;
};
export type LoginActionExtras = AuthAccessExtras & {
    afterLogin?: (ctx: {
        request: Request;
        session: AuthSession;
        headers: LoginWebAppData["headers"];
        loginData: LoginWebAppData;
    }) => Promise<void>;
};
export declare function createLoginLoader(): LoaderFunction;
/**
 * Remix action for `/login`: OAuth authorize, `loginWebApp`, cookie commit.
 * `afterLogin` runs before `commitSession`. `requireAccess` can deny after
 * a successful OAuth exchange or when a session already has `code`.
 */
export declare function createLoginAction(extras?: LoginActionExtras): ActionFunction;
/**
 * Guard for `/home` and `/reload-catalogs`: no `username` → `/`.
 */
export declare function createSessionGuardLoader(extras?: AuthAccessExtras): LoaderFunction;
export declare function createLogoutLoader(extras?: AuthAccessExtras): LoaderFunction;
export declare function createLogoutAction(): ActionFunction;
/**
 * `/` welcome: existing session (and optional access) → `/home`.
 */
export declare function createIndexLoader(extras?: AuthAccessExtras): LoaderFunction;
/**
 * `/reload-catalogs`: session guard plus optional cookie refresh.
 */
export declare function createReloadCatalogsLoader(extras?: AuthAccessExtras): LoaderFunction;
