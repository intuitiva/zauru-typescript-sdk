import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { IdeaIconSVG } from "@zauru-sdk/icons";
import { useEffect, useState, useRef } from "react";
import { LoadingInputSkeleton } from "../../Skeletons/index.js";
import { useFormContext } from "react-hook-form";
export const SelectField = (props) => {
    const { id, name, title, defaultValue, defaultValueMulti = [], helpText, hint, options, onChange, onChangeMulti, isClearable = false, disabled = false, readOnly = false, isMulti = false, loading = false, className = "", onInputChange, required = false, } = props;
    const [value, setValue] = useState(defaultValue || null);
    const [valueMulti, setValueMulti] = useState(defaultValueMulti);
    const [inputValue, setInputValue] = useState(defaultValue?.label || "");
    const [showTooltip, setShowTooltip] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [filteredOptions, setFilteredOptions] = useState(options);
    const [highlightedIndex, setHighlightedIndex] = useState(-1);
    const selectRef = useRef(null);
    const optionsRef = useRef(null);
    const [isTabPressed, setIsTabPressed] = useState(false);
    const [isEnterPressed, setIsEnterPressed] = useState(false);
    const [isSearching, setIsSearching] = useState(false);
    const { register: tempRegister, formState: { errors }, setValue: setFormValue, } = useFormContext() || { formState: {} };
    const error = errors ? errors[props.name ?? "-1"] : undefined;
    const register = tempRegister
        ? tempRegister(props.name ?? "-1", {
            required,
        })
        : undefined; // Solo usar register si está disponible
    const color = error ? "red" : "gray";
    const isReadOnly = disabled || readOnly;
    const bgColor = isReadOnly ? "bg-gray-200" : `bg-${color}-50`;
    const textColor = isReadOnly ? "text-gray-500" : `text-${color}-900`;
    const borderColor = isReadOnly ? "border-gray-300" : `border-${color}-200`;
    useEffect(() => {
        setFilteredOptions(options);
    }, [options]);
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (selectRef.current &&
                !selectRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        if (defaultValue) {
            setValue(defaultValue);
            setInputValue(defaultValue.label);
            if (setFormValue) {
                setFormValue(name || "", defaultValue.value);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);
    const handleInputChange = (e) => {
        const newValue = e.target.value;
        if (register) {
            register.onChange(e);
        }
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
            if (setFormValue) {
                setFormValue(name || "", newValue.map((v) => v.value));
            }
        }
        else {
            setValue(option);
            setInputValue(option.label);
            onChange && onChange(option);
            if (setFormValue) {
                setFormValue(name || "", option.value);
            }
        }
        setIsOpen(false);
    };
    const handleClear = () => {
        if (isMulti) {
            setValueMulti([]);
            onChangeMulti && onChangeMulti([]);
            if (setFormValue) {
                setFormValue(name || "", []);
            }
        }
        else {
            setValue(null);
            onChange && onChange(null);
            if (setFormValue) {
                setFormValue(name || "", "");
            }
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
            else if (isTabPressed) {
                if (highlightedIndex >= 0) {
                    handleOptionClick(filteredOptions[highlightedIndex]);
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
        return (_jsxs(_Fragment, { children: [title && (_jsx("label", { htmlFor: error ? `${name}-error` : `${name}-success`, className: `block text-sm font-medium text-${color}-700 dark:text-${color}-500`, children: title })), _jsx(LoadingInputSkeleton, {}), helpText && (_jsx("p", { className: `mt-2 italic text-sm text-${color}-500 dark:text-${color}-400`, children: helpText }))] }));
    }
    return (_jsxs("div", { className: `col-span-6 sm:col-span-3 ${className}`, ref: selectRef, children: [title && (_jsxs("label", { htmlFor: error ? `${name}-error` : `${name}-success`, className: `block text-sm font-medium ${color === "red"
                    ? "text-red-700 dark:text-red-500"
                    : "text-gray-700 dark:text-gray-500"}`, children: [title, required && _jsx("span", { className: "text-red-500", children: "*" })] })), _jsxs("div", { className: "relative", children: [_jsx("input", { type: "text", id: id, value: inputValue, onFocus: () => setIsOpen(true), onKeyDown: handleKeyDown, readOnly: isReadOnly, disabled: disabled, className: `block w-full rounded-md ${bgColor} ${borderColor} ${textColor} shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm pr-10`, placeholder: isMulti ? "Select options..." : "Select an option...", autoComplete: "off", onChange: handleInputChange, onBlur: handleBlur, required: required }), _jsx("input", { type: "hidden", ...(register ?? {}), name: name, value: isMulti
                            ? valueMulti.map((v) => v.value).join(",")
                            : value?.value || "" }), isClearable && (value || valueMulti.length > 0) && (_jsx("button", { type: "button", onClick: handleClear, className: "absolute inset-y-0 right-0 pr-3 flex items-center", children: "\u00D7" })), !isClearable && (value || valueMulti.length > 0) && (_jsx("span", { className: "absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none", children: _jsx("svg", { className: "h-5 w-5 text-green-500", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", xmlns: "http://www.w3.org/2000/svg", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M5 13l4 4L19 7" }) }) })), isOpen && !isReadOnly && (_jsx("ul", { ref: optionsRef, className: "absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm", children: filteredOptions.map((option, index) => (_jsx("li", { className: `cursor-pointer select-none relative py-2 pl-3 pr-9 ${(isMulti
                                ? valueMulti.some((v) => v.value === option.value)
                                : value?.value === option.value)
                                ? "text-white bg-indigo-600"
                                : index === highlightedIndex
                                    ? "text-black bg-sky-200"
                                    : "text-gray-900"}`, onClick: () => handleOptionClick(option), onMouseEnter: () => setHighlightedIndex(index), onMouseLeave: () => setHighlightedIndex(-1), children: option.label }, `${option.value}-${index}`))) }))] }), isMulti && (_jsx("div", { className: "mt-2 flex flex-wrap gap-2", children: valueMulti.map((option, index) => (_jsxs("span", { className: "bg-blue-100 text-blue-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded", children: [option.label, _jsx("button", { type: "button", onClick: () => handleOptionClick(option), className: "ml-1 text-blue-600 hover:text-blue-800", children: "\u00D7" })] }, `${option.value}-${index}`))) })), helpText && (_jsx("div", { className: "flex items-center relative mt-1", children: _jsxs("div", { className: "relative cursor-pointer", onMouseEnter: () => setShowTooltip(true), onMouseLeave: () => setShowTooltip(false), children: [_jsx(IdeaIconSVG, {}), showTooltip && (_jsx("div", { className: "absolute -left-48 top-0 mt-8 p-2 bg-white border rounded shadow text-black z-50", children: helpText }))] }) })), error && (_jsxs("p", { className: `mt-2 text-sm text-${color}-600 dark:text-${color}-500`, children: [_jsx("span", { className: "font-medium", children: "Oops!" }), " ", error?.message?.toString() || "Error desconocido"] })), !error && hint && (_jsx("p", { className: `mt-2 italic text-sm text-${color}-500 dark:text-${color}-400`, children: hint }))] }));
};
