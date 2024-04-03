"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BodyContainer = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const BodyContainer = (props) => {
    const { children } = props;
    return ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: (0, jsx_runtime_1.jsx)("body", { className: "flex flex-col min-h-screen m-0", children: children }) }));
};
exports.BodyContainer = BodyContainer;
