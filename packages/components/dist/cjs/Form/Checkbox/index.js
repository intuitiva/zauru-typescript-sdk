"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CheckBox = exports.CheckboxWithoutValidation = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const redux_1 = require("@zauru-sdk/redux");
const react_1 = require("react");
const CheckboxWithoutValidation = (props) => {
    const { id, name, defaultValue = false, onChange, disabled = false, error, label, } = props;
    const [checked, setChecked] = (0, react_1.useState)(defaultValue);
    (0, react_1.useEffect)(() => {
        setChecked(defaultValue);
    }, [defaultValue]);
    const handleInputChange = (event) => {
        const isChecked = event.target.checked;
        if (onChange) {
            const result = onChange(isChecked, event);
            if (result?.stopUIChange) {
                return;
            }
        }
        setChecked(isChecked);
    };
    const color = error ? "red" : "gray";
    const borderColor = disabled ? "border-gray-300" : `border-${color}-500`;
    const inputComponent = ((0, jsx_runtime_1.jsx)("input", { type: "checkbox", id: id ?? name, name: name, checked: checked, onChange: handleInputChange, className: `form-checkbox h-4 w-4 text-indigo-600 ${borderColor} focus:border-indigo-500 focus:ring-indigo-500`, disabled: disabled }));
    if (!error && !label) {
        return inputComponent;
    }
    return ((0, jsx_runtime_1.jsxs)("div", { className: "col-span-6 sm:col-span-3", children: [(0, jsx_runtime_1.jsxs)("div", { className: `flex items-center ${borderColor}`, children: [inputComponent, label && ((0, jsx_runtime_1.jsx)("label", { htmlFor: id ?? name, className: `ml-2 block text-sm font-medium text-${color}-700 dark:text-${color}-500`, children: label }))] }), error && ((0, jsx_runtime_1.jsxs)("p", { className: `mt-2 text-sm text-${color}-600 dark:text-${color}-500`, children: [(0, jsx_runtime_1.jsx)("span", { className: "font-medium", children: "Oops!" }), " ", error] }))] }));
};
exports.CheckboxWithoutValidation = CheckboxWithoutValidation;
//<reference> https://tailwindui.com/components/application-ui/forms/form-layouts
const CheckBox = (props) => {
    const { formValidations } = (0, redux_1.useAppSelector)((state) => state.formValidation);
    const error = formValidations[props.formName ?? "-1"]?.[props.name ?? "-1"];
    props = { ...props, error };
    return (0, jsx_runtime_1.jsx)(exports.CheckboxWithoutValidation, { ...props });
};
exports.CheckBox = CheckBox;
