import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Form } from "@remix-run/react";
import { ButtonSectionContainer } from "../../Containers/index.js";
export const FormLayout = (props) => {
    const { title, children, buttons, method, formId } = props;
    return (_jsxs(Form, { id: formId, name: formId, method: method ?? "post", children: [title && (_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-3", children: title })), _jsxs("div", { className: "shadow sm:overflow-hidden sm:rounded-md", children: [_jsx("div", { className: "space-y-6 bg-white px-4 py-5 sm:p-6", children: children }), buttons && (_jsx(ButtonSectionContainer, { children: buttons }))] })] }, formId));
};
