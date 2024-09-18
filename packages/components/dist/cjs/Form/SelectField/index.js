"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SelectField = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const icons_1 = require("@zauru-sdk/icons");
const react_1 = require("react");
const index_js_1 = require("../../Skeletons/index.js");
const react_hook_form_1 = require("react-hook-form");
const SelectField = (props) => {
    const { id, name, title, defaultValue, defaultValueMulti = [], helpText, hint, options, onChange, onChangeMulti, isClearable = false, disabled = false, readOnly = false, isMulti = false, loading = false, className = "", onInputChange, required, } = props;
    const [value, setValue] = (0, react_1.useState)(defaultValue || null);
    const [valueMulti, setValueMulti] = (0, react_1.useState)(defaultValueMulti);
    const [inputValue, setInputValue] = (0, react_1.useState)(defaultValue?.label || "");
    const [showTooltip, setShowTooltip] = (0, react_1.useState)(false);
    const [isOpen, setIsOpen] = (0, react_1.useState)(false);
    const [filteredOptions, setFilteredOptions] = (0, react_1.useState)(options);
    const [highlightedIndex, setHighlightedIndex] = (0, react_1.useState)(-1);
    const selectRef = (0, react_1.useRef)(null);
    const optionsRef = (0, react_1.useRef)(null);
    const [isTabPressed, setIsTabPressed] = (0, react_1.useState)(false);
    const [isEnterPressed, setIsEnterPressed] = (0, react_1.useState)(false);
    const [isSearching, setIsSearching] = (0, react_1.useState)(false);
    const { control, formState: { errors }, setValue: setFormValue, } = (0, react_hook_form_1.useFormContext)() || { formState: {} };
    const error = errors ? errors[props.name ?? "-1"] : undefined;
    const color = error ? "red" : "gray";
    const isReadOnly = disabled || readOnly;
    const bgColor = isReadOnly ? "bg-gray-200" : `bg-${color}-50`;
    const textColor = isReadOnly ? "text-gray-500" : `text-${color}-900`;
    const borderColor = isReadOnly ? "border-gray-300" : `border-${color}-500`;
    (0, react_1.useEffect)(() => {
        setFilteredOptions(options);
    }, [options]);
    (0, react_1.useEffect)(() => {
        const handleClickOutside = (event) => {
            if (selectRef.current &&
                !selectRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        if (defaultValue) {
            setValue(defaultValue);
            setInputValue(defaultValue.label);
            setFormValue(name || "", defaultValue);
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);
    const handleInputChange = (e) => {
        const newValue = e.target.value;
        setInputValue(newValue);
        onInputChange && onInputChange(newValue);
        setIsSearching(true);
        setFilteredOptions(options.filter((option) => option.label.toLowerCase().includes(newValue.toLowerCase())));
    };
    const handleOptionClick = (option) => {
        if (isMulti) {
            const newValue = valueMulti.some((v) => v.value === option.value)
                ? valueMulti.filter((v) => v.value !== option.value)
                : [...valueMulti, option];
            setValueMulti(newValue);
            onChangeMulti && onChangeMulti(newValue);
            setFormValue(name || "", newValue);
        }
        else {
            setValue(option);
            setInputValue(option.label);
            onChange && onChange(option);
            setFormValue(name || "", option);
        }
        setIsOpen(false);
    };
    const handleClear = () => {
        if (isMulti) {
            setValueMulti([]);
            onChangeMulti && onChangeMulti([]);
            setFormValue(name || "", []);
        }
        else {
            setValue(null);
            onChange && onChange(null);
            setFormValue(name || "", null);
        }
        setInputValue("");
    };
    const handleBlur = () => {
        setTimeout(() => {
            if (isTabPressed &&
                filteredOptions.length > 0 &&
                !isEnterPressed &&
                isSearching) {
                if (highlightedIndex >= 0) {
                    handleOptionClick(filteredOptions[highlightedIndex]);
                }
                else {
                    handleOptionClick(filteredOptions[0]);
                }
            }
            setIsTabPressed(false);
            setIsEnterPressed(false);
            setIsSearching(false);
            setIsOpen(false);
        }, 200);
    };
    const handleKeyDown = (e) => {
        if (e.key === "Tab") {
            setIsTabPressed(true);
        }
        else if (e.key === "ArrowDown") {
            e.preventDefault();
            setHighlightedIndex((prevIndex) => prevIndex < filteredOptions.length - 1 ? prevIndex + 1 : 0);
            scrollToHighlightedOption();
        }
        else if (e.key === "ArrowUp") {
            e.preventDefault();
            setHighlightedIndex((prevIndex) => prevIndex > 0 ? prevIndex - 1 : filteredOptions.length - 1);
            scrollToHighlightedOption();
        }
        else if (e.key === "Enter" && highlightedIndex !== -1) {
            e.preventDefault();
            setIsEnterPressed(true);
            handleOptionClick(filteredOptions[highlightedIndex]);
        }
        else if (e.key === "Backspace" && (value || valueMulti.length > 0)) {
            e.preventDefault();
            handleClear();
            setInputValue("");
            setFilteredOptions(options);
            setIsOpen(true);
        }
    };
    const scrollToHighlightedOption = () => {
        if (optionsRef.current && optionsRef.current.children[highlightedIndex]) {
            const highlightedOption = optionsRef.current.children[highlightedIndex];
            highlightedOption.scrollIntoView({
                block: "center",
                inline: "center",
                behavior: "smooth",
            });
        }
    };
    if (loading) {
        return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [title && ((0, jsx_runtime_1.jsx)("label", { htmlFor: error ? `${name}-error` : `${name}-success`, className: `block text-sm font-medium text-${color}-700 dark:text-${color}-500`, children: title })), (0, jsx_runtime_1.jsx)(index_js_1.LoadingInputSkeleton, {}), helpText && ((0, jsx_runtime_1.jsx)("p", { className: `mt-2 italic text-sm text-${color}-500 dark:text-${color}-400`, children: helpText }))] }));
    }
    return ((0, jsx_runtime_1.jsxs)("div", { className: `col-span-6 sm:col-span-3 ${className}`, ref: selectRef, children: [title && ((0, jsx_runtime_1.jsxs)("label", { htmlFor: error ? `${name}-error` : `${name}-success`, className: `block text-sm font-medium ${color === "red"
                    ? "text-red-700 dark:text-red-500"
                    : "text-gray-700 dark:text-gray-500"}`, children: [title, required && (0, jsx_runtime_1.jsx)("span", { className: "text-red-500", children: "*" })] })), (0, jsx_runtime_1.jsxs)("div", { className: "relative", children: [(0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: name || "", control: control, rules: { required }, defaultValue: defaultValue || (isMulti ? [] : null), render: ({ field }) => ((0, jsx_runtime_1.jsx)("input", { ...field, type: "text", id: id, value: inputValue, onFocus: () => setIsOpen(true), onBlur: handleBlur, onKeyDown: handleKeyDown, readOnly: isReadOnly, disabled: disabled, className: `block w-full rounded-md ${bgColor} ${borderColor} ${textColor} shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm`, placeholder: isMulti ? "Select options..." : "Select an option...", onChange: (e) => {
                                field.onChange(e);
                                handleInputChange(e);
                            }, autoComplete: "off" })) }), isClearable && (value || valueMulti.length > 0) && ((0, jsx_runtime_1.jsx)("button", { type: "button", onClick: handleClear, className: "absolute inset-y-0 right-0 pr-3 flex items-center", children: "\u00D7" })), isOpen && !isReadOnly && ((0, jsx_runtime_1.jsx)("ul", { ref: optionsRef, className: "absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm", children: filteredOptions.map((option, index) => ((0, jsx_runtime_1.jsx)("li", { className: `cursor-pointer select-none relative py-2 pl-3 pr-9 ${(isMulti
                                ? valueMulti.some((v) => v.value === option.value)
                                : value?.value === option.value)
                                ? "text-white bg-indigo-600"
                                : index === highlightedIndex
                                    ? "text-black bg-sky-200"
                                    : "text-gray-900"}`, onClick: () => handleOptionClick(option), onMouseEnter: () => setHighlightedIndex(index), onMouseLeave: () => setHighlightedIndex(-1), children: option.label }, `${option.value}-${index}`))) }))] }), isMulti && ((0, jsx_runtime_1.jsx)("div", { className: "mt-2 flex flex-wrap gap-2", children: valueMulti.map((option, index) => ((0, jsx_runtime_1.jsxs)("span", { className: "bg-blue-100 text-blue-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded", children: [option.label, (0, jsx_runtime_1.jsx)("button", { type: "button", onClick: () => handleOptionClick(option), className: "ml-1 text-blue-600 hover:text-blue-800", children: "\u00D7" })] }, `${option.value}-${index}`))) })), helpText && ((0, jsx_runtime_1.jsx)("div", { className: "flex items-center relative mt-1", children: (0, jsx_runtime_1.jsxs)("div", { className: "relative cursor-pointer", onMouseEnter: () => setShowTooltip(true), onMouseLeave: () => setShowTooltip(false), children: [(0, jsx_runtime_1.jsx)(icons_1.IdeaIconSVG, {}), showTooltip && ((0, jsx_runtime_1.jsx)("div", { className: "absolute -left-48 top-0 mt-8 p-2 bg-white border rounded shadow text-black z-50", children: helpText }))] }) })), error && ((0, jsx_runtime_1.jsxs)("p", { className: `mt-2 text-sm text-${color}-600 dark:text-${color}-500`, children: [(0, jsx_runtime_1.jsx)("span", { className: "font-medium", children: "Oops!" }), " ", error?.message?.toString() || "Error desconocido"] })), !error && hint && ((0, jsx_runtime_1.jsx)("p", { className: `mt-2 italic text-sm text-${color}-500 dark:text-${color}-400`, children: hint }))] }));
};
exports.SelectField = SelectField;
