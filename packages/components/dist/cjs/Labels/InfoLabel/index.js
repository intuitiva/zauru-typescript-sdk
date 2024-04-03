"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InfoLabel = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const InfoLabel = (props) => {
    const { description, title, className } = props;
    return ((0, jsx_runtime_1.jsxs)("div", { className: `block ${className}`, children: [(0, jsx_runtime_1.jsx)("label", { className: "inline text-sm font-medium text-gray-700", children: `${title.toUpperCase()} ` }), (0, jsx_runtime_1.jsx)("label", { className: "inline text-sm font-medium text-gray-500", children: description })] }));
};
exports.InfoLabel = InfoLabel;
