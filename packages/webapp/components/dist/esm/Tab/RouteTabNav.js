import { jsx as _jsx } from "react/jsx-runtime";
import { NavLink } from "@remix-run/react";
const ACTIVE = {
    indigo: "border-indigo-600 text-indigo-700",
    slate: "border-slate-700 text-slate-800",
    blue: "border-blue-600 text-blue-700",
    green: "border-green-600 text-green-700",
};
export const RouteTabNav = ({ items, ariaLabel = "Secciones", selectedColor = "indigo", }) => {
    const visible = items.filter((item) => !item.hide);
    if (visible.length === 0) {
        return null;
    }
    return (_jsx("nav", { "aria-label": ariaLabel, className: "border-b border-gray-200", children: _jsx("ul", { className: "flex flex-wrap gap-1 -mb-px", children: visible.map((item) => (_jsx("li", { children: _jsx(NavLink, { to: item.to, end: item.end, className: ({ isActive }) => [
                        "inline-flex items-center cursor-pointer rounded-t-md border-b-2 px-3 py-2 text-sm font-medium transition-colors duration-150",
                        "focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2",
                        isActive
                            ? ACTIVE[selectedColor]
                            : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-800",
                    ].join(" "), children: item.label }) }, item.to))) }) }));
};
