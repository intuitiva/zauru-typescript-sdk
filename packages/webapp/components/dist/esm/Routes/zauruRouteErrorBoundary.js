import { jsx as _jsx } from "react/jsx-runtime";
import { ErrorLayout } from "../Layouts/errorLayout/index.js";
export function zauruRouteErrorBoundary(from) {
    function ZauruRouteErrorBoundary() {
        return _jsx(ErrorLayout, { from: from });
    }
    ZauruRouteErrorBoundary.displayName = `ZauruRouteErrorBoundary(${from})`;
    return ZauruRouteErrorBoundary;
}
