import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from "react";
import { useFormContext } from "react-hook-form";
export const YesNo = (props) => {
    const { id, name, title, defaultValue = false, helpText, onChange, disabled, required, } = props;
    const { register: tempRegister, formState: { errors }, } = useFormContext() || { formState: {} }; // Obtener el contexto solo si existe
    const error = errors ? errors[props.name ?? "-1"] : undefined;
    const register = tempRegister
        ? tempRegister(props.name ?? "-1", { required })
        : undefined; // Solo usar register si está disponible
    const [value, setValue] = useState(defaultValue);
    const color = error ? "red" : "gray";
    const handleOnChange = (e) => {
        if (disabled)
            return; // No hacer nada si está deshabilitado
        if (register) {
            register.onChange(e);
        }
        const newValue = !value;
        setValue(newValue);
        onChange && onChange(newValue);
    };
    return (_jsxs(_Fragment, { children: [_jsxs("label", { className: `relative inline-flex items-center cursor-pointer ${disabled ? "opacity-50" : ""}`, children: [_jsx("input", { type: "checkbox", id: id ?? name, checked: value, value: value.toString(), className: "sr-only peer", disabled: disabled, ...(register ?? {}), name: name, onChange: handleOnChange }), value.toString() === "false" && (_jsx("input", { type: "hidden", name: name, value: "false" })), _jsx("div", { className: "w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600" }), _jsx("span", { className: "ml-3 text-sm font-medium text-gray-900", children: title }), required && _jsx("span", { className: "text-red-500", children: "*" })] }), error && (_jsxs("p", { className: `mt-2 text-sm text-${color}-600 dark:text-${color}-500`, children: [_jsx("span", { className: "font-medium", children: "Oops!" }), " ", error.message?.toString()] })), !error && helpText && (_jsx("p", { className: `mt-2 italic text-sm text-${color}-500 dark:text-${color}-400`, children: helpText }))] }));
};
