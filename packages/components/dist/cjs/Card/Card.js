"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Card = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const Card = (props) => {
    const { children, title, className } = props;
    return ((0, jsx_runtime_1.jsxs)("div", { className: `p-4 space-y-3 shadow sm:overflow-hidden sm:rounded-md ${className}`, children: [title && ((0, jsx_runtime_1.jsx)("label", { className: "inline text-lg font-medium text-gray-700", children: `${title.toUpperCase()}` })), children] }));
};
exports.Card = Card;
