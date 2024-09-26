"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const framer_motion_1 = require("framer-motion");
// SVG icon for the left-pointing chevron
const ChevronLeftIcon = () => ((0, jsx_runtime_1.jsx)("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 24 24", fill: "currentColor", className: "h-6 w-6", children: (0, jsx_runtime_1.jsx)("path", { fillRule: "evenodd", d: "M7.72 12.53a.75.75 0 010-1.06l7.5-7.5a.75.75 0 111.06 1.06L9.31 12l6.97 6.97a.75.75 0 11-1.06 1.06l-7.5-7.5z", clipRule: "evenodd" }) }));
// SVG icon for the right-pointing chevron
const ChevronRightIcon = () => ((0, jsx_runtime_1.jsx)("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 24 24", fill: "currentColor", className: "h-6 w-6", children: (0, jsx_runtime_1.jsx)("path", { fillRule: "evenodd", d: "M16.28 11.47a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 01-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 011.06-1.06l7.5 7.5z", clipRule: "evenodd" }) }));
// SVG icon for the filter (bars filter icon)
const FilterIcon = () => ((0, jsx_runtime_1.jsx)("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 24 24", fill: "currentColor", className: "h-6 w-6", children: (0, jsx_runtime_1.jsx)("path", { fillRule: "evenodd", d: "M3 6a1 1 0 011-1h16a1 1 0 110 2H4a1 1 0 01-1-1zm0 6a1 1 0 011-1h10a1 1 0 110 2H4a1 1 0 01-1-1zm0 6a1 1 0 011-1h4a1 1 0 110 2H4a1 1 0 01-1-1z", clipRule: "evenodd" }) }));
const SidePanel = ({ children, closeOnClickOutside = true, widthPercentage = 25, buttonIcon = "chevron", }) => {
    const [isOpen, setIsOpen] = (0, react_1.useState)(false);
    const panelRef = (0, react_1.useRef)(null);
    const togglePanel = () => {
        setIsOpen(!isOpen);
    };
    (0, react_1.useEffect)(() => {
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
                    return isOpen ? (0, jsx_runtime_1.jsx)(ChevronRightIcon, {}) : (0, jsx_runtime_1.jsx)(ChevronLeftIcon, {});
                case "filter":
                    return (0, jsx_runtime_1.jsx)(FilterIcon, {});
                default:
                    return (0, jsx_runtime_1.jsx)(ChevronLeftIcon, {});
            }
        }
        else {
            return buttonIcon;
        }
    };
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsxs)(framer_motion_1.motion.div, { ref: panelRef, initial: { x: "100%" }, animate: { x: isOpen ? 0 : "100%" }, transition: { type: "spring", stiffness: 300, damping: 30 }, className: `fixed top-0 right-0 h-full bg-white shadow-lg z-[9999] overflow-y-auto`, style: { width: `${widthPercentage}%` }, children: [(0, jsx_runtime_1.jsx)("button", { onClick: togglePanel, className: "absolute top-4 left-4 p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors", children: (0, jsx_runtime_1.jsx)(ChevronRightIcon, {}) }), (0, jsx_runtime_1.jsx)("div", { className: "p-6 mt-16", children: children })] }), (0, jsx_runtime_1.jsx)(framer_motion_1.AnimatePresence, { children: !isOpen && ((0, jsx_runtime_1.jsx)(framer_motion_1.motion.button, { initial: { opacity: 0, x: 20 }, animate: { opacity: 1, x: 0 }, exit: { opacity: 0, x: 20 }, transition: { duration: 0.2 }, onClick: togglePanel, className: `fixed top-1/2 right-0 transform -translate-y-1/2 bg-indigo-600 text-white p-3 rounded-l-lg shadow-md hover:bg-indigo-700 transition-colors z-[10000]`, children: renderIcon() })) })] }));
};
exports.default = SidePanel;
