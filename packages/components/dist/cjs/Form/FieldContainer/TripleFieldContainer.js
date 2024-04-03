"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TripleFieldContainer = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const TripleFieldContainer = (props) => {
    const { children, className } = props;
    const getChildren = (index) => {
        if (children && Array.isArray(children) && children[index]) {
            return children[index];
        }
        if (children && index === 0) {
            return children;
        }
        return (0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, {});
    };
    return ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: (0, jsx_runtime_1.jsxs)("div", { className: `grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ${className}`, style: { alignItems: "center" }, children: [(0, jsx_runtime_1.jsx)("div", { className: "col-span-1", children: getChildren(0) }), (0, jsx_runtime_1.jsx)("div", { className: "col-span-1", children: getChildren(1) }), (0, jsx_runtime_1.jsx)("div", { className: "col-span-1", children: getChildren(2) })] }) }));
};
exports.TripleFieldContainer = TripleFieldContainer;
