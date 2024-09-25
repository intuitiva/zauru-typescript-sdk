"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidateEmployeeAccess = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const hooks_1 = require("@zauru-sdk/hooks");
const react_1 = require("@remix-run/react");
const ValidateEmployeeAccess = ({ children, permissionVariableName, showIfNoPermission = false, }) => {
    const { data: employee } = (0, hooks_1.useGetEmployeeProfile)();
    const variable_string = (0, hooks_1.useGetSessionAttribute)(permissionVariableName, "sessionVariable");
    const variable = variable_string?.split(",");
    const hasPermission = variable?.includes(employee?.id?.toString() || "-1");
    if (showIfNoPermission && !hasPermission) {
        return ((0, jsx_runtime_1.jsxs)("div", { className: "bg-gray-900 text-white min-h-screen flex flex-col items-center justify-center p-4", children: [(0, jsx_runtime_1.jsx)("img", { src: "/logo.png", alt: "Zauru Logo", className: "mb-8 h-20" }), (0, jsx_runtime_1.jsx)("h1", { className: "text-5xl font-extrabold text-red-500 mb-6", children: "\u00A1Acceso Denegado!" }), (0, jsx_runtime_1.jsx)("div", { className: "w-full max-w-2xl", children: (0, jsx_runtime_1.jsx)("p", { className: "text-2xl text-gray-300 mb-8 text-center", children: "Lo sentimos, no tienes permiso para acceder a esta p\u00E1gina." }) }), (0, jsx_runtime_1.jsx)(react_1.Link, { to: "/", className: "bg-blue-600 text-white py-3 px-8 rounded-full text-lg font-semibold hover:bg-blue-700 transition duration-300 transform hover:scale-105", children: "Regresar al inicio" }), (0, jsx_runtime_1.jsx)("div", { className: "mt-12 text-gray-500", children: (0, jsx_runtime_1.jsx)("p", { children: "Si crees que esto es un error, por favor contacta a soporte." }) })] }));
    }
    return (0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: hasPermission ? children : null });
};
exports.ValidateEmployeeAccess = ValidateEmployeeAccess;
