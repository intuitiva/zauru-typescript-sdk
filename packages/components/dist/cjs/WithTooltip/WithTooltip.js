"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WithTooltip = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const WithTooltip = (props) => {
    const { children, text } = props;
    return ((0, jsx_runtime_1.jsxs)("div", { className: "group relative inline-block", children: [children, (0, jsx_runtime_1.jsx)("div", { className: "pointer-events-none absolute left-1/2 -translate-x-1/2 bottom-full mb-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100", children: (0, jsx_runtime_1.jsxs)("div", { className: "relative bg-black text-white text-sm rounded py-1 px-2 text-wrap w-40", children: [text, (0, jsx_runtime_1.jsx)("div", { className: "absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-black" })] }) })] }));
};
exports.WithTooltip = WithTooltip;
