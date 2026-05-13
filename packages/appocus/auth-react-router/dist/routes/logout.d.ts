import type { LoginFormComponent, RouteModule } from "../route-types.js";
export type CreateLogoutRouteOptions = {
    /** Your app's `LoginForm` (used in the "Cerrando sesión" splash). */
    LoginForm: LoginFormComponent;
    /** Clear app-local user state on the client (e.g. context cache). */
    clearUserData?: () => void;
    /** Copy override for the splash (defaults are Spanish to match the rest of the suite). */
    copy?: {
        title?: string;
        loadingText?: string;
        buttonText?: string;
    };
};
export declare function createLogoutRoute({ LoginForm, clearUserData, copy, }: CreateLogoutRouteOptions): RouteModule;
