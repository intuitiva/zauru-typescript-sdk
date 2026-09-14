import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export const SearchFiltersSummary = ({ items, emptyText = "Sin filtros registrados", className = "", }) => {
    if (!items?.length) {
        return (_jsx("p", { className: `text-xs text-gray-400 ${className}`, children: emptyText }));
    }
    return (_jsx("dl", { className: `flex flex-col gap-1 text-xs text-gray-700 ${className}`, children: items.map((item) => (_jsxs("div", { className: "flex flex-wrap items-baseline gap-x-1", children: [_jsxs("dt", { className: "font-semibold text-gray-500", children: [item.label, ":"] }), _jsx("dd", { className: "text-gray-800", children: item.value })] }, item.key))) }));
};
