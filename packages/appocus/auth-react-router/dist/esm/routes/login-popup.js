import { jsx as _jsx } from "react/jsx-runtime";
import { redirect } from "react-router";
import { buildOAuthAuthorizeURL } from "../oauth-authorize-url.js";
import { getAuthRuntime } from "../runtime-config.js";
export function createLoginPopupRoute(options = {}) {
    const message = options.redirectingMessage ?? "Redirigiendo al inicio de sesión…";
    const loader = async ({ request }) => {
        const { reauthConstants } = getAuthRuntime();
        throw redirect(buildOAuthAuthorizeURL(request.url, {
            state: reauthConstants.REAUTH_POPUP_OAUTH_STATE,
        }));
    };
    function LoginPopupPage() {
        return (_jsx("div", { className: "bg-muted flex min-h-svh items-center justify-center p-6 text-center text-sm text-muted-foreground", children: message }));
    }
    return {
        loader,
        default: LoginPopupPage,
    };
}
