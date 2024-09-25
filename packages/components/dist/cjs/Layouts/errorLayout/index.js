"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorLayout = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("@remix-run/react");
const ErrorLayout = () => {
    const error = (0, react_1.useRouteError)();
    return ((0, jsx_runtime_1.jsxs)("html", { lang: "es", className: "bg-gray-900 text-white", children: [(0, jsx_runtime_1.jsxs)("head", { children: [(0, jsx_runtime_1.jsx)("meta", { charSet: "utf-8" }), (0, jsx_runtime_1.jsx)("meta", { name: "viewport", content: "width=device-width, initial-scale=1" }), (0, jsx_runtime_1.jsx)("title", { children: "\u00A1Ups! Algo sali\u00F3 mal" }), (0, jsx_runtime_1.jsx)(react_1.Meta, {}), (0, jsx_runtime_1.jsx)(react_1.Links, {})] }), (0, jsx_runtime_1.jsxs)("body", { className: "min-h-screen flex flex-col items-center justify-center p-4", children: [(0, jsx_runtime_1.jsx)("img", { src: "/logo.png", alt: "Zauru Logo", className: "mb-8 h-20" }), (0, jsx_runtime_1.jsx)("h1", { className: "text-5xl font-extrabold text-red-500 mb-6", children: "\u00A1Ups!" }), (0, jsx_runtime_1.jsx)("div", { className: "w-full max-w-2xl", children: (0, jsx_runtime_1.jsx)("p", { className: "text-2xl text-gray-300 mb-8 text-center", children: (0, react_1.isRouteErrorResponse)(error)
                                ? `Error ${error.status}: ${error.statusText}`
                                : error instanceof Error
                                    ? error.message
                                    : "Ha ocurrido un error inesperado" }) }), (0, jsx_runtime_1.jsx)(react_1.Link, { to: "/", className: "bg-blue-600 text-white py-3 px-8 rounded-full text-lg font-semibold hover:bg-blue-700 transition duration-300 transform hover:scale-105", children: "Regresar al inicio" }), (0, jsx_runtime_1.jsx)("div", { className: "mt-12 text-gray-500", children: (0, jsx_runtime_1.jsx)("p", { children: "Si el problema persiste, por favor contacta a soporte." }) }), (0, jsx_runtime_1.jsx)(react_1.Scripts, {})] })] }));
};
exports.ErrorLayout = ErrorLayout;
