"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TitleH2 = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
//H2 Title Component
const TitleH2 = ({ texto }) => {
    return ((0, jsx_runtime_1.jsx)("div", { className: "py-1 ", children: (0, jsx_runtime_1.jsx)("h2", { className: "text-2xl font-bold leading-normal mt-0 mb-2 text-zinc-800", children: texto }) }));
};
exports.TitleH2 = TitleH2;
