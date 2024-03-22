import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { useRef, useState } from "react";
import { TextField } from "../Form";
import { Form } from "@remix-run/react";
import { LoadingInputSkeleton } from "./../index";
import { AttachmentIconSVG, SendMessageIcon, SpinnerSvg, } from "@zauru-sdk/icons";
const ChatLayout = ({ children, sendingMessage = false, formConfig = undefined, }) => {
    const refAttachment = useRef(null);
    const [formValues, setFormValues] = useState({ image: null });
    const handleAttachmentClick = () => {
        if (refAttachment.current) {
            refAttachment.current.click();
        }
    };
    return (_jsxs("div", { className: "flex flex-col h-full", children: [_jsx("div", { className: "flex flex-col-reverse overflow-y-auto p-4 bg-gray-100 border border-gray-200 rounded-lg grow max-h-[65vh]", children: children }), _jsxs(Form, { id: "formRef", encType: "multipart/form-data", method: "post", children: [formConfig ? (_jsxs(_Fragment, { children: [_jsx(TextField, { hidden: true, name: "reference", defaultValue: formConfig.reference ?? "" }), _jsx(TextField, { hidden: true, name: "form_id", defaultValue: formConfig.form_id }), _jsx(TextField, { hidden: true, name: "document_id", defaultValue: formConfig.document_id }), _jsx(TextField, { hidden: true, name: "document_type", defaultValue: formConfig.document_type }), _jsx(TextField, { hidden: true, name: "id_number", defaultValue: formConfig?.id_number ?? "" })] })) : (_jsx(_Fragment, {})), _jsxs("div", { className: "mt-4 flex", children: [sendingMessage ? (_jsx(LoadingInputSkeleton, {})) : (_jsx("input", { name: `message${formConfig?.messageFieldId
                                    ? `_${formConfig?.messageFieldId}`
                                    : ""}`, type: "text", placeholder: "Escribe un mensaje...", className: "form-input px-4 py-2 border border-gray-300 rounded-l-lg grow" })), _jsx("button", { onClick: handleAttachmentClick, className: `${formValues?.image ? "bg-blue-500" : ""} hover:bg-blue-700 text-white font-bold py-2 px-4`, type: "button", children: _jsx(AttachmentIconSVG, {}) }), _jsx("button", { className: "bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-r-lg", type: "submit", name: "action", value: "sendMessage", children: sendingMessage ? _jsx(SpinnerSvg, {}) : _jsx(SendMessageIcon, {}) })] }), _jsx("input", { ref: refAttachment, hidden: true, name: `attachment${formConfig?.attachmentFieldId
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
export default ChatLayout;
