import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
export const LoadingWindow = ({ loadingItems = [], description = "Por favor, espere mientras se carga la página.", }) => {
    const [hasMounted, setHasMounted] = useState(false);
    useEffect(() => {
        setHasMounted(true);
    }, []);
    if (!hasMounted) {
        return null;
    }
    return (_jsxs("div", { className: "min-h-screen bg-gray-200 flex flex-col justify-center items-center", children: [_jsxs(motion.div, { initial: { opacity: 0, y: -20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5 }, className: "text-center flex flex-col items-center", children: [_jsx("img", { src: "/logo.png", alt: "Zauru Logo", className: "mb-8 h-20" }), _jsx("h1", { className: "text-3xl font-bold text-gray-800 mb-4", children: loadingItems.some((x) => x.loading) ? "Cargando..." : "Cargado" }), _jsx("p", { className: "text-gray-600 mb-4", children: description }), loadingItems && (_jsx("ul", { className: "text-left mb-4", children: loadingItems.map((item, index) => (_jsxs("li", { className: "flex items-center mb-2", children: [_jsx("svg", { className: `${item.loading ? "" : "hidden"} w-5 h-5 text-blue-500 mr-2 animate-spin loading-spinner`, fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" }) }), _jsx("svg", { className: `${item.loading ? "hidden" : ""} w-5 h-5 text-green-500 mr-2 check-mark`, fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M5 13l4 4L19 7" }) }), _jsx("span", { children: item.name })] }, index))) }))] }), _jsx("div", { className: "flex flex-col items-center", children: loadingItems.some((x) => x.loading) ? (_jsx(motion.div, { animate: { rotate: 360 }, transition: { duration: 2, repeat: Infinity, ease: "linear" }, className: "mt-8", children: _jsx("svg", { className: "w-12 h-12 text-blue-500", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: _jsx(motion.path, { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15", animate: { rotate: 360 }, transition: { duration: 2, repeat: Infinity, ease: "linear" } }) }) })) : (_jsx("span", { className: "text-green-500", children: "\u2705" })) })] }));
};
export default LoadingWindow;
