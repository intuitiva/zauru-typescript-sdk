"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WithTooltip = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const WithTooltip = (props) => {
    const { children, text } = props;
    return ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: (0, jsx_runtime_1.jsxs)("span", { className: "group relative", children: [children, (0, jsx_runtime_1.jsx)("span", { className: "pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-black px-2 py-1 text-white opacity-0 transition z-50 before:absolute before:left-1/2 before:top-full before:-translate-x-1/2 before:border-4 before:border-transparent before:border-t-black before:content-[''] group-hover:opacity-100 before:z-50", children: text })] }) }));
};
exports.WithTooltip = WithTooltip;
