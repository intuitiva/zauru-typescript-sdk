"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FormDatePicker = exports.FormDatePickerWithoutValidation = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const icons_1 = require("@zauru-sdk/icons");
const redux_1 = require("@zauru-sdk/redux");
const FormDatePickerWithoutValidation = (props) => {
    const { id, name, title, defaultValue = "", hint, helpText, onChange, tabIndex, error, disabled = false, className = "", isClearable = false, } = props;
    const [value, setValue] = (0, react_1.useState)(defaultValue);
    const [showTooltip, setShowTooltip] = (0, react_1.useState)(false);
    const color = error ? "red" : "gray";
    const isReadOnly = disabled;
    const bgColor = isReadOnly ? "bg-gray-200" : `bg-${color}-50`;
    const textColor = isReadOnly ? "text-gray-500" : `text-${color}-500`;
    const borderColor = isReadOnly ? "border-gray-300" : `border-${color}-200`;
    (0, react_1.useEffect)(() => {
        setValue(defaultValue);
    }, [defaultValue]);
    const clearValue = () => {
        setValue("");
        onChange && onChange("");
    };
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [title && ((0, jsx_runtime_1.jsx)("label", { htmlFor: error ? `${name}-error` : `${name}-success`, className: `block text-sm font-medium ${textColor} ${className}`, children: title })), (0, jsx_runtime_1.jsxs)("div", { className: "flex relative items-center", children: [(0, jsx_runtime_1.jsx)("div", { className: "absolute left-0 flex items-center pl-3 pointer-events-none", children: (0, jsx_runtime_1.jsx)(icons_1.CalendarIconSVG, {}) }), (0, jsx_runtime_1.jsx)("input", { id: id, name: name, tabIndex: tabIndex, type: "date", onChange: (e) => {
                            setValue(e.target.value);
                            onChange && onChange(e.target.value);
                        }, value: value ?? "", pattern: "\\d{4}-\\d{2}-\\d{2}", className: `${bgColor} ${borderColor} ${textColor} text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5` }), value && isClearable && ((0, jsx_runtime_1.jsx)("button", { type: "button", onClick: clearValue, className: "absolute right-0 mr-10", children: (0, jsx_runtime_1.jsx)(icons_1.CloseSvgIcon, {}) })), helpText && ((0, jsx_runtime_1.jsx)("div", { className: "flex items-center relative ml-3", children: (0, jsx_runtime_1.jsxs)("div", { className: "relative cursor-pointer", onMouseEnter: () => setShowTooltip(true), onMouseLeave: () => setShowTooltip(false), children: [(0, jsx_runtime_1.jsx)(icons_1.IdeaIconSVG, {}), showTooltip && ((0, jsx_runtime_1.jsx)("div", { className: "absolute -left-48 top-0 mt-8 p-2 bg-white border rounded shadow text-black", children: helpText }))] }) }))] }), error && ((0, jsx_runtime_1.jsxs)("p", { className: `mt-2 text-sm text-${color}-600 dark:text-${color}-500`, children: [(0, jsx_runtime_1.jsx)("span", { className: "font-medium", children: "Oops!" }), " ", error] })), !error && hint && ((0, jsx_runtime_1.jsx)("p", { className: `mt-2 italic text-sm text-${color}-500 dark:text-${color}-400`, children: hint }))] }));
};
exports.FormDatePickerWithoutValidation = FormDatePickerWithoutValidation;
const FormDatePicker = (props) => {
    const { formValidations } = (0, redux_1.useAppSelector)((state) => state.formValidation);
    const error = formValidations[props.formName ?? "-1"]?.[props.name ?? "-1"];
    props = { ...props, error };
    return (0, jsx_runtime_1.jsx)(exports.FormDatePickerWithoutValidation, { ...props });
};
exports.FormDatePicker = FormDatePicker;
