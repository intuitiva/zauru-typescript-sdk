import { jsx as _jsx } from "react/jsx-runtime";
export const OutletContainer = (props) => {
    const { children } = props;
    return (_jsx("div", { className: "flex-1 overflow-x-auto", suppressHydrationWarning: true, children: children }));
};
