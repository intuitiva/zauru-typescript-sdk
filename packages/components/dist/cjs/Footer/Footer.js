"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Footer = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const index_js_1 = require("./../ConnectionState/index.js");
const COLORS = {
    purple: "bg-purple-500",
    pink: "bg-pink-500",
    indigo: "bg-indigo-500",
    cyan: "bg-cyan-500",
    slate: "bg-slate-500",
    green: "bg-green-500",
    red: "bg-red-500",
    sky: "bg-sky-500",
};
const Footer = ({ href, selectedColor, showConnection = false, }) => {
    const color = COLORS[selectedColor];
    return ((0, jsx_runtime_1.jsx)("footer", { className: `inset-x-0 bottom-0 px-2 py-[20px] ${color}`, children: (0, jsx_runtime_1.jsxs)("div", { className: "px-4 mx-auto flex flex-wrap items-center justify-center", children: [(0, jsx_runtime_1.jsxs)("p", { className: "text-white text-[1.2rem]", children: [`Creado en `, " ", (0, jsx_runtime_1.jsx)("a", { href: href, children: "Zauru" }), " ", `con ❤️ ${new Date().getFullYear()} v.2.0.0`] }), showConnection && ((0, jsx_runtime_1.jsx)("div", { className: "ml-5", children: (0, jsx_runtime_1.jsx)(index_js_1.ConnectionState, {}) }))] }) }));
};
exports.Footer = Footer;
