"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RadioButtonGroup = exports.RadioButtonGroupWithoutValidation = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const icons_1 = require("@zauru-sdk/icons");
const redux_1 = require("@zauru-sdk/redux");
const react_1 = require("react");
const RadioButtonGroupWithoutValidation = (props) => {
    const { id, name, options, defaultValue, orientation = "vertical", onChange, disabled = false, error, title, helpText, className, } = props;
    const [selectedValue, setSelectedValue] = (0, react_1.useState)(defaultValue);
    const [showTooltip, setShowTooltip] = (0, react_1.useState)(false);
    const handleChange = (event) => {
        setSelectedValue(event.target.value);
        onChange && onChange(event.target.value, event);
    };
    const containerClass = orientation === "vertical" ? "flex flex-col" : "flex flex-row";
    return ((0, jsx_runtime_1.jsxs)("div", { className: `radio-button-group ${className}`, children: [title && ((0, jsx_runtime_1.jsx)("label", { htmlFor: id, className: "block mb-1 text-sm font-medium text-gray-700", children: title })), (0, jsx_runtime_1.jsx)("div", { className: containerClass, children: options.map((option, index) => ((0, jsx_runtime_1.jsxs)("label", { className: "flex items-center space-x-2", children: [(0, jsx_runtime_1.jsx)("input", { type: "radio", id: id ? `${id}-${option.value}` : undefined, name: name, value: option.value, checked: selectedValue === option.value, onChange: handleChange, disabled: disabled, className: "focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300" }), (0, jsx_runtime_1.jsx)("span", { className: "text-sm text-gray-700", children: option.label })] }, index))) }), helpText && ((0, jsx_runtime_1.jsxs)("div", { className: "relative cursor-pointer", onMouseEnter: () => setShowTooltip(true), onMouseLeave: () => setShowTooltip(false), children: [(0, jsx_runtime_1.jsx)(icons_1.IdeaIconSVG, {}), showTooltip && ((0, jsx_runtime_1.jsx)("div", { className: "absolute mt-2 p-2 bg-white border rounded shadow text-black z-50", children: helpText }))] })), error && ((0, jsx_runtime_1.jsxs)("p", { className: "mt-2 text-sm text-red-600", children: [(0, jsx_runtime_1.jsx)("span", { className: "font-medium", children: "Oops!" }), " ", error] }))] }));
};
exports.RadioButtonGroupWithoutValidation = RadioButtonGroupWithoutValidation;
const RadioButtonGroup = (props) => {
    const { formValidations } = (0, redux_1.useAppSelector)((state) => state.formValidation);
    const error = formValidations[props.name ?? "-1"];
    props = { ...props, error };
    return (0, jsx_runtime_1.jsx)(exports.RadioButtonGroupWithoutValidation, { ...props });
};
exports.RadioButtonGroup = RadioButtonGroup;
