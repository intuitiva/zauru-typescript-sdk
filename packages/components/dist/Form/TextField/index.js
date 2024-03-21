import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { IdeaIconSVG } from "@zauru-sdk/icons";
import { useAppSelector } from "@zauru-sdk/redux";
import { useEffect, useState } from "react";
export const TextFieldWithoutValidation = (props) => {
    const { id, name, defaultValue = "", hidden, type = "text", onChange, onKeyDown, disabled = false, readOnly = false, min, integer = false, stopChangeEvents, style, error, title, helpText, className, hint, } = props;
    const [showTooltip, setShowTooltip] = useState(false);
    const [value, setValue] = useState(defaultValue);
    const color = error ? "red" : "gray";
    const isReadOnly = disabled || readOnly;
    const bgColor = isReadOnly ? "bg-gray-200" : `bg-${color}-50`;
    const textColor = isReadOnly ? "text-gray-500" : `text-${color}-900`;
    const borderColor = isReadOnly ? "border-gray-300" : `border-${color}-500`;
    useEffect(() => {
        setValue(defaultValue);
    }, [defaultValue]);
    if (hidden) {
        return (_jsx("input", { type: type, id: id ?? name, name: name, value: defaultValue, readOnly: true, hidden: true }));
    }
    const handleInputChange = (event) => {
        if (stopChangeEvents) {
            event.stopPropagation();
            event.preventDefault();
        }
        if (integer && type === "number") {
            const value = event.target.value;
            const isInteger = /^[0-9]*$/.test(value);
            if (isInteger || value === "") {
                setValue(value);
                onChange && onChange(value, event);
            }
        }
        else {
            setValue(event.target.value);
            onChange && onChange(event.target.value, event);
        }
    };
    const handleKeyDown = (event) => {
        if (integer && type === "number") {
            // Permitir solo números y teclas de control
            const allowedKeys = [
                "Backspace",
                "ArrowLeft",
                "ArrowRight",
                "Delete",
                "Enter",
                "Tab",
            ];
            if (!allowedKeys.includes(event.key) && !/^[0-9]$/.test(event.key)) {
                event.preventDefault();
            }
        }
    };
    const inputComponent = (_jsx("input", { type: type, name: name, readOnly: readOnly, disabled: disabled, id: id ?? name, autoComplete: "given-name", value: value, onWheel: (e) => {
            e.currentTarget.blur();
        }, step: type === "number" ? 0.01 : undefined, onChange: handleInputChange, onKeyDown: (event) => {
            handleKeyDown(event);
            onKeyDown && onKeyDown(event);
        }, min: min, style: style, className: `block w-full rounded-md ${bgColor} ${borderColor} ${textColor} shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm` }));
    if (!error && !title) {
        return _jsx("div", { className: `${className}`, children: inputComponent });
    }
    return (_jsxs("div", { className: `col-span-6 sm:col-span-3 ${className}`, children: [title && (_jsx("label", { htmlFor: error ? `${name}-error` : `${name}-success`, className: `block mb-1 text-sm font-medium text-${color}-700 dark:text-${color}-500`, children: title })), _jsxs("div", { className: "flex relative items-center", children: [inputComponent, helpText && (_jsx("div", { className: "flex items-center relative ml-3", children: _jsxs("div", { className: "relative cursor-pointer", onMouseEnter: () => setShowTooltip(true), onMouseLeave: () => setShowTooltip(false), children: [_jsx(IdeaIconSVG, {}), showTooltip && (_jsx("div", { className: "absolute -left-48 top-0 mt-8 p-2 bg-white border rounded shadow text-black z-50", children: helpText }))] }) }))] }), error && (_jsxs("p", { className: `mt-2 text-sm text-${color}-600 dark:text-${color}-500`, children: [_jsx("span", { className: "font-medium", children: "Oops!" }), " ", error] })), !error && hint && (_jsx("p", { className: `mt-2 italic text-sm text-${color}-500 dark:text-${color}-400`, children: hint }))] }));
};
export const TextField = (props) => {
    const { formValidations } = useAppSelector((state) => state.formValidation);
    const error = formValidations[props.formName ?? "-1"]?.[props.name ?? "-1"];
    props = { ...props, error };
    return _jsx(TextFieldWithoutValidation, { ...props });
};
