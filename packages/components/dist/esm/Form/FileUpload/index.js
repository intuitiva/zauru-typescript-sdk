import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { DownloadIconSVG, IdeaIconSVG } from "@zauru-sdk/icons";
import { useState } from "react";
import { useFormContext } from "react-hook-form";
export const FileUploadField = (props) => {
    const { id, name, title, helpText, hint, onChange, disabled = false, readOnly = false, fileTypes = [], showAvailableTypes = false, className, defaultValue = undefined, download = false, required = false, } = props;
    const { register: tempRegister, formState: { errors }, } = useFormContext() || { formState: {} }; // Obtener el contexto solo si existe
    const error = errors ? errors[props.name ?? "-1"] : undefined;
    const register = tempRegister
        ? tempRegister(props.name ?? "-1", { required })
        : undefined; // Solo usar register si está disponible
    const [showTooltip, setShowTooltip] = useState(false);
    if (typeof defaultValue == "string") {
        if (download) {
            return (_jsxs("div", { role: "button", tabIndex: 0, onClick: () => {
                    window.open(defaultValue, "_blank");
                }, onKeyDown: (event) => {
                    // Permite que el evento se active con la tecla Enter
                    if (event.key === "Enter") {
                        window.open(defaultValue, "_blank");
                    }
                }, children: [title && (_jsx("label", { htmlFor: name, className: "block mb-1 text-sm font-medium text-gray-700", children: title })), " ", _jsx(DownloadIconSVG, {})] }));
        }
        return (_jsxs("div", { className: `col-span-6 sm:col-span-3 ${className}`, children: [title && (_jsxs("label", { htmlFor: name, className: `block mb-1 text-sm font-medium text-gray-700`, children: [title, required && _jsx("span", { className: "text-red-500", children: "*" })] })), " ", _jsx("div", { role: "button", tabIndex: 0, onClick: () => {
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
                    }, children: _jsx("img", { src: defaultValue, alt: name, className: `h-48 w-48 inline mr-1 pb-1`, style: {
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
    return (_jsxs("div", { className: `col-span-6 sm:col-span-3 ${className}`, children: [title && (_jsx("label", { htmlFor: name, className: `block mb-1 text-sm font-medium text-${color}-700`, children: title })), _jsxs("div", { className: "flex relative items-center", children: [_jsx("input", { type: "file", name: name, id: id ?? name, disabled: disabled, readOnly: readOnly, accept: fileTypes.map((ft) => `.${ft}`).join(", "), onChange: handleInputChange, className: `block w-full rounded-md ${bgColor} ${borderColor} ${textColor} shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm` }), helpText && (_jsx("div", { className: "flex items-center relative ml-3", children: _jsxs("div", { className: "relative cursor-pointer", onMouseEnter: () => setShowTooltip(true), onMouseLeave: () => setShowTooltip(false), children: [_jsx(IdeaIconSVG, {}), showTooltip && (_jsx("div", { className: "absolute -left-48 top-0 mt-8 p-2 bg-white border rounded shadow text-black z-50", children: helpText }))] }) }))] }), error && (_jsxs("p", { className: `mt-2 text-sm text-${color}-600`, children: [_jsx("span", { className: "font-medium", children: "Oops!" }), " ", error.message?.toString()] })), !error && hintMessage && (_jsx("p", { className: `mt-2 italic text-sm text-${color}-500`, children: hintMessage }))] }));
};
