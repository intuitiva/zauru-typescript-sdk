"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubContainer = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const SubContainer = (props) => {
    const { title, description, children, className = "", rightContent } = props;
    const titleInfo = ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [title && ((0, jsx_runtime_1.jsx)("h3", { className: "text-xl font-bold leading-8 text-gray-900", children: title })), description && ((0, jsx_runtime_1.jsx)("p", { className: "mt-1 text-md text-gray-600", children: description }))] }));
    return ((0, jsx_runtime_1.jsxs)("div", { className: `${className}`, children: [rightContent && ((0, jsx_runtime_1.jsxs)("div", { className: "flex justify-between items-center", children: [(0, jsx_runtime_1.jsx)("div", { children: titleInfo }), (0, jsx_runtime_1.jsx)("div", { children: rightContent })] })), !rightContent && titleInfo, (0, jsx_runtime_1.jsx)("div", { className: "mt-5 space-y-3", children: children })] }));
};
exports.SubContainer = SubContainer;
