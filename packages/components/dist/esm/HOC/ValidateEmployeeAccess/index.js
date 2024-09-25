import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useGetEmployeeProfile, useGetSessionAttribute, } from "@zauru-sdk/hooks";
import { Link } from "@remix-run/react";
export const ValidateEmployeeAccess = ({ children, permissionVariableName, showIfNoPermission = false, }) => {
    const { data: employee } = useGetEmployeeProfile();
    const variable_string = useGetSessionAttribute(permissionVariableName, "sessionVariable");
    const variable = variable_string?.split(",");
    const hasPermission = variable?.includes(employee?.id?.toString() || "-1");
    if (showIfNoPermission && !hasPermission) {
        return (_jsxs("div", { className: "bg-gray-900 text-white min-h-screen flex flex-col items-center justify-center p-4", children: [_jsx("img", { src: "/logo.png", alt: "Zauru Logo", className: "mb-8 h-20" }), _jsx("h1", { className: "text-5xl font-extrabold text-red-500 mb-6", children: "\u00A1Acceso Denegado!" }), _jsx("div", { className: "w-full max-w-2xl", children: _jsx("p", { className: "text-2xl text-gray-300 mb-8 text-center", children: "Lo sentimos, no tienes permiso para acceder a esta p\u00E1gina." }) }), _jsx(Link, { to: "/", className: "bg-blue-600 text-white py-3 px-8 rounded-full text-lg font-semibold hover:bg-blue-700 transition duration-300 transform hover:scale-105", children: "Regresar al inicio" }), _jsx("div", { className: "mt-12 text-gray-500", children: _jsx("p", { children: "Si crees que esto es un error, por favor contacta a soporte." }) })] }));
    }
    return _jsx(_Fragment, { children: hasPermission ? children : null });
};
