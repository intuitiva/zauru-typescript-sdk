import type { LoginFormComponent, RouteModule } from "../route-types.js";
/**
 * Minimal session contract this route depends on. Re-typed locally so we don't
 * pull `@zauru-sdk/services` types into the consumer surface.
 */
type ZauruSession = {
    get: (key: string) => unknown;
    has: (key: string) => boolean;
};
export type CallbackSuccessArgs = {
    session: ZauruSession;
    codeValue: string;
    request: Request;
};
export type CallbackSuccessResult = {
    /**
     * Query params appended to the post-login redirect (`/?<queryParams>`). Used
     * by apps to seed their local user context with names, ids, etc.
     */
    queryParams?: URLSearchParams;
};
export type CallbackErrorResult = {
    error: string;
};
export type CallbackActionData = CallbackErrorResult | {
    ok: true;
};
export type CreateCallbackRouteOptions = {
    /** Your app's `LoginForm` (used as the splash while the action runs). */
    LoginForm: LoginFormComponent;
    /**
     * Called after `nativeLogin` succeeds. Use it to persist domain-specific user
     * records (employees, agencies, etc.) and to assemble redirect query params.
     * Throw or return `{ error }` to surface an error to the page.
     */
    onSuccess: (args: CallbackSuccessArgs) => Promise<CallbackSuccessResult | CallbackErrorResult>;
    /**
     * Optional hook for handling client-side login errors before the default toast
     * + navigate fallback runs. Return `true` to skip the default behavior.
     */
    onLoginError?: (description: string) => boolean | void;
    /** Optional override for the position of the error toast. */
    isMobile?: () => boolean;
};
export declare function createCallbackRoute({ LoginForm, onSuccess, onLoginError, isMobile: isMobileFn, }: CreateCallbackRouteOptions): RouteModule<CallbackActionData>;
export {};
