"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OutletContainer = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const OutletContainer = (props) => {
    const { children } = props;
    return ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: (0, jsx_runtime_1.jsx)("div", { className: "flex-1 overflow-x-auto", children: children }) }));
};
exports.OutletContainer = OutletContainer;
