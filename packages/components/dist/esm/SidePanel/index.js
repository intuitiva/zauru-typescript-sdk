import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
// SVG icon for the left-pointing chevron
const ChevronLeftIcon = () => (_jsx("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 24 24", fill: "currentColor", className: "h-6 w-6", children: _jsx("path", { fillRule: "evenodd", d: "M7.72 12.53a.75.75 0 010-1.06l7.5-7.5a.75.75 0 111.06 1.06L9.31 12l6.97 6.97a.75.75 0 11-1.06 1.06l-7.5-7.5z", clipRule: "evenodd" }) }));
// SVG icon for the right-pointing chevron
const ChevronRightIcon = () => (_jsx("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 24 24", fill: "currentColor", className: "h-6 w-6", children: _jsx("path", { fillRule: "evenodd", d: "M16.28 11.47a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 01-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 011.06-1.06l7.5 7.5z", clipRule: "evenodd" }) }));
// SVG icon for the filter (bars filter icon)
const FilterIcon = () => (_jsx("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 24 24", fill: "currentColor", className: "h-6 w-6", children: _jsx("path", { fillRule: "evenodd", d: "M3 6a1 1 0 011-1h16a1 1 0 110 2H4a1 1 0 01-1-1zm0 6a1 1 0 011-1h10a1 1 0 110 2H4a1 1 0 01-1-1zm0 6a1 1 0 011-1h4a1 1 0 110 2H4a1 1 0 01-1-1z", clipRule: "evenodd" }) }));
const SidePanel = ({ children, closeOnClickOutside = true, widthPercentage = 25, buttonIcon = "chevron", }) => {
    const [isOpen, setIsOpen] = useState(false);
    const panelRef = useRef(null);
    const togglePanel = () => {
        setIsOpen(!isOpen);
    };
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (closeOnClickOutside &&
                panelRef.current &&
                !panelRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [closeOnClickOutside]);
    const renderIcon = () => {
        if (typeof buttonIcon === "string") {
            switch (buttonIcon) {
                case "chevron":
                    return isOpen ? _jsx(ChevronRightIcon, {}) : _jsx(ChevronLeftIcon, {});
                case "filter":
                    return _jsx(FilterIcon, {});
                default:
                    return _jsx(ChevronLeftIcon, {});
            }
        }
        else {
            return buttonIcon;
        }
    };
    return (_jsxs(_Fragment, { children: [_jsx(AnimatePresence, { children: isOpen && (_jsxs(motion.div, { ref: panelRef, initial: { x: "100%" }, animate: { x: 0 }, exit: { x: "100%" }, transition: { type: "spring", stiffness: 300, damping: 30 }, className: "fixed top-0 right-0 h-full bg-white shadow-lg z-[9999] overflow-y-auto", style: { width: `${widthPercentage}%` }, children: [_jsx("button", { onClick: togglePanel, className: "absolute top-4 left-4 p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors", children: _jsx(ChevronRightIcon, {}) }), _jsx("div", { className: "p-6 mt-16", children: children })] })) }), !isOpen && (_jsx("button", { onClick: togglePanel, className: "fixed top-1/2 right-0 transform -translate-y-1/2 bg-indigo-600 text-white p-3 rounded-l-lg shadow-md hover:bg-indigo-700 transition-colors z-[10000]", children: renderIcon() }))] }));
};
export default SidePanel;
