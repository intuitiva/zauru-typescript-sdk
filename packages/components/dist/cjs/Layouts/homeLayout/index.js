"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HomeLayout = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("@remix-run/react");
const HomeLayout = ({ title, description, loading, color = "green", }) => {
    const getColorClasses = (shade) => {
        switch (color) {
            case "blue":
                return `bg-blue-${shade}`;
            case "red":
                return `bg-red-${shade}`;
            case "purple":
                return `bg-purple-${shade}`;
            case "yellow":
                return `bg-yellow-${shade}`;
            default:
                return `bg-green-${shade}`;
        }
    };
    const getGradientClasses = () => {
        switch (color) {
            case "blue":
                return "from-blue-100 to-blue-200";
            case "red":
                return "from-red-100 to-red-200";
            case "purple":
                return "from-purple-100 to-purple-200";
            case "yellow":
                return "from-yellow-100 to-yellow-200";
            default:
                return "from-green-100 to-green-200";
        }
    };
    const getButtonClasses = () => {
        switch (color) {
            case "blue":
                return "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500";
            case "red":
                return "bg-red-600 hover:bg-red-700 focus:ring-red-500";
            case "purple":
                return "bg-purple-600 hover:bg-purple-700 focus:ring-purple-500";
            case "yellow":
                return "bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500";
            default:
                return "bg-green-600 hover:bg-green-700 focus:ring-green-500";
        }
    };
    return ((0, jsx_runtime_1.jsxs)("div", { className: `min-h-screen bg-gradient-to-br ${getGradientClasses()} flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden`, children: [(0, jsx_runtime_1.jsx)("div", { className: `absolute top-0 left-0 w-64 h-64 ${getColorClasses(500)} rounded-full -translate-x-1/2 -translate-y-1/2 opacity-50` }), (0, jsx_runtime_1.jsx)("div", { className: `absolute bottom-0 right-0 w-96 h-96 ${getColorClasses(600)} rounded-full translate-x-1/3 translate-y-1/3 opacity-40` }), (0, jsx_runtime_1.jsx)("div", { className: `absolute top-1/2 left-1/4 w-48 h-48 ${getColorClasses(400)} rounded-full opacity-30` }), (0, jsx_runtime_1.jsx)("div", { className: `absolute top-1/3 right-1/4 w-32 h-32 ${getColorClasses(500)} rounded-full opacity-25` }), (0, jsx_runtime_1.jsx)("div", { className: `absolute bottom-1/4 left-1/3 w-40 h-40 ${getColorClasses(400)} rounded-full opacity-20` }), (0, jsx_runtime_1.jsx)("div", { className: `absolute top-3/4 right-1/2 w-24 h-24 ${getColorClasses(600)} rounded-full opacity-15` }), (0, jsx_runtime_1.jsxs)("div", { className: "sm:mx-auto sm:w-full sm:max-w-md relative z-10", children: [(0, jsx_runtime_1.jsx)("img", { className: "mx-auto h-12 w-auto", src: "/logo.png", alt: "Zauru Logo" }), (0, jsx_runtime_1.jsx)("h2", { className: "mt-6 text-center text-3xl font-extrabold text-gray-900", children: title ?? "Bienvenido" }), (0, jsx_runtime_1.jsx)("p", { className: "mt-2 text-center text-sm text-gray-600", children: description ?? "Inicie sesión para acceder a su cuenta" })] }), loading ? ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, {})) : ((0, jsx_runtime_1.jsx)("div", { className: "mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10", children: (0, jsx_runtime_1.jsx)("div", { className: "bg-white bg-opacity-90 py-8 px-4 shadow-lg sm:rounded-lg sm:px-10", children: (0, jsx_runtime_1.jsx)(react_1.Form, { className: "space-y-6", method: "post", action: "/login", children: (0, jsx_runtime_1.jsx)("div", { children: (0, jsx_runtime_1.jsx)("button", { type: "submit", className: `w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${getButtonClasses()} transition duration-150 ease-in-out`, children: "Inicie sesi\u00F3n con Zauru" }) }) }) }) }))] }));
};
exports.HomeLayout = HomeLayout;
