"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TitleH3 = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
//H3 Title Component
const TitleH3 = ({ texto }) => {
    return ((0, jsx_runtime_1.jsx)("div", { className: "py-1 ", children: (0, jsx_runtime_1.jsx)("h3", { className: "text-xl leading-normal mt-0 mb-2 text-zinc-800", children: texto }) }));
};
exports.TitleH3 = TitleH3;
