"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DoubleFieldContainer = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const DoubleFieldContainer = (props) => {
    const { children, className, alignCenter = true } = props;
    const getChildren = (index) => {
        if (children && Array.isArray(children) && children[index]) {
            return children[index];
        }
        if (children && index === 0) {
            return children;
        }
        return (0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, {});
    };
    return ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: (0, jsx_runtime_1.jsxs)("div", { className: `grid md:grid-cols-2 sm:grid-cols-1 gap-4 ${className}`, style: alignCenter ? { alignItems: "center" } : {}, children: [(0, jsx_runtime_1.jsx)("div", { className: "col-span-1", children: getChildren(0) }), (0, jsx_runtime_1.jsx)("div", { className: "col-span-1", children: getChildren(1) })] }) }));
};
exports.DoubleFieldContainer = DoubleFieldContainer;
