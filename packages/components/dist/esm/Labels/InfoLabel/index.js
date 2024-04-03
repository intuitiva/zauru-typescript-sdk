import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export const InfoLabel = (props) => {
    const { description, title, className } = props;
    return (_jsxs("div", { className: `block ${className}`, children: [_jsx("label", { className: "inline text-sm font-medium text-gray-700", children: `${title.toUpperCase()} ` }), _jsx("label", { className: "inline text-sm font-medium text-gray-500", children: description })] }));
};
