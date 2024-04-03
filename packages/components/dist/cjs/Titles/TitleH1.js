"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TitleH1 = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
//H1 Title Component
const TitleH1 = ({ texto }) => {
    return ((0, jsx_runtime_1.jsx)("div", { className: "mb-1", children: (0, jsx_runtime_1.jsx)("h1", { className: "text-4xl font-bold leading-normal mt-0 mb-2 text-zinc-800", children: texto }) }));
};
exports.TitleH1 = TitleH1;
