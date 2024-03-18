import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useRef, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { ExitSvg } from "../Icons/Icons";
import { AnimatePresence, motion } from "framer-motion";
const Alert = ({ type, title, description, onClose }) => {
    const [, setLifetime] = useState(4000);
    const [progress, setProgress] = useState(0);
    const intervalRef = useRef(null);
    const getColor = () => {
        switch (type) {
            case "success":
                return "bg-green-100 text-green-800";
            case "error":
                return "bg-red-100 text-red-800";
            case "info":
                return "bg-blue-100 text-blue-800";
            case "warning":
                return "bg-yellow-100 text-yellow-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };
    useEffect(() => {
        const startTimer = () => {
            intervalRef.current = setInterval(() => {
                setLifetime((lifetime) => {
                    if (lifetime <= 0) {
                        onClose && onClose();
                        clearInterval(intervalRef.current);
                        return 0;
                    }
                    else {
                        setProgress((4000 - lifetime) / 4000);
                        return lifetime - 50;
                    }
                });
            }, 50);
        };
        const pauseTimer = () => {
            clearInterval(intervalRef.current);
        };
        startTimer();
        return () => {
            pauseTimer();
        };
    }, [onClose]);
    return (_jsxs(motion.div, { initial: { y: -50, opacity: 0 }, animate: { y: 0, opacity: 1 }, exit: { y: -50, opacity: 0 }, className: `fixed top-0 right-0 w-80 mt-10 mr-10 rounded-md shadow-lg ${getColor()} p-4 transition-transform duration-300`, style: {
            zIndex: 1000,
            transform: `translateY(calc(var(--alert-offset, 0)))`,
        }, onMouseEnter: () => clearInterval(intervalRef.current), onMouseLeave: () => {
            intervalRef.current = setInterval(() => {
                setLifetime((lifetime) => {
                    if (lifetime <= 0) {
                        onClose && onClose();
                        clearInterval(intervalRef.current);
                        return 0;
                    }
                    else {
                        setProgress((4000 - lifetime) / 4000);
                        return lifetime - 50;
                    }
                });
            }, 50);
        }, children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("h3", { className: "font-semibold", children: title }), _jsx("button", { className: "text-gray-400 hover:text-gray-500 focus:outline-none focus:text-gray-500 transition duration-150 ease-in-out", onClick: () => {
                            setLifetime(0);
                            onClose && onClose();
                        }, children: _jsx(ExitSvg, {}) })] }), _jsx("div", { className: "mt-2", children: _jsx("p", { className: "text-sm overflow-wrap break-words", children: description }) }), _jsx("div", { className: "relative h-1 mt-4 bg-gray-200 rounded", children: _jsx("div", { className: `absolute left-0 top-0 h-full ${getColor()} rounded`, style: { width: `${progress * 100}%` } }) })] }));
};
let activeAlerts = [];
export const showAlert = (alertProps) => {
    if (typeof document === "undefined") {
        return;
    }
    const container = document.createElement("div");
    document.body.appendChild(container);
    const onClose = () => {
        root.unmount();
        container.remove();
        activeAlerts = activeAlerts.filter((alert) => alert !== container);
        updateAlertOffsets();
    };
    const asyncOnClose = () => {
        setTimeout(() => {
            onClose();
        }, 0);
    };
    activeAlerts.push(container);
    updateAlertOffsets();
    const root = createRoot(container);
    root.render(_jsx(AnimatePresence, { children: _jsx(Alert, { ...alertProps, onClose: asyncOnClose }) }));
};
const updateAlertOffsets = () => {
    activeAlerts.forEach((alertContainer, index) => {
        alertContainer.style.setProperty("--alert-offset", `${index * 100}px`);
    });
};
