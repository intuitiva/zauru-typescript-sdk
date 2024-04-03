import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export const Card = (props) => {
    const { children, title, className } = props;
    return (_jsxs("div", { className: `p-4 space-y-3 shadow sm:overflow-hidden sm:rounded-md ${className}`, children: [title && (_jsx("label", { className: "inline text-lg font-medium text-gray-700", children: `${title.toUpperCase()}` })), children] }));
};
