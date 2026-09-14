import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export const WithTooltip = (props) => {
    const { children, text } = props;
    return (_jsxs("div", { className: "group relative inline-block", children: [children, _jsx("div", { className: "pointer-events-none absolute left-1/2 -translate-x-1/2 bottom-full mb-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100", children: _jsxs("div", { className: "relative bg-black text-white text-sm rounded py-1 px-2 text-wrap w-40", children: [text, _jsx("div", { className: "absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-black" })] }) })] }));
};
