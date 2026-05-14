import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { CalendarIconSVG, CloseSvgIcon, IdeaIconSVG } from "@zauru-sdk/icons";
import { useFormContext } from "react-hook-form";
export const FormDatePicker = (props) => {
    const { id, name, title, defaultValue = "", hint, helpText, onChange, tabIndex, disabled = false, className = "", isClearable = false, required = false, } = props;
    const [value, setValue] = useState(defaultValue);
    const [showTooltip, setShowTooltip] = useState(false);
    const { register: tempRegister, formState: { errors }, } = useFormContext() || { formState: {} }; // Obtener el contexto solo si existe
    const error = errors ? errors[props.name ?? "-1"] : undefined;
    const register = tempRegister
        ? tempRegister(props.name ?? "-1", { required })
        : undefined; // Solo usar register si está disponible
    const color = error ? "red" : "gray";
    const isReadOnly = disabled;
    const bgColor = isReadOnly ? "bg-gray-200" : `bg-${color}-50`;
    const textColor = isReadOnly ? "text-gray-500" : `text-${color}-500`;
    const borderColor = isReadOnly ? "border-gray-300" : `border-${color}-200`;
    useEffect(() => {
        setValue(defaultValue);
    }, [defaultValue]);
    const clearValue = () => {
        setValue("");
        onChange && onChange("");
    };
    return (_jsxs("div", { children: [title && (_jsxs("label", { htmlFor: error ? `${name}-error` : `${name}-success`, className: `block text-sm font-medium ${textColor} ${className}`, children: [title, required && _jsx("span", { className: "text-red-500", children: "*" })] })), _jsxs("div", { className: "flex relative items-center", children: [_jsx("div", { className: "absolute left-0 flex items-center pl-3 pointer-events-none", children: _jsx(CalendarIconSVG, {}) }), _jsx("input", { id: id, tabIndex: tabIndex, type: "date", value: value ?? "", pattern: "\\d{4}-\\d{2}-\\d{2}", className: `${bgColor} ${borderColor} ${textColor} text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5`, ...(register ?? {}), name: name, onChange: (e) => {
                            setValue(e.target.value);
                            onChange && onChange(e.target.value);
                            if (register) {
                                register.onChange(e);
                            }
                        } }), value && isClearable && (_jsx("button", { type: "button", onClick: clearValue, className: "absolute right-0 mr-10", children: _jsx(CloseSvgIcon, {}) })), helpText && (_jsx("div", { className: "flex items-center relative ml-3", children: _jsxs("div", { className: "relative cursor-pointer", onMouseEnter: () => setShowTooltip(true), onMouseLeave: () => setShowTooltip(false), children: [_jsx(IdeaIconSVG, {}), showTooltip && (_jsx("div", { className: "absolute -left-48 top-0 mt-8 p-2 bg-white border rounded shadow text-black", children: helpText }))] }) }))] }), error && (_jsxs("p", { className: `mt-2 text-sm text-${color}-600 dark:text-${color}-500`, children: [_jsx("span", { className: "font-medium", children: "Oops!" }), " ", error.message?.toString()] })), !error && hint && (_jsx("p", { className: `mt-2 italic text-sm text-${color}-500 dark:text-${color}-400`, children: hint }))] }));
};
