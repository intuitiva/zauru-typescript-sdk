"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CheckBox = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const react_hook_form_1 = require("react-hook-form");
const CheckBox = (props) => {
    const { id, name, defaultValue = false, onChange, disabled = false, label, required = false, } = props;
    const [checked, setChecked] = (0, react_1.useState)(defaultValue);
    (0, react_1.useEffect)(() => {
        setChecked(defaultValue);
    }, [defaultValue]);
    const handleInputChange = (event) => {
        const isChecked = event.target.checked;
        if (register) {
            register.onChange(event);
        }
        if (onChange) {
            const result = onChange(isChecked, event);
            if (result?.stopUIChange) {
                return;
            }
        }
        setChecked(isChecked);
    };
    const { register: tempRegister, formState: { errors }, } = (0, react_hook_form_1.useFormContext)() || { formState: {} }; // Obtener el contexto solo si existe
    const error = errors ? errors[props.name ?? "-1"] : undefined;
    const register = tempRegister
        ? tempRegister(props.name ?? "-1", { required })
        : undefined; // Solo usar register si está disponible
    const color = error ? "red" : "gray";
    const borderColor = disabled ? "border-gray-300" : `border-${color}-500`;
    const inputComponent = ((0, jsx_runtime_1.jsx)("input", { type: "checkbox", id: id ?? name, checked: checked, className: `form-checkbox h-4 w-4 text-indigo-600 ${borderColor} focus:border-indigo-500 focus:ring-indigo-500`, disabled: disabled, ...(register ?? {}), name: name, onChange: handleInputChange }));
    if (!error && !label) {
        return inputComponent;
    }
    return ((0, jsx_runtime_1.jsxs)("div", { className: "col-span-6 sm:col-span-3", children: [(0, jsx_runtime_1.jsxs)("div", { className: `flex items-center ${borderColor}`, children: [inputComponent, label && ((0, jsx_runtime_1.jsxs)("label", { htmlFor: id ?? name, className: `ml-2 block text-sm font-medium text-${color}-700 dark:text-${color}-500`, children: [label, required && (0, jsx_runtime_1.jsx)("span", { className: "text-red-500", children: "*" })] }))] }), error && ((0, jsx_runtime_1.jsxs)("p", { className: `mt-2 text-sm text-${color}-600 dark:text-${color}-500`, children: [(0, jsx_runtime_1.jsx)("span", { className: "font-medium", children: "Oops!" }), " ", error.message?.toString()] }))] }));
};
exports.CheckBox = CheckBox;
