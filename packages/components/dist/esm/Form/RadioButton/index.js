import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { useFormContext } from "react-hook-form";
export const RadioButton = (props) => {
    const { id, name, title, options, defaultValue, disabled = false, required = false, onChange, helpText, hint, className = "", orientation = "vertical", } = props;
    const [selectedValue, setSelectedValue] = useState(defaultValue);
    const { register: tempRegister, formState: { errors }, setValue: setOnFormValue, } = useFormContext() || { formState: {} };
    const error = errors ? errors[name] : undefined;
    const color = error ? "red" : "gray";
    const register = tempRegister ? tempRegister(name, { required }) : undefined; // Solo usar register si está disponible
    const handleChange = (event) => {
        const newValue = event.target.value;
        setSelectedValue(newValue);
        if (register) {
            register.onChange(event);
        }
        if (setOnFormValue) {
            setOnFormValue(name, newValue);
        }
        onChange && onChange(newValue, event);
    };
    const containerClass = orientation === "horizontal"
        ? "flex items-center gap-4 flex-wrap" // Estilo para disposición horizontal
        : ""; // Vertical no necesita clase especial
    return (_jsxs("div", { className: `col-span-6 sm:col-span-3 ${className}`, children: [title && (_jsxs("label", { htmlFor: id ?? name, className: `block mb-1 text-sm font-medium text-${color}-700 dark:text-${color}-500`, children: [title, required && _jsx("span", { className: "text-red-500", children: "*" })] })), _jsx("div", { className: containerClass, children: options.map((option) => (_jsxs("div", { className: `flex items-center mb-2 ${disabled ? "opacity-50 pointer-events-none" : ""}`, children: [_jsx("input", { type: "radio", id: `${name}-${option.value}`, value: option.value, disabled: disabled, checked: selectedValue === option.value, className: `h-4 w-4 text-indigo-600 border-${color}-300 focus:ring-indigo-500`, ...(register ?? {}), onChange: handleChange }), _jsx("label", { htmlFor: `${name}-${option.value}`, className: `ml-2 block text-sm font-medium text-${color}-900 dark:text-${color}-500`, children: option.label })] }, option.value))) }), helpText && (_jsx("p", { className: `mt-2 italic text-sm text-${color}-500 dark:text-${color}-400`, children: helpText })), error && (_jsxs("p", { className: `mt-2 text-sm text-${color}-600 dark:text-${color}-500`, children: [_jsx("span", { className: "font-medium", children: "Oops!" }), " ", error.message?.toString()] })), !error && hint && (_jsx("p", { className: `mt-2 italic text-sm text-${color}-500 dark:text-${color}-400`, children: hint }))] }));
};
