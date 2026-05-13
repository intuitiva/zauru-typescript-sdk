import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { useFormContext } from "react-hook-form";
import { useState, useRef, useEffect } from "react";
export const Button = (props) => {
    const { type = "submit", loading = false, loadingText = "Guardando...", title = "Guardar", name = "save", onClickSave, selectedColor = "indigo", children, className = "", disabled = false, enableFormErrorsValidation = false, enableFormErrorsDescriptions = false, dropdownOptions = [], dropdownTitle, } = props;
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    const formContext = useFormContext();
    const formHasErrors = formContext ? !formContext.formState.isValid : false;
    const formErrors = formContext ? formContext.formState.errors : {};
    const COLORS = {
        green: {
            bg900: "bg-green-900",
            bg700: "bg-green-700",
            bg600: "bg-green-600",
            bg500: "bg-green-500",
            bg200: "bg-green-200",
            ring600: "ring-green-600",
            ring500: "ring-green-500",
        },
        indigo: {
            bg900: "bg-indigo-900",
            bg700: "bg-indigo-700",
            bg600: "bg-indigo-600",
            bg500: "bg-indigo-500",
            bg200: "bg-indigo-200",
            ring600: "ring-indigo-600",
            ring500: "ring-indigo-500",
        },
        red: {
            bg900: "bg-red-900",
            bg700: "bg-red-700",
            bg600: "bg-red-600",
            bg500: "bg-red-500",
            bg200: "bg-red-200",
            ring600: "ring-red-600",
            ring500: "ring-red-500",
        },
        yellow: {
            bg900: "bg-yellow-900",
            bg700: "bg-yellow-700",
            bg600: "bg-yellow-600",
            bg500: "bg-yellow-500",
            bg200: "bg-yellow-200",
            ring600: "ring-yellow-600",
            ring500: "ring-yellow-500",
        },
        gray: {
            bg900: "bg-gray-900",
            bg700: "bg-gray-700",
            bg600: "bg-gray-600",
            bg500: "bg-gray-500",
            bg200: "bg-gray-200",
            ring600: "ring-gray-600",
            ring500: "ring-gray-500",
        },
    };
    const color = COLORS[selectedColor];
    const errorMessage = formHasErrors
        ? Object.values(formErrors)
            .map((error) => error?.message?.toString())
            .join(", ")
        : "";
    // Manejar click fuera del dropdown
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current &&
                !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);
    const isButtonDisabled = loading || disabled || (enableFormErrorsValidation && formHasErrors);
    const hasDropdown = dropdownOptions.length > 0;
    // Si no hay opciones de dropdown, comportamiento normal
    if (!hasDropdown) {
        const buttonContent = (_jsx("button", { type: type, name: "action", value: name, disabled: isButtonDisabled, onClick: onClickSave, className: `${isButtonDisabled ? " bg-opacity-25 " : ""} ${loading
                ? " cursor-progress"
                : `${isButtonDisabled ? "" : `hover:${color.bg700}`}`} inline-flex justify-center rounded-md border border-transparent ${color.bg600} py-2 px-4 text-sm font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:${color.ring500} focus:ring-offset-2 ${className}`, children: loading ? children ?? loadingText : children ?? title }));
        return (_jsxs(_Fragment, { children: [(enableFormErrorsValidation && formHasErrors && errorMessage) ||
                    (enableFormErrorsDescriptions && errorMessage) ? (_jsx("div", { className: "flex flex-col items-end mb-2", children: _jsx("div", { className: "p-2 bg-red-100 border border-red-400 text-red-700 rounded-md shadow-sm", children: _jsx("p", { className: "text-sm", children: errorMessage }) }) })) : null, buttonContent] }));
    }
    // Comportamiento con dropdown
    const dropdownContent = (_jsxs("div", { className: "relative inline-block text-left", ref: dropdownRef, children: [_jsx("div", { children: _jsxs("button", { type: "button", disabled: isButtonDisabled, onClick: () => setIsDropdownOpen(!isDropdownOpen), className: `${isButtonDisabled ? " bg-opacity-25 " : ""} ${loading
                        ? " cursor-progress"
                        : `${isButtonDisabled ? "" : `hover:${color.bg700}`}`} inline-flex justify-center items-center rounded-md border border-transparent ${color.bg600} py-2 px-4 text-sm font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:${color.ring500} focus:ring-offset-2 ${className}`, children: [loading
                            ? children ?? loadingText
                            : children ?? dropdownTitle ?? title, _jsx("svg", { className: `ml-2 -mr-1 h-4 w-4 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`, xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 20 20", fill: "currentColor", children: _jsx("path", { fillRule: "evenodd", d: "M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z", clipRule: "evenodd" }) })] }) }), isDropdownOpen && (_jsx("div", { className: "absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none", children: _jsx("div", { className: "py-1", children: dropdownOptions.map((option, index) => (_jsx("button", { type: "button", onClick: () => {
                            option.onClick();
                            setIsDropdownOpen(false);
                        }, className: "block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 text-left", children: option.label }, index))) }) }))] }));
    return (_jsxs(_Fragment, { children: [(enableFormErrorsValidation && formHasErrors && errorMessage) ||
                (enableFormErrorsDescriptions && errorMessage) ? (_jsx("div", { className: "flex flex-col items-end mb-2", children: _jsx("div", { className: "p-2 bg-red-100 border border-red-400 text-red-700 rounded-md shadow-sm", children: _jsx("p", { className: "text-sm", children: errorMessage }) }) })) : null, dropdownContent] }));
};
