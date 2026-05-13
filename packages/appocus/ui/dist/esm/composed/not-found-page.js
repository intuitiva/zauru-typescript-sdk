import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link } from "react-router";
import { useAppocusConfig } from "@appocus/config";
import { Button } from "../primitives/button.js";
/**
 * Visual 404 page. Reads image and copy from the active `@appocus/config`.
 * Each app keeps its own route module (e.g. `app/pages/404.tsx`) that
 * exports the `loader` returning `new Response(null, { status: 404 })` and
 * the default export rendering this component.
 */
export function NotFoundPage({ homeTo = "/", loginTo = "/login", } = {}) {
    const { assets, copy } = useAppocusConfig();
    const c = copy.notFoundPage;
    return (_jsxs("div", { className: "min-h-screen flex flex-col items-center justify-center bg-linear-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4", children: [_jsx("div", { className: "mb-8", children: _jsx("img", { src: assets.notFound, alt: c.imageAlt, className: "w-full max-w-md mx-auto" }) }), _jsx("h1", { className: "text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-4", children: c.heading }), _jsx("p", { className: "text-lg text-gray-600 dark:text-gray-400 mb-8", children: c.description }), _jsxs("div", { className: "flex flex-col sm:flex-row gap-4 justify-center", children: [_jsx(Button, { asChild: true, size: "lg", children: _jsx(Link, { to: homeTo, children: c.homeCta }) }), _jsx(Button, { asChild: true, variant: "outline", size: "lg", children: _jsx(Link, { to: loginTo, children: c.loginCta }) })] }), _jsx("p", { className: "mt-8 text-sm text-gray-500 dark:text-gray-500", children: c.errorCode })] }));
}
