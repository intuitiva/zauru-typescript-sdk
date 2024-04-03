"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TextField = exports.TextFieldWithoutValidation = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const icons_1 = require("@zauru-sdk/icons");
const redux_1 = require("@zauru-sdk/redux");
const react_1 = require("react");
const TextFieldWithoutValidation = (props) => {
    const { id, name, defaultValue = "", hidden, type = "text", onChange, onKeyDown, disabled = false, readOnly = false, min, integer = false, stopChangeEvents, style, error, title, helpText, className, hint, } = props;
    const [showTooltip, setShowTooltip] = (0, react_1.useState)(false);
    const [value, setValue] = (0, react_1.useState)(defaultValue);
    const color = error ? "red" : "gray";
    const isReadOnly = disabled || readOnly;
    const bgColor = isReadOnly ? "bg-gray-200" : `bg-${color}-50`;
    const textColor = isReadOnly ? "text-gray-500" : `text-${color}-900`;
    const borderColor = isReadOnly ? "border-gray-300" : `border-${color}-500`;
    (0, react_1.useEffect)(() => {
        setValue(defaultValue);
    }, [defaultValue]);
    if (hidden) {
        return ((0, jsx_runtime_1.jsx)("input", { type: type, id: id ?? name, name: name, value: defaultValue, readOnly: true, hidden: true }));
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
    const inputComponent = ((0, jsx_runtime_1.jsx)("input", { type: type, name: name, readOnly: readOnly, disabled: disabled, id: id ?? name, autoComplete: "given-name", value: value, onWheel: (e) => {
            e.currentTarget.blur();
        }, step: type === "number" ? 0.01 : undefined, onChange: handleInputChange, onKeyDown: (event) => {
            handleKeyDown(event);
            onKeyDown && onKeyDown(event);
        }, min: min, style: style, className: `block w-full rounded-md ${bgColor} ${borderColor} ${textColor} shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm` }));
    if (!error && !title) {
        return (0, jsx_runtime_1.jsx)("div", { className: `${className}`, children: inputComponent });
    }
    return ((0, jsx_runtime_1.jsxs)("div", { className: `col-span-6 sm:col-span-3 ${className}`, children: [title && ((0, jsx_runtime_1.jsx)("label", { htmlFor: error ? `${name}-error` : `${name}-success`, className: `block mb-1 text-sm font-medium text-${color}-700 dark:text-${color}-500`, children: title })), (0, jsx_runtime_1.jsxs)("div", { className: "flex relative items-center", children: [inputComponent, helpText && ((0, jsx_runtime_1.jsx)("div", { className: "flex items-center relative ml-3", children: (0, jsx_runtime_1.jsxs)("div", { className: "relative cursor-pointer", onMouseEnter: () => setShowTooltip(true), onMouseLeave: () => setShowTooltip(false), children: [(0, jsx_runtime_1.jsx)(icons_1.IdeaIconSVG, {}), showTooltip && ((0, jsx_runtime_1.jsx)("div", { className: "absolute -left-48 top-0 mt-8 p-2 bg-white border rounded shadow text-black z-50", children: helpText }))] }) }))] }), error && ((0, jsx_runtime_1.jsxs)("p", { className: `mt-2 text-sm text-${color}-600 dark:text-${color}-500`, children: [(0, jsx_runtime_1.jsx)("span", { className: "font-medium", children: "Oops!" }), " ", error] })), !error && hint && ((0, jsx_runtime_1.jsx)("p", { className: `mt-2 italic text-sm text-${color}-500 dark:text-${color}-400`, children: hint }))] }));
};
exports.TextFieldWithoutValidation = TextFieldWithoutValidation;
const TextField = (props) => {
    const { formValidations } = (0, redux_1.useAppSelector)((state) => state.formValidation);
    const error = formValidations[props.formName ?? "-1"]?.[props.name ?? "-1"];
    props = { ...props, error };
    return (0, jsx_runtime_1.jsx)(exports.TextFieldWithoutValidation, { ...props });
};
exports.TextField = TextField;
