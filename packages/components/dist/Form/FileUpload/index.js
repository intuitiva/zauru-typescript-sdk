import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { DownloadIconSVG, IdeaIconSVG } from "@zauru-sdk/icons";
import { useAppSelector } from "@zauru-sdk/redux";
import { useState } from "react";
export const FileUploadFieldWithoutValidation = (props) => {
    const { id, name, title, helpText, hint, onChange, disabled = false, readOnly = false, error, fileTypes = [], showAvailableTypes = false, className, defaultValue = undefined, download = false, } = props;
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
        return (_jsxs("div", { className: `col-span-6 sm:col-span-3 ${className}`, children: [title && (_jsx("label", { htmlFor: name, className: `block mb-1 text-sm font-medium text-gray-700`, children: title })), " ", _jsx("div", { role: "button", tabIndex: 0, onClick: () => {
                        window.open(defaultValue, "_blank");
                    }, onKeyDown: (event) => {
                        // Permite que el evento se active con la tecla Enter
                        if (event.key === "Enter") {
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
    return (_jsxs("div", { className: `col-span-6 sm:col-span-3 ${className}`, children: [title && (_jsx("label", { htmlFor: name, className: `block mb-1 text-sm font-medium text-${color}-700`, children: title })), _jsxs("div", { className: "flex relative items-center", children: [_jsx("input", { type: "file", name: name, id: id ?? name, disabled: disabled, readOnly: readOnly, accept: fileTypes.map((ft) => `.${ft}`).join(", "), onChange: handleInputChange, className: `block w-full rounded-md ${bgColor} ${borderColor} ${textColor} shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm` }), helpText && (_jsx("div", { className: "flex items-center relative ml-3", children: _jsxs("div", { className: "relative cursor-pointer", onMouseEnter: () => setShowTooltip(true), onMouseLeave: () => setShowTooltip(false), children: [_jsx(IdeaIconSVG, {}), showTooltip && (_jsx("div", { className: "absolute -left-48 top-0 mt-8 p-2 bg-white border rounded shadow text-black z-50", children: helpText }))] }) }))] }), error && (_jsxs("p", { className: `mt-2 text-sm text-${color}-600`, children: [_jsx("span", { className: "font-medium", children: "Oops!" }), " ", error] })), !error && hintMessage && (_jsx("p", { className: `mt-2 italic text-sm text-${color}-500`, children: hintMessage }))] }));
};
export const FileUploadField = (props) => {
    const { formValidations } = useAppSelector((state) => state.formValidation);
    const error = formValidations[props.formName ?? "-1"]?.[props.name ?? "-1"];
    props = { ...props, error };
    return _jsx(FileUploadFieldWithoutValidation, { ...props });
};
