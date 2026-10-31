import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { CheckMatrixCards, } from "./CheckMatrixCards.js";
const visibilityClasses = {
    sm: { mobile: "sm:hidden", desktop: "hidden sm:block" },
    md: { mobile: "md:hidden", desktop: "hidden md:block" },
    lg: { mobile: "lg:hidden", desktop: "hidden lg:block" },
};
export const ResponsiveCheckMatrix = ({ desktop, desktopBreakpoint = "md", ...cardProps }) => {
    const visibility = visibilityClasses[desktopBreakpoint];
    return (_jsxs(_Fragment, { children: [_jsx("div", { className: visibility.mobile, children: _jsx(CheckMatrixCards, { ...cardProps }) }), _jsx("div", { className: visibility.desktop, children: desktop })] }));
};
