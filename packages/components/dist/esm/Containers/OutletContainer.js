import { jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
export const OutletContainer = (props) => {
    const { children } = props;
    return (_jsx(_Fragment, { children: _jsx("div", { className: "flex-1 overflow-x-auto", children: children }) }));
};
