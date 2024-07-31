import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { IdeaIconSVG } from "@zauru-sdk/icons";
import { useAppSelector } from "@zauru-sdk/redux";
import { useState } from "react";
export const RadioButtonGroupWithoutValidation = (props) => {
    const { id, name, options, defaultValue, orientation = "vertical", onChange, disabled = false, error, title, helpText, className, } = props;
    const [selectedValue, setSelectedValue] = useState(defaultValue);
    const [showTooltip, setShowTooltip] = useState(false);
    const handleChange = (event) => {
        setSelectedValue(event.target.value);
        onChange && onChange(event.target.value, event);
    };
    const containerClass = orientation === "vertical" ? "flex flex-col" : "flex flex-row space-x-5";
    return (_jsxs("div", { className: `radio-button-group ${className}`, children: [title && (_jsx("label", { htmlFor: id, className: "block mb-1 text-sm font-medium text-gray-700", children: title })), _jsx("div", { className: containerClass, children: options.map((option, index) => (_jsxs("label", { className: "flex items-center space-x-2", children: [_jsx("input", { type: "radio", id: id ? `${id}-${option.value}` : undefined, name: name, value: option.value, checked: selectedValue === option.value, onChange: handleChange, disabled: disabled, className: "focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300" }), _jsx("span", { className: "text-sm text-gray-700", children: option.label })] }, index))) }), helpText && (_jsxs("div", { className: "relative cursor-pointer", onMouseEnter: () => setShowTooltip(true), onMouseLeave: () => setShowTooltip(false), children: [_jsx(IdeaIconSVG, {}), showTooltip && (_jsx("div", { className: "absolute mt-2 p-2 bg-white border rounded shadow text-black z-50", children: helpText }))] })), error && (_jsxs("p", { className: "mt-2 text-sm text-red-600", children: [_jsx("span", { className: "font-medium", children: "Oops!" }), " ", error] }))] }));
};
export const RadioButtonGroup = (props) => {
    const { formValidations } = useAppSelector((state) => state.formValidation);
    const error = formValidations[props.name ?? "-1"];
    props = { ...props, error };
    return _jsx(RadioButtonGroupWithoutValidation, { ...props });
};
