"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LabelArray = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
//Component to show all information in an array
const LabelArray = ({ info }) => {
    return ((0, jsx_runtime_1.jsx)("div", { className: "divide-y divide-gray-100", children: info?.map((x) => {
            return ((0, jsx_runtime_1.jsxs)("div", { className: "my-1 pt-2", children: [(0, jsx_runtime_1.jsxs)("p", { className: "inline font-bold text-lg", children: [x?.label, ": "] }), (0, jsx_runtime_1.jsx)("p", { className: "inline text-lg", children: x?.value })] }, x?.label));
        }) }));
};
exports.LabelArray = LabelArray;
