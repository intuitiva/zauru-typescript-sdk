import { jsx as _jsx } from "react/jsx-runtime";
export const OutletContainer = (props) => {
    const { children } = props;
    return (_jsx("div", { className: "min-w-0 flex-1 overflow-x-auto", suppressHydrationWarning: true, children: children }));
};
