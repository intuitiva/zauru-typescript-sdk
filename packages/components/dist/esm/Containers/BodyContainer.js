import { jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
export const BodyContainer = (props) => {
    const { children } = props;
    return (_jsx(_Fragment, { children: _jsx("body", { className: "flex flex-col min-h-screen m-0", children: children }) }));
};
