"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MainContainer = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const MainContainer = (props) => {
    const { children } = props;
    return ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: (0, jsx_runtime_1.jsx)("div", { className: "md:p-10 p-0 mt-10 ml-2 mr-2 mb-10 md:mt-0 md:ml-0 md:mr-0 md:mb-0", children: children }) }));
};
exports.MainContainer = MainContainer;
