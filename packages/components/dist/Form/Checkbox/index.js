import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useAppSelector } from "@zauru-sdk/redux";
import { useEffect, useState } from "react";
export const CheckboxWithoutValidation = (props) => {
    const { id, name, defaultValue = false, onChange, disabled = false, error, label, } = props;
    const [checked, setChecked] = useState(defaultValue);
    useEffect(() => {
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
    const inputComponent = (_jsx("input", { type: "checkbox", id: id ?? name, name: name, checked: checked, onChange: handleInputChange, className: `form-checkbox h-4 w-4 text-indigo-600 ${borderColor} focus:border-indigo-500 focus:ring-indigo-500`, disabled: disabled }));
    if (!error && !label) {
        return inputComponent;
    }
    return (_jsxs("div", { className: "col-span-6 sm:col-span-3", children: [_jsxs("div", { className: `flex items-center ${borderColor}`, children: [inputComponent, label && (_jsx("label", { htmlFor: id ?? name, className: `ml-2 block text-sm font-medium text-${color}-700 dark:text-${color}-500`, children: label }))] }), error && (_jsxs("p", { className: `mt-2 text-sm text-${color}-600 dark:text-${color}-500`, children: [_jsx("span", { className: "font-medium", children: "Oops!" }), " ", error] }))] }));
};
//<reference> https://tailwindui.com/components/application-ui/forms/form-layouts
export const CheckBox = (props) => {
    const { formValidations } = useAppSelector((state) => state.formValidation);
    const error = formValidations[props.formName ?? "-1"]?.[props.name ?? "-1"];
    props = { ...props, error };
    return _jsx(CheckboxWithoutValidation, { ...props });
};
