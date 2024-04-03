"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ButtonSectionContainer = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const ButtonSectionContainer = (props) => {
    const { children, className, whitBg = true } = props;
    return ((0, jsx_runtime_1.jsx)("div", { className: `${whitBg ? "bg-gray-50" : ""} px-4 py-3 text-right sm:px-6 ${className}`, children: children }));
};
exports.ButtonSectionContainer = ButtonSectionContainer;
