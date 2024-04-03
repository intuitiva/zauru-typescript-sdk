"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SelectField = exports.SelectFieldWithoutValidation = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const icons_1 = require("@zauru-sdk/icons");
const redux_1 = require("@zauru-sdk/redux");
const react_1 = require("react");
const react_select_1 = __importStar(require("react-select"));
const index_js_1 = require("../../Skeletons/index.js");
const Input = (props) => ((0, jsx_runtime_1.jsx)(react_select_1.components.Input, { ...props, readOnly: props.selectProps.isReadOnly }));
const SelectFieldWithoutValidation = (props) => {
    const { id, name, title, defaultValue, defaultValueMulti = [], helpText, hint, options, onChange, onChangeMulti, isClearable = false, error = false, disabled = false, readOnly = false, isMulti = false, loading = false, className = "", onInputChange, } = props;
    const [value, setValue] = (0, react_1.useState)(defaultValue || null);
    const [valueMulti, setValueMulti] = (0, react_1.useState)(defaultValueMulti);
    const [inputValue, setInputValue] = (0, react_1.useState)("");
    const [showTooltip, setShowTooltip] = (0, react_1.useState)(false);
    const [isClient, setIsClient] = (0, react_1.useState)(typeof window !== "undefined");
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
    (0, react_1.useEffect)(() => {
        setValue(defaultValue || null);
    }, [defaultValue]);
    (0, react_1.useEffect)(() => {
        setIsClient(true);
    }, []);
    if (!isClient || loading || !documentRef) {
        return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [title && ((0, jsx_runtime_1.jsx)("label", { htmlFor: error ? `${name}-error` : `${name}-success`, className: `block text-sm font-medium text-${color}-700 dark:text-${color}-500`, children: title })), (0, jsx_runtime_1.jsx)(index_js_1.LoadingInputSkeleton, {}), helpText && ((0, jsx_runtime_1.jsx)("p", { className: `mt-2 italic text-sm text-${color}-500 dark:text-${color}-400`, children: helpText }))] }));
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
    const selectComponent = ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(react_select_1.default, { className: `block w-full rounded-md ${bgColor} ${borderColor} ${textColor} shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm`, id: isMulti ? undefined : id, instanceId: isMulti ? undefined : id, isDisabled: disabled, name: isMulti ? undefined : name, options: options, onChange: isMulti ? handleOnChangeMulti : handleOnChange, defaultValue: isMulti ? valueMulti : value, onInputChange: (newValue, actionMeta) => {
                    setInputValue(newValue);
                    onInputChange && onInputChange(newValue, actionMeta);
                }, inputValue: inputValue, onMenuOpen: () => { }, onMenuClose: () => { }, menuPortalTarget: documentRef?.body, styles: { menuPortal: (base) => ({ ...base, zIndex: 9999 }) }, isClearable: isClearable, isSearchable: true, components: { Input }, menuIsOpen: menuIsOpen, 
                //windowThreshold={50}
                isMulti: isMulti }), isMulti && ((0, jsx_runtime_1.jsx)("input", { hidden: true, readOnly: true, name: name, value: valueMulti.map((x) => x?.value).join(","), id: id }))] }));
    return ((0, jsx_runtime_1.jsxs)("div", { className: `col-span-6 sm:col-span-3 ${className}`, children: [title && ((0, jsx_runtime_1.jsx)("label", { htmlFor: error ? `${name}-error` : `${name}-success`, className: `block text-sm font-medium ${color === "red"
                    ? "text-red-700 dark:text-red-500"
                    : "text-gray-700 dark:text-gray-500"}`, children: title })), (0, jsx_runtime_1.jsxs)("div", { className: "flex relative items-center", children: [selectComponent, helpText && ((0, jsx_runtime_1.jsx)("div", { className: "flex items-center relative ml-3", children: (0, jsx_runtime_1.jsxs)("div", { className: "relative cursor-pointer", onMouseEnter: () => setShowTooltip(true), onMouseLeave: () => setShowTooltip(false), children: [(0, jsx_runtime_1.jsx)(icons_1.IdeaIconSVG, {}), showTooltip && ((0, jsx_runtime_1.jsx)("div", { className: "absolute -left-48 top-0 mt-8 p-2 bg-white border rounded shadow text-black z-50", children: helpText }))] }) }))] }), error && ((0, jsx_runtime_1.jsxs)("p", { className: `mt-2 text-sm text-${color}-600 dark:text-${color}-500`, children: [(0, jsx_runtime_1.jsx)("span", { className: "font-medium", children: "Oops!" }), " ", error] })), !error && hint && ((0, jsx_runtime_1.jsx)("p", { className: `mt-2 italic text-sm text-${color}-500 dark:text-${color}-400`, children: hint }))] }));
};
exports.SelectFieldWithoutValidation = SelectFieldWithoutValidation;
const SelectField = (props) => {
    const { formValidations } = (0, redux_1.useAppSelector)((state) => state.formValidation);
    const error = formValidations[props.formName ?? "-1"]?.[props.name ?? "-1"];
    props = { ...props, error };
    return (0, jsx_runtime_1.jsx)(exports.SelectFieldWithoutValidation, { ...props });
};
exports.SelectField = SelectField;
