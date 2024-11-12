import { jsx as _jsx } from "react/jsx-runtime";
export const ButtonSectionContainer = (props) => {
    const { children, className, whitBg = false } = props;
    return (_jsx("div", { className: `${whitBg ? "bg-gray-50" : ""} px-4 py-3 text-right sm:px-6 ${className}`, children: children }));
};
