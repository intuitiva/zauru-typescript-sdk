import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { IdeaIconSVG } from "@zauru-sdk/icons";
import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
export const TextField = (props) => {
    const { id, name, defaultValue = "", hidden, type = "text", onChange, onKeyDown, disabled = false, readOnly = false, min, integer = false, stopChangeEvents, style, title, helpText, className = "", hint, required, } = props;
    const [showTooltip, setShowTooltip] = useState(false);
    const [value, setValue] = useState(defaultValue);
    const { register: tempRegister, formState: { errors }, setValue: setOnFormValue, } = useFormContext() || { formState: {} }; // Obtener el contexto solo si existe
    const error = errors ? errors[props.name ?? "-1"] : undefined;
    const register = tempRegister
        ? tempRegister(props.name ?? "-1", {
            valueAsNumber: props.type === "number",
            required,
        })
        : undefined; // Solo usar register si está disponible
    const color = error ? "red" : "gray";
    const isReadOnly = disabled || readOnly;
    const bgColor = isReadOnly ? "bg-gray-200" : `bg-${color}-50`;
    const textColor = isReadOnly ? "text-gray-500" : `text-${color}-900`;
    const borderColor = isReadOnly ? "border-gray-300" : `border-${color}-200`;
    useEffect(() => {
        if (setOnFormValue) {
            setOnFormValue(name ?? "-1", defaultValue);
        }
        setValue(defaultValue);
    }, [defaultValue]);
    const handleInputChange = (event) => {
        const newValue = event.target.value;
        if (register) {
            register.onChange(event);
        }
        if (stopChangeEvents) {
            event.stopPropagation();
            event.preventDefault();
        }
        setValue(newValue);
        onChange && onChange(newValue, event);
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
    if (hidden) {
        return (_jsx("input", { type: type, id: id ?? name, value: value, hidden: true, ...(register ?? {}), name: name, onChange: handleInputChange }));
    }
    const inputComponent = (_jsx("input", { type: type, readOnly: isReadOnly, disabled: disabled, id: id ?? name, autoComplete: "off", value: value, onWheel: (e) => {
            e.currentTarget.blur();
        }, step: type === "number" ? 0.01 : undefined, onKeyDown: (event) => {
            handleKeyDown(event);
            onKeyDown && onKeyDown(event);
        }, min: min, style: style, className: `block w-full rounded-md ${bgColor} ${borderColor} ${textColor} shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm`, ...(register ?? {}), name: name, onChange: handleInputChange }));
    if (!error && !title) {
        return _jsx("div", { className: `${className}`, children: inputComponent });
    }
    return (_jsxs("div", { className: `col-span-6 sm:col-span-3 ${className}`, children: [title && (_jsxs("label", { htmlFor: error ? `${name}-error` : `${name}-success`, className: `block mb-1 text-sm font-medium text-${color}-700 dark:text-${color}-500`, children: [title, required && _jsx("span", { className: "text-red-500", children: "*" })] })), _jsxs("div", { className: "flex relative items-center", children: [inputComponent, helpText && (_jsx("div", { className: "flex items-center relative ml-3", children: _jsxs("div", { className: "relative cursor-pointer", onMouseEnter: () => setShowTooltip(true), onMouseLeave: () => setShowTooltip(false), children: [_jsx(IdeaIconSVG, {}), showTooltip && (_jsx("div", { className: "absolute -left-48 top-0 mt-8 p-2 bg-white border rounded shadow text-black z-50", children: helpText }))] }) }))] }), error && (_jsxs("p", { className: `mt-2 text-sm text-${color}-600 dark:text-${color}-500`, children: [_jsx("span", { className: "font-medium", children: "Oops!" }), " ", error.message?.toString()] })), !error && hint && (_jsx("p", { className: `mt-2 italic text-sm text-${color}-500 dark:text-${color}-400`, children: hint }))] }));
};
