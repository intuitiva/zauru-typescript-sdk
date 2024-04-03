"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DoubleContainer = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const DoubleContainer = (props) => {
    const { title, description, className = "", children } = props;
    const getChildren = (index) => {
        if (children && Array.isArray(children) && children[index]) {
            return children[index];
        }
        if (children && index === 0) {
            return children;
        }
        return (0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, {});
    };
    return ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: (0, jsx_runtime_1.jsxs)("div", { className: `mx-2 ${className}`, children: [title && ((0, jsx_runtime_1.jsx)("h3", { className: "text-3xl font-bold leading-8 text-gray-900", children: title })), description && ((0, jsx_runtime_1.jsx)("p", { className: "mt-1 text-md text-gray-600", children: description })), (0, jsx_runtime_1.jsxs)("div", { className: "grid xl:grid-cols-3 md:grid-cols-1 gap-4", children: [(0, jsx_runtime_1.jsx)("div", { className: "xl:col-span-2 md:col-span-1 mt-5", children: getChildren(0) }), (0, jsx_runtime_1.jsx)("div", { className: "xl:col-span-1 md:col-span-1 mt-5", children: getChildren(1) })] })] }) }));
};
exports.DoubleContainer = DoubleContainer;
