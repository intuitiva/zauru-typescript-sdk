import { jsx as _jsx } from "react/jsx-runtime";
import { CheckBox } from "../Checkbox/index.js";
export const Checklist = ({ items, onChange }) => {
    const handleCheckboxChange = (name, value) => {
        if (onChange) {
            onChange(name, value);
        }
    };
    return (_jsx("div", { children: items.map((item) => (_jsx(CheckBox, { ...item, onChange: (value) => handleCheckboxChange(item.name, value) }, item.id))) }));
};
