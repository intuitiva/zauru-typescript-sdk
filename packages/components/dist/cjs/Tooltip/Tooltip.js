"use strict";
"use client";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tooltip = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const Tooltip = ({ children, text }) => {
    const [show, setShow] = (0, react_1.useState)(false);
    return ((0, jsx_runtime_1.jsxs)("div", { className: "relative inline-block", children: [(0, jsx_runtime_1.jsx)("div", { onMouseEnter: () => setShow(true), onMouseLeave: () => setShow(false), children: children }), show && ((0, jsx_runtime_1.jsxs)("div", { className: "absolute z-10 bg-gray-700 text-white px-2 py-1 rounded-md bottom-full left-1/2 transform -translate-x-1/2", style: { whiteSpace: "nowrap", height: "2rem" }, children: [text, (0, jsx_runtime_1.jsx)("div", { className: "absolute top-full left-1/2 transform -translate-x-1/2", style: {
                            width: "0",
                            height: "0",
                            borderTop: "6px solid transparent",
                            borderLeft: "6px solid transparent",
                            borderRight: "6px solid transparent",
                            borderBottom: "6px solid gray",
                        } })] }))] }));
};
exports.Tooltip = Tooltip;
