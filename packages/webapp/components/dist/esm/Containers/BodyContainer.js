import { jsx as _jsx } from "react/jsx-runtime";
export const BodyContainer = (props) => {
    const { children } = props;
    return _jsx("body", { className: "flex flex-col min-h-screen m-0", children: children });
};
