"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatLayout = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const index_js_1 = require("../Form/TextField/index.js");
const react_2 = require("@remix-run/react");
const LoadingInputSkeleton_js_1 = require("../Skeletons/LoadingInputSkeleton.js");
const icons_1 = require("@zauru-sdk/icons");
const ChatLayout = ({ children, sendingMessage = false, formConfig = undefined, }) => {
    const refAttachment = (0, react_1.useRef)(null);
    const [formValues, setFormValues] = (0, react_1.useState)({ image: null });
    const handleAttachmentClick = () => {
        if (refAttachment.current) {
            refAttachment.current.click();
        }
    };
    return ((0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col h-full", children: [(0, jsx_runtime_1.jsx)("div", { className: "flex flex-col-reverse overflow-y-auto p-4 bg-gray-100 border border-gray-200 rounded-lg grow max-h-[65vh]", children: children }), (0, jsx_runtime_1.jsxs)(react_2.Form, { id: "formRef", encType: "multipart/form-data", method: "post", children: [formConfig ? ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(index_js_1.TextField, { hidden: true, name: "reference", defaultValue: formConfig.reference ?? "" }), (0, jsx_runtime_1.jsx)(index_js_1.TextField, { hidden: true, name: "form_id", defaultValue: formConfig.form_id }), (0, jsx_runtime_1.jsx)(index_js_1.TextField, { hidden: true, name: "document_id", defaultValue: formConfig.document_id }), (0, jsx_runtime_1.jsx)(index_js_1.TextField, { hidden: true, name: "document_type", defaultValue: formConfig.document_type }), (0, jsx_runtime_1.jsx)(index_js_1.TextField, { hidden: true, name: "id_number", defaultValue: formConfig?.id_number ?? "" })] })) : ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, {})), (0, jsx_runtime_1.jsxs)("div", { className: "mt-4 flex", children: [sendingMessage ? ((0, jsx_runtime_1.jsx)(LoadingInputSkeleton_js_1.LoadingInputSkeleton, {})) : ((0, jsx_runtime_1.jsx)("input", { name: `message${formConfig?.messageFieldId
                                    ? `_${formConfig?.messageFieldId}`
                                    : ""}`, type: "text", placeholder: "Escribe un mensaje...", className: "form-input px-4 py-2 border border-gray-300 rounded-l-lg grow" })), (0, jsx_runtime_1.jsx)("button", { onClick: handleAttachmentClick, className: `${formValues?.image ? "bg-blue-500" : ""} hover:bg-blue-700 text-white font-bold py-2 px-4`, type: "button", children: (0, jsx_runtime_1.jsx)(icons_1.AttachmentIconSVG, {}) }), (0, jsx_runtime_1.jsx)("button", { className: "bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-r-lg", type: "submit", name: "action", value: "sendMessage", children: sendingMessage ? (0, jsx_runtime_1.jsx)(icons_1.SpinnerSvg, {}) : (0, jsx_runtime_1.jsx)(icons_1.SendMessageIcon, {}) })] }), (0, jsx_runtime_1.jsx)("input", { ref: refAttachment, hidden: true, name: `attachment${formConfig?.attachmentFieldId
                            ? `_${formConfig?.attachmentFieldId}`
                            : ""}`, type: "file", accept: ".jpg, .png, .jpeg, .png", onChange: (e) => {
                            if (e.target.value && e.target.value !== "") {
                                setFormValues({ ...formValues, image: e.target.value });
                            }
                            else {
                                setFormValues({ ...formValues, image: null });
                            }
                        } })] })] }));
};
exports.ChatLayout = ChatLayout;
