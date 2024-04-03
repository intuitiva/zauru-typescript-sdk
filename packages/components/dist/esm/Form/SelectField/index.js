import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { IdeaIconSVG } from "@zauru-sdk/icons";
import { useAppSelector } from "@zauru-sdk/redux";
import { useEffect, useState } from "react";
import Select, { components } from "react-select";
import { LoadingInputSkeleton } from "../../Skeletons/index.js";
const Input = (props) => (_jsx(components.Input, { ...props, readOnly: props.selectProps.isReadOnly }));
export const SelectFieldWithoutValidation = (props) => {
    const { id, name, title, defaultValue, defaultValueMulti = [], helpText, hint, options, onChange, onChangeMulti, isClearable = false, error = false, disabled = false, readOnly = false, isMulti = false, loading = false, className = "", onInputChange, } = props;
    const [value, setValue] = useState(defaultValue || null);
    const [valueMulti, setValueMulti] = useState(defaultValueMulti);
    const [inputValue, setInputValue] = useState("");
    const [showTooltip, setShowTooltip] = useState(false);
    const [isClient, setIsClient] = useState(typeof window !== "undefined");
    const menuIsOpen = readOnly ? false : props?.menuIsOpen;
    const color = error ? "red" : "gray";
    let documentRef = null;
    const isReadOnly = disabled || readOnly;
    const bgColor = isReadOnly ? "bg-gray-200" : `bg-${color}-50`;
    const textColor = isReadOnly ? "text-gray-500" : `text-${color}-900`;
    const borderColor = isReadOnly ? "border-gray-300" : `border-${color}-500`;
    if (typeof window !== "undefined") {
        documentRef = document;
    }
    useEffect(() => {
        setValue(defaultValue || null);
    }, [defaultValue]);
    useEffect(() => {
        setIsClient(true);
    }, []);
    if (!isClient || loading || !documentRef) {
        return (_jsxs(_Fragment, { children: [title && (_jsx("label", { htmlFor: error ? `${name}-error` : `${name}-success`, className: `block text-sm font-medium text-${color}-700 dark:text-${color}-500`, children: title })), _jsx(LoadingInputSkeleton, {}), helpText && (_jsx("p", { className: `mt-2 italic text-sm text-${color}-500 dark:text-${color}-400`, children: helpText }))] }));
    }
    const handleOnChange = (selection) => {
        // Verificar si el valor de selección es un objeto con propiedades 'value' y 'label'
        if (typeof selection === "object" &&
            selection !== null &&
            "value" in selection &&
            "label" in selection) {
            setValue(selection);
            onChange && onChange(selection);
        }
        else {
            setValue(null);
            onChange && onChange(null);
        }
    };
    const handleOnChangeMulti = (selection) => {
        if (Array.isArray(selection)) {
            setValueMulti(selection);
            onChangeMulti &&
                onChangeMulti(selection);
        }
        else {
            setValueMulti([]);
            onChangeMulti && onChangeMulti([]);
        }
    };
    const selectComponent = (_jsxs(_Fragment, { children: [_jsx(Select, { className: `block w-full rounded-md ${bgColor} ${borderColor} ${textColor} shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm`, id: isMulti ? undefined : id, instanceId: isMulti ? undefined : id, isDisabled: disabled, name: isMulti ? undefined : name, options: options, onChange: isMulti ? handleOnChangeMulti : handleOnChange, defaultValue: isMulti ? valueMulti : value, onInputChange: (newValue, actionMeta) => {
                    setInputValue(newValue);
                    onInputChange && onInputChange(newValue, actionMeta);
                }, inputValue: inputValue, onMenuOpen: () => { }, onMenuClose: () => { }, menuPortalTarget: documentRef?.body, styles: { menuPortal: (base) => ({ ...base, zIndex: 9999 }) }, isClearable: isClearable, isSearchable: true, components: { Input }, menuIsOpen: menuIsOpen, 
                //windowThreshold={50}
                isMulti: isMulti }), isMulti && (_jsx("input", { hidden: true, readOnly: true, name: name, value: valueMulti.map((x) => x?.value).join(","), id: id }))] }));
    return (_jsxs("div", { className: `col-span-6 sm:col-span-3 ${className}`, children: [title && (_jsx("label", { htmlFor: error ? `${name}-error` : `${name}-success`, className: `block text-sm font-medium ${color === "red"
                    ? "text-red-700 dark:text-red-500"
                    : "text-gray-700 dark:text-gray-500"}`, children: title })), _jsxs("div", { className: "flex relative items-center", children: [selectComponent, helpText && (_jsx("div", { className: "flex items-center relative ml-3", children: _jsxs("div", { className: "relative cursor-pointer", onMouseEnter: () => setShowTooltip(true), onMouseLeave: () => setShowTooltip(false), children: [_jsx(IdeaIconSVG, {}), showTooltip && (_jsx("div", { className: "absolute -left-48 top-0 mt-8 p-2 bg-white border rounded shadow text-black z-50", children: helpText }))] }) }))] }), error && (_jsxs("p", { className: `mt-2 text-sm text-${color}-600 dark:text-${color}-500`, children: [_jsx("span", { className: "font-medium", children: "Oops!" }), " ", error] })), !error && hint && (_jsx("p", { className: `mt-2 italic text-sm text-${color}-500 dark:text-${color}-400`, children: hint }))] }));
};
export const SelectField = (props) => {
    const { formValidations } = useAppSelector((state) => state.formValidation);
    const error = formValidations[props.formName ?? "-1"]?.[props.name ?? "-1"];
    props = { ...props, error };
    return _jsx(SelectFieldWithoutValidation, { ...props });
};
