"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileUploadField = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const icons_1 = require("@zauru-sdk/icons");
const react_1 = require("react");
const react_hook_form_1 = require("react-hook-form");
const FileUploadField = (props) => {
    const { id, name, title, helpText, hint, onChange, disabled = false, readOnly = false, fileTypes = [], showAvailableTypes = false, className, defaultValue = undefined, download = false, required = false, } = props;
    const { register: tempRegister, formState: { errors }, } = (0, react_hook_form_1.useFormContext)() || { formState: {} }; // Obtener el contexto solo si existe
    const error = errors ? errors[props.name ?? "-1"] : undefined;
    const register = tempRegister
        ? tempRegister(props.name ?? "-1", { required })
        : undefined; // Solo usar register si está disponible
    const [showTooltip, setShowTooltip] = (0, react_1.useState)(false);
    if (typeof defaultValue == "string") {
        if (download) {
            return ((0, jsx_runtime_1.jsxs)("div", { role: "button", tabIndex: 0, onClick: () => {
                    window.open(defaultValue, "_blank");
                }, onKeyDown: (event) => {
                    // Permite que el evento se active con la tecla Enter
                    if (event.key === "Enter") {
                        window.open(defaultValue, "_blank");
                    }
                }, children: [title && ((0, jsx_runtime_1.jsx)("label", { htmlFor: name, className: "block mb-1 text-sm font-medium text-gray-700", children: title })), " ", (0, jsx_runtime_1.jsx)(icons_1.DownloadIconSVG, {})] }));
        }
        return ((0, jsx_runtime_1.jsxs)("div", { className: `col-span-6 sm:col-span-3 ${className}`, children: [title && ((0, jsx_runtime_1.jsxs)("label", { htmlFor: name, className: `block mb-1 text-sm font-medium text-gray-700`, children: [title, required && (0, jsx_runtime_1.jsx)("span", { className: "text-red-500", children: "*" })] })), " ", (0, jsx_runtime_1.jsx)("div", { role: "button", tabIndex: 0, onClick: () => {
                        if (register) {
                            register.onChange({
                                target: {
                                    value: defaultValue,
                                },
                            });
                        }
                        window.open(defaultValue, "_blank");
                    }, onKeyDown: (event) => {
                        // Permite que el evento se active con la tecla Enter
                        if (event.key === "Enter") {
                            if (register) {
                                register.onChange({
                                    target: {
                                        value: defaultValue,
                                    },
                                });
                            }
                            window.open(defaultValue, "_blank");
                        }
                    }, children: (0, jsx_runtime_1.jsx)("img", { src: defaultValue, alt: name, className: `h-48 w-48 inline mr-1 pb-1`, style: {
                            stroke: "currentColor",
                            strokeWidth: 2,
                            strokeLinecap: "round",
                            strokeLinejoin: "round",
                            fill: "none",
                            backgroundColor: "transparent",
                        } }) })] }));
    }
    const handleInputChange = (event) => {
        onChange && onChange(event);
    };
    let hintMessage = hint;
    if (showAvailableTypes && fileTypes.length > 0) {
        hintMessage = `${hint} Archivos permitidos: ${fileTypes.join(", ")}`;
    }
    const color = error ? "red" : "gray";
    const isReadOnly = disabled || readOnly;
    const bgColor = isReadOnly ? "bg-gray-200" : `bg-${color}-50`;
    const textColor = isReadOnly ? "text-gray-500" : `text-${color}-900`;
    const borderColor = isReadOnly ? "border-gray-300" : `border-${color}-500`;
    return ((0, jsx_runtime_1.jsxs)("div", { className: `col-span-6 sm:col-span-3 ${className}`, children: [title && ((0, jsx_runtime_1.jsx)("label", { htmlFor: name, className: `block mb-1 text-sm font-medium text-${color}-700`, children: title })), (0, jsx_runtime_1.jsxs)("div", { className: "flex relative items-center", children: [(0, jsx_runtime_1.jsx)("input", { type: "file", name: name, id: id ?? name, disabled: disabled, readOnly: readOnly, accept: fileTypes.map((ft) => `.${ft}`).join(", "), onChange: handleInputChange, className: `block w-full rounded-md ${bgColor} ${borderColor} ${textColor} shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm` }), helpText && ((0, jsx_runtime_1.jsx)("div", { className: "flex items-center relative ml-3", children: (0, jsx_runtime_1.jsxs)("div", { className: "relative cursor-pointer", onMouseEnter: () => setShowTooltip(true), onMouseLeave: () => setShowTooltip(false), children: [(0, jsx_runtime_1.jsx)(icons_1.IdeaIconSVG, {}), showTooltip && ((0, jsx_runtime_1.jsx)("div", { className: "absolute -left-48 top-0 mt-8 p-2 bg-white border rounded shadow text-black z-50", children: helpText }))] }) }))] }), error && ((0, jsx_runtime_1.jsxs)("p", { className: `mt-2 text-sm text-${color}-600`, children: [(0, jsx_runtime_1.jsx)("span", { className: "font-medium", children: "Oops!" }), " ", error.message?.toString()] })), !error && hintMessage && ((0, jsx_runtime_1.jsx)("p", { className: `mt-2 italic text-sm text-${color}-500`, children: hintMessage }))] }));
};
exports.FileUploadField = FileUploadField;
