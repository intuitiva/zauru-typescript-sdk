import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { isRouteErrorResponse, Links, Meta, Scripts, useRouteError, Link, } from "@remix-run/react";
import { useState } from "react";
export const ErrorLayout = ({ from, error: parentError, }) => {
    try {
        const error = useRouteError();
        const [showDetails, setShowDetails] = useState(!!parentError);
        return (_jsxs("html", { lang: "es", className: "bg-gray-900 text-white", children: [_jsxs("head", { children: [_jsx("meta", { charSet: "utf-8" }), _jsx("meta", { name: "viewport", content: "width=device-width, initial-scale=1" }), _jsx("title", { children: "\u00A1Ups! Algo sali\u00F3 mal" }), _jsx(Meta, {}), _jsx(Links, {})] }), _jsxs("body", { className: "min-h-screen flex flex-col items-center justify-center p-4", children: [_jsx("img", { src: "/logo.png", alt: "Zauru Logo", className: "mb-8 h-20" }), _jsx("h1", { className: "text-5xl font-extrabold text-red-500 mb-6", children: "\u00A1Ups!" }), _jsxs("div", { className: "w-full max-w-2xl flex flex-col items-center", children: [_jsx("p", { className: "text-2xl text-gray-300 mb-8 text-center", children: isRouteErrorResponse(error)
                                        ? `Error ${error.status}: ${error.statusText}`
                                        : error instanceof Error
                                            ? error.message
                                            : "Ha ocurrido un error inesperado" }), from && (_jsxs("p", { className: "text-lg text-gray-400 mb-4 text-center", children: ["Error lanzado desde: ", from] })), parentError && (_jsxs("div", { className: "mb-4 text-center", children: [_jsx("button", { onClick: () => setShowDetails(!showDetails), className: "text-blue-400 hover:text-blue-300 transition duration-300", children: showDetails ? "Ocultar detalles" : "Ver más detalles" }), showDetails && (_jsx("p", { className: "mt-2 text-gray-400 text-sm", children: parentError instanceof Error
                                                ? parentError.message
                                                : String(parentError) }))] }))] }), _jsx(Link, { to: "/", className: "bg-blue-600 text-white py-3 px-8 rounded-full text-lg font-semibold hover:bg-blue-700 transition duration-300 transform hover:scale-105", children: "Regresar al inicio" }), _jsx("div", { className: "mt-12 text-gray-500 text-center", children: _jsx("p", { children: "Si el problema persiste, por favor contacta a soporte." }) }), _jsx(Scripts, {})] })] }));
    }
    catch (error) {
        console.error(error);
        return (_jsxs("html", { lang: "es", className: "bg-gray-900 text-white", children: [_jsx("head", { children: _jsx("title", { children: "\u00A1Ups! Algo sali\u00F3 mal" }) }), _jsxs("body", { children: ["Error al renderizar el layout de error ", error] })] }));
    }
};
