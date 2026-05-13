import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
export const TextArea = (props) => {
    const { id, name, title, defaultValue = "", hidden, hint, onChange, onKeyDown, disabled = false, readOnly = false, rows, cols, stopChangeEvents, className = "", required, } = props;
    const [value, setValue] = useState(defaultValue);
    const { register: tempRegister, formState: { errors }, } = useFormContext() || { formState: {} }; // Obtener el contexto solo si existe
    const error = errors ? errors[props.name ?? "-1"] : undefined;
    const register = tempRegister
        ? tempRegister(props.name ?? "-1", { required })
        : undefined; // Solo usar register si está disponible
    const color = error ? "red" : "gray";
    const isReadOnly = disabled || readOnly;
    const bgColor = isReadOnly ? "bg-gray-200" : `bg-${color}-50`;
    const textColor = isReadOnly ? "text-gray-500" : `text-${color}-900`;
    const borderColor = isReadOnly ? "border-gray-300" : `border-${color}-500`;
    useEffect(() => {
        setValue(defaultValue);
    }, [defaultValue]);
    if (hidden) {
        return (_jsx("textarea", { id: id ?? name, value: defaultValue, readOnly: true, hidden: true, ...(register ?? {}), name: name }));
    }
    const handleInputChange = (event) => {
        if (register) {
            register.onChange(event);
        }
        if (stopChangeEvents) {
            event.stopPropagation();
            event.preventDefault();
        }
        setValue(event.target.value);
        onChange && onChange(event.target.value);
    };
    return (_jsxs("div", { className: `col-span-6 sm:col-span-3 ${className}`, children: [title && (_jsxs("label", { htmlFor: error ? `${name}-error` : `${name}-success`, className: `block text-sm font-medium text-${color}-700 dark:text-${color}-500`, children: [title, required && _jsx("span", { className: "text-red-500", children: "*" })] })), _jsx("textarea", { readOnly: readOnly, disabled: disabled, id: id ?? name, autoComplete: "given-name", value: value, rows: rows, cols: cols, onKeyDown: (event) => {
                    onKeyDown && onKeyDown(event);
                }, className: `mt-1 block w-full rounded-md ${bgColor} ${borderColor} ${textColor} shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm`, ...(register ?? {}), name: name, onChange: handleInputChange }), error && (_jsxs("p", { className: `mt-2 text-sm text-${color}-600 dark:text-${color}-500`, children: [_jsx("span", { className: "font-medium", children: "Oops!" }), " ", error.message?.toString()] })), !error && hint && (_jsx("p", { className: `mt-2 italic text-sm text-${color}-500 dark:text-${color}-400`, children: hint }))] }));
};
