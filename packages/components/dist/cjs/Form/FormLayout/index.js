"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FormLayout = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("@remix-run/react");
const index_js_1 = require("../../Containers/index.js");
const FormLayout = (props) => {
    const { title, children, buttons, method, formId } = props;
    return ((0, jsx_runtime_1.jsxs)(react_1.Form, { id: formId, name: formId, method: method ?? "post", children: [title && ((0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-gray-700 mb-3", children: title })), (0, jsx_runtime_1.jsxs)("div", { className: "shadow sm:overflow-hidden sm:rounded-md", children: [(0, jsx_runtime_1.jsx)("div", { className: "space-y-6 bg-white px-4 py-5 sm:p-6", children: children }), buttons && ((0, jsx_runtime_1.jsx)(index_js_1.ButtonSectionContainer, { children: buttons }))] })] }, formId));
};
exports.FormLayout = FormLayout;
