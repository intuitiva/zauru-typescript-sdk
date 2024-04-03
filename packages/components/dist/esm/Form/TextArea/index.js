import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useAppSelector } from "@zauru-sdk/redux";
import { useEffect, useState } from "react";
export const TextAreaWithoutValidation = (props) => {
    const { id, name, title, defaultValue = "", hidden, hint, onChange, onKeyDown, disabled = false, error = false, readOnly = false, rows, cols, stopChangeEvents, className = "", } = props;
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
        return (_jsx("textarea", { id: id ?? name, name: name, value: defaultValue, readOnly: true, hidden: true }));
    }
    const handleInputChange = (event) => {
        if (stopChangeEvents) {
            event.stopPropagation();
            event.preventDefault();
        }
        setValue(event.target.value);
        onChange && onChange(event.target.value);
    };
    return (_jsxs("div", { className: `col-span-6 sm:col-span-3 ${className}`, children: [title && (_jsx("label", { htmlFor: error ? `${name}-error` : `${name}-success`, className: `block text-sm font-medium text-${color}-700 dark:text-${color}-500`, children: title })), _jsx("textarea", { name: name, readOnly: readOnly, disabled: disabled, id: id ?? name, autoComplete: "given-name", value: value, rows: rows, cols: cols, onChange: handleInputChange, onKeyDown: (event) => {
                    onKeyDown && onKeyDown(event);
                }, className: `mt-1 block w-full rounded-md ${bgColor} ${borderColor} ${textColor} shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm` }), error && (_jsxs("p", { className: `mt-2 text-sm text-${color}-600 dark:text-${color}-500`, children: [_jsx("span", { className: "font-medium", children: "Oops!" }), " ", error] })), !error && hint && (_jsx("p", { className: `mt-2 italic text-sm text-${color}-500 dark:text-${color}-400`, children: hint }))] }));
};
//<reference> https://tailwindui.com/components/application-ui/forms/form-layouts
export const TextArea = (props) => {
    const { formValidations } = useAppSelector((state) => state.formValidation);
    const error = formValidations[props.formName ?? "-1"]?.[props.name ?? "-1"];
    props = { ...props, error };
    return _jsx(TextAreaWithoutValidation, { ...props });
};
