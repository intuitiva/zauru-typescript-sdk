import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { redirect } from "react-router";
import { loginMiddleware } from "../middleware.js";
import { buildOAuthAuthorizeURL } from "../oauth-authorize-url.js";
import { AuthShellLayout } from "../auth-shell-layout.js";
import { RedirectIfAuthenticated } from "../redirect-if-authenticated.js";
export function createLoginRoute({ LoginForm, onAction, }) {
    const action = async ({ request }) => {
        if (onAction)
            return onAction(request);
        return redirect(buildOAuthAuthorizeURL(request.url));
    };
    function LoginPage() {
        return (_jsxs(AuthShellLayout, { children: [_jsx(RedirectIfAuthenticated, {}), _jsx(LoginForm, {})] }));
    }
    return {
        middleware: [loginMiddleware],
        action,
        default: LoginPage,
    };
}
