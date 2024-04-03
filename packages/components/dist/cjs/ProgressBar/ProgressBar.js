"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProgressBar = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const ProgressBar = (props) => {
    const { title, percent } = props;
    return ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: percent && ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [title && (0, jsx_runtime_1.jsx)("div", { className: "mb-1 text-lg font-medium", children: title }), (0, jsx_runtime_1.jsx)("div", { className: "w-full h-6 bg-gray-200 rounded-full", children: (0, jsx_runtime_1.jsx)("div", { className: "h-6 bg-blue-600 rounded-full", style: { width: `${percent}%` } }) })] })) }));
};
exports.ProgressBar = ProgressBar;
