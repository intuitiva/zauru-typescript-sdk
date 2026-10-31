import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect, useId, useRef, } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
// SVG icon for the left-pointing chevron
const ChevronLeftIcon = () => (_jsx("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 24 24", fill: "currentColor", className: "h-6 w-6", "aria-hidden": "true", focusable: "false", children: _jsx("path", { fillRule: "evenodd", d: "M7.72 12.53a.75.75 0 010-1.06l7.5-7.5a.75.75 0 111.06 1.06L9.31 12l6.97 6.97a.75.75 0 11-1.06 1.06l-7.5-7.5z", clipRule: "evenodd" }) }));
// SVG icon for the right-pointing chevron
const ChevronRightIcon = () => (_jsx("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 24 24", fill: "currentColor", className: "h-6 w-6", "aria-hidden": "true", focusable: "false", children: _jsx("path", { fillRule: "evenodd", d: "M16.28 11.47a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 01-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 011.06-1.06l7.5 7.5z", clipRule: "evenodd" }) }));
// SVG icon for the filter (bars filter icon)
const FilterIcon = () => (_jsx("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 24 24", fill: "currentColor", className: "h-6 w-6", "aria-hidden": "true", focusable: "false", children: _jsx("path", { fillRule: "evenodd", d: "M3 6a1 1 0 011-1h16a1 1 0 110 2H4a1 1 0 01-1-1zm0 6a1 1 0 011-1h10a1 1 0 110 2H4a1 1 0 01-1-1zm0 6a1 1 0 011-1h4a1 1 0 110 2H4a1 1 0 01-1-1z", clipRule: "evenodd" }) }));
export const SidePanel = ({ children, closeOnClickOutside = true, widthPercentage = 25, buttonIcon = "chevron", ariaLabel = "Panel lateral", openButtonLabel = "Abrir panel", closeButtonLabel = "Cerrar panel", }) => {
    const [isOpen, setIsOpen] = useState(false);
    const panelRef = useRef(null);
    const closeButtonRef = useRef(null);
    const triggerButtonRef = useRef(null);
    const wasOpenRef = useRef(false);
    const panelId = useId();
    const shouldReduceMotion = useReducedMotion();
    const togglePanel = () => {
        setIsOpen((open) => !open);
    };
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (isOpen &&
                closeOnClickOutside &&
                panelRef.current &&
                !panelRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [closeOnClickOutside, isOpen]);
    useEffect(() => {
        if (!isOpen)
            return;
        const handleEscape = (event) => {
            if (event.key === "Escape")
                setIsOpen(false);
        };
        document.addEventListener("keydown", handleEscape);
        return () => document.removeEventListener("keydown", handleEscape);
    }, [isOpen]);
    useEffect(() => {
        if (isOpen)
            panelRef.current?.removeAttribute("inert");
        else
            panelRef.current?.setAttribute("inert", "");
    }, [isOpen]);
    useEffect(() => {
        if (isOpen) {
            wasOpenRef.current = true;
            closeButtonRef.current?.focus();
            const previousOverflow = document.body.style.overflow;
            if (window.matchMedia("(max-width: 767px)").matches) {
                document.body.style.overflow = "hidden";
            }
            return () => {
                document.body.style.overflow = previousOverflow;
            };
        }
        if (wasOpenRef.current) {
            wasOpenRef.current = false;
            triggerButtonRef.current?.focus();
        }
    }, [isOpen]);
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
    return (_jsxs(_Fragment, { children: [_jsxs(motion.div, { id: panelId, ref: panelRef, role: "dialog", "aria-modal": isOpen ? "true" : undefined, "aria-label": ariaLabel, "aria-hidden": !isOpen, initial: { x: "100%" }, animate: { x: isOpen ? 0 : "100%" }, transition: shouldReduceMotion
                    ? { duration: 0 }
                    : { type: "spring", stiffness: 300, damping: 30 }, className: "fixed right-0 top-0 z-[9999] h-full w-[calc(100%-1rem)] overflow-y-auto bg-white shadow-lg sm:w-[min(28rem,calc(100%-2rem))] md:w-[var(--side-panel-width)]", style: {
                    "--side-panel-width": `${widthPercentage}%`,
                }, children: [_jsx("button", { ref: closeButtonRef, type: "button", onClick: togglePanel, "aria-label": closeButtonLabel, className: "absolute left-4 top-4 min-h-11 min-w-11 cursor-pointer rounded-full bg-gray-200 p-2 transition-colors hover:bg-gray-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 md:min-h-0 md:min-w-0", children: _jsx(ChevronRightIcon, {}) }), _jsx("div", { className: "mt-16 p-4 sm:p-6", children: children })] }), _jsxs(AnimatePresence, { children: [isOpen && closeOnClickOutside ? (_jsx(motion.button, { type: "button", "aria-label": closeButtonLabel, initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, transition: { duration: shouldReduceMotion ? 0 : 0.15 }, onClick: () => setIsOpen(false), className: "fixed inset-0 z-[9998] cursor-default bg-black/30 md:hidden" })) : null, !isOpen && (_jsx(motion.button, { ref: triggerButtonRef, type: "button", "aria-label": openButtonLabel, "aria-expanded": isOpen, "aria-controls": panelId, initial: { opacity: 0, x: 20 }, animate: { opacity: 1, x: 0 }, exit: { opacity: 0, x: 20 }, transition: { duration: shouldReduceMotion ? 0 : 0.2 }, onClick: togglePanel, className: "fixed right-0 top-1/2 z-[10000] min-h-11 min-w-11 -translate-y-1/2 cursor-pointer rounded-l-lg bg-indigo-600 p-3 text-white shadow-md transition-colors hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2", children: renderIcon() }))] })] }));
};
