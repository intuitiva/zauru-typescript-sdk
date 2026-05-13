import type { LoginFormComponent, RouteModule } from "../route-types.js";
export type CreateLoginRouteOptions = {
    /** Your app's `LoginForm` (e.g. from `@appocus/ui`). */
    LoginForm: LoginFormComponent;
    /**
     * Override the default action (e.g. to log analytics). Defaults to redirecting
     * to the OAuth authorize URL derived from `request.url`.
     */
    onAction?: (request: Request) => Promise<Response> | Response;
};
export declare function createLoginRoute({ LoginForm, onAction, }: CreateLoginRouteOptions): RouteModule;
