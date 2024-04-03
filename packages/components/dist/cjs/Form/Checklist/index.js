"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Checklist = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const index_js_1 = require("../Checkbox/index.js");
const Checklist = ({ items, onChange }) => {
    const handleCheckboxChange = (name, value) => {
        if (onChange) {
            onChange(name, value);
        }
    };
    return ((0, jsx_runtime_1.jsx)("div", { children: items.map((item) => ((0, jsx_runtime_1.jsx)(index_js_1.CheckboxWithoutValidation, { ...item, onChange: (value) => handleCheckboxChange(item.name, value) }, item.id))) }));
};
exports.Checklist = Checklist;
