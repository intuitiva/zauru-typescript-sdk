import { jsx as _jsx } from "react/jsx-runtime";
import { useZauruClientErrorReporting } from "../observability/useZauruClientErrorReporting.js";
export const BodyContainer = (props) => {
    const { children, appVersion, reportClientErrors = true } = props;
    useZauruClientErrorReporting({
        appVersion,
        enabled: reportClientErrors,
    });
    return _jsx("body", { className: "flex flex-col min-h-screen m-0", children: children });
};
