"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TextArea = exports.TextAreaWithoutValidation = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const redux_1 = require("@zauru-sdk/redux");
const react_1 = require("react");
const TextAreaWithoutValidation = (props) => {
    const { id, name, title, defaultValue = "", hidden, hint, onChange, onKeyDown, disabled = false, error = false, readOnly = false, rows, cols, stopChangeEvents, className = "", } = props;
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
        return ((0, jsx_runtime_1.jsx)("textarea", { id: id ?? name, name: name, value: defaultValue, readOnly: true, hidden: true }));
    }
    const handleInputChange = (event) => {
        if (stopChangeEvents) {
            event.stopPropagation();
            event.preventDefault();
        }
        setValue(event.target.value);
        onChange && onChange(event.target.value);
    };
    return ((0, jsx_runtime_1.jsxs)("div", { className: `col-span-6 sm:col-span-3 ${className}`, children: [title && ((0, jsx_runtime_1.jsx)("label", { htmlFor: error ? `${name}-error` : `${name}-success`, className: `block text-sm font-medium text-${color}-700 dark:text-${color}-500`, children: title })), (0, jsx_runtime_1.jsx)("textarea", { name: name, readOnly: readOnly, disabled: disabled, id: id ?? name, autoComplete: "given-name", value: value, rows: rows, cols: cols, onChange: handleInputChange, onKeyDown: (event) => {
                    onKeyDown && onKeyDown(event);
                }, className: `mt-1 block w-full rounded-md ${bgColor} ${borderColor} ${textColor} shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm` }), error && ((0, jsx_runtime_1.jsxs)("p", { className: `mt-2 text-sm text-${color}-600 dark:text-${color}-500`, children: [(0, jsx_runtime_1.jsx)("span", { className: "font-medium", children: "Oops!" }), " ", error] })), !error && hint && ((0, jsx_runtime_1.jsx)("p", { className: `mt-2 italic text-sm text-${color}-500 dark:text-${color}-400`, children: hint }))] }));
};
exports.TextAreaWithoutValidation = TextAreaWithoutValidation;
//<reference> https://tailwindui.com/components/application-ui/forms/form-layouts
const TextArea = (props) => {
    const { formValidations } = (0, redux_1.useAppSelector)((state) => state.formValidation);
    const error = formValidations[props.formName ?? "-1"]?.[props.name ?? "-1"];
    props = { ...props, error };
    return (0, jsx_runtime_1.jsx)(exports.TextAreaWithoutValidation, { ...props });
};
exports.TextArea = TextArea;
