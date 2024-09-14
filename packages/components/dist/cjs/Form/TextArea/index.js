"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TextArea = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const react_hook_form_1 = require("react-hook-form");
const TextArea = (props) => {
    const { id, name, title, defaultValue = "", hidden, hint, onChange, onKeyDown, disabled = false, readOnly = false, rows, cols, stopChangeEvents, className = "", required, } = props;
    const [value, setValue] = (0, react_1.useState)(defaultValue);
    const { register: tempRegister, formState: { errors }, } = (0, react_hook_form_1.useFormContext)() || { formState: {} }; // Obtener el contexto solo si existe
    const error = errors ? errors[props.name ?? "-1"] : undefined;
    const register = tempRegister
        ? tempRegister(props.name ?? "-1", { required })
        : undefined; // Solo usar register si está disponible
    const color = error ? "red" : "gray";
    const isReadOnly = disabled || readOnly;
    const bgColor = isReadOnly ? "bg-gray-200" : `bg-${color}-50`;
    const textColor = isReadOnly ? "text-gray-500" : `text-${color}-900`;
    const borderColor = isReadOnly ? "border-gray-300" : `border-${color}-500`;
    (0, react_1.useEffect)(() => {
        setValue(defaultValue);
    }, [defaultValue]);
    if (hidden) {
        return ((0, jsx_runtime_1.jsx)("textarea", { id: id ?? name, value: defaultValue, readOnly: true, hidden: true, ...(register ?? {}), name: name }));
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
    return ((0, jsx_runtime_1.jsxs)("div", { className: `col-span-6 sm:col-span-3 ${className}`, children: [title && ((0, jsx_runtime_1.jsxs)("label", { htmlFor: error ? `${name}-error` : `${name}-success`, className: `block text-sm font-medium text-${color}-700 dark:text-${color}-500`, children: [title, required && (0, jsx_runtime_1.jsx)("span", { className: "text-red-500", children: "*" })] })), (0, jsx_runtime_1.jsx)("textarea", { readOnly: readOnly, disabled: disabled, id: id ?? name, autoComplete: "given-name", value: value, rows: rows, cols: cols, onKeyDown: (event) => {
                    onKeyDown && onKeyDown(event);
                }, className: `mt-1 block w-full rounded-md ${bgColor} ${borderColor} ${textColor} shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm`, ...(register ?? {}), name: name, onChange: handleInputChange }), error && ((0, jsx_runtime_1.jsxs)("p", { className: `mt-2 text-sm text-${color}-600 dark:text-${color}-500`, children: [(0, jsx_runtime_1.jsx)("span", { className: "font-medium", children: "Oops!" }), " ", error.message?.toString()] })), !error && hint && ((0, jsx_runtime_1.jsx)("p", { className: `mt-2 italic text-sm text-${color}-500 dark:text-${color}-400`, children: hint }))] }));
};
exports.TextArea = TextArea;
