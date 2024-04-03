import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useAppSelector } from "@zauru-sdk/redux";
import { useState } from "react";
export const YesNo = (props) => {
    const { id, name, title, defaultValue = false, helpText, onChange, disabled, } = props;
    const { formValidations } = useAppSelector((state) => state.formValidation);
    const error = formValidations[props.formName ?? "-1"]?.[props.name ?? "-1"];
    const [value, setValue] = useState(defaultValue);
    const color = error ? "red" : "gray";
    const handleOnChange = () => {
        if (disabled)
            return; // No hacer nada si está deshabilitado
        const newValue = !value;
        setValue(newValue);
        onChange && onChange(newValue);
    };
    return (_jsxs(_Fragment, { children: [_jsxs("label", { className: `relative inline-flex items-center cursor-pointer ${disabled ? "opacity-50" : ""}`, children: [_jsx("input", { type: "checkbox", id: id ?? name, name: name, checked: value, value: value.toString(), className: "sr-only peer", onChange: handleOnChange, disabled: disabled }), value.toString() === "false" && (_jsx("input", { type: "hidden", name: name, value: "false" })), _jsx("div", { className: "w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600" }), _jsx("span", { className: "ml-3 text-sm font-medium text-gray-900", children: title })] }), error && (_jsxs("p", { className: `mt-2 text-sm text-${color}-600 dark:text-${color}-500`, children: [_jsx("span", { className: "font-medium", children: "Oops!" }), " ", error] })), !error && helpText && (_jsx("p", { className: `mt-2 italic text-sm text-${color}-500 dark:text-${color}-400`, children: helpText }))] }));
};
