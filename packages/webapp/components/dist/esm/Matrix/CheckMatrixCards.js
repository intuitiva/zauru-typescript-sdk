import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
export const CheckMatrixCards = ({ rows, columns, isChecked, isPending = () => false, onToggle, disabled = false, renderRowAction, checkedLabel = "Marcado", uncheckedLabel = "Sin marcar", pendingLabel = "Guardando…", emptyText = "No hay filas para mostrar.", pageSize = 20, showMoreLabel = "Mostrar más", className = "", }) => {
    const safePageSize = Math.max(1, pageSize);
    const [visibleCount, setVisibleCount] = useState(safePageSize);
    useEffect(() => {
        setVisibleCount(safePageSize);
    }, [rows, safePageSize]);
    if (rows.length === 0) {
        return _jsx("p", { className: `p-4 text-sm text-gray-600 ${className}`, children: emptyText });
    }
    const visibleRows = rows.slice(0, visibleCount);
    return (_jsxs("div", { className: `space-y-3 ${className}`, children: [visibleRows.map((row) => (_jsxs("fieldset", { className: "min-w-0 rounded-lg border border-gray-200 bg-white p-3 shadow-sm", children: [_jsxs("div", { className: "mb-3 flex min-w-0 items-start justify-between gap-3", children: [_jsxs("legend", { className: "min-w-0 flex-1 px-0 text-sm font-semibold text-gray-900", children: [_jsx("span", { className: "block break-words", children: row.label }), row.description ? (_jsx("span", { className: "mt-0.5 block break-words text-xs font-normal text-gray-600", children: row.description })) : null] }), renderRowAction ? (_jsx("div", { className: "shrink-0", children: renderRowAction(row) })) : null] }), _jsx("div", { className: "grid gap-2 sm:grid-cols-2", children: columns.map((column) => {
                            const checked = isChecked(row.key, column.key);
                            const pending = isPending(row.key, column.key);
                            const inputId = `check-matrix-${encodeURIComponent(row.key)}-${encodeURIComponent(column.key)}`;
                            return (_jsxs("label", { htmlFor: inputId, className: `flex min-h-11 cursor-pointer items-center gap-3 rounded-md border px-3 py-2 text-sm focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-1 ${checked
                                    ? "border-indigo-200 bg-indigo-50 text-indigo-950"
                                    : "border-gray-200 bg-gray-50 text-gray-800"} ${pending || disabled ? "cursor-not-allowed opacity-70" : "hover:border-indigo-300"}`, children: [_jsx("input", { id: inputId, type: "checkbox", checked: checked, disabled: disabled || pending, onChange: (event) => onToggle(row.key, column.key, event.target.checked), className: "h-5 w-5 shrink-0 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" }), _jsx("span", { className: "min-w-0 flex-1 break-words font-medium", children: column.label }), _jsx("span", { className: `shrink-0 text-xs font-medium ${checked ? "text-indigo-700" : "text-gray-600"}`, "aria-live": pending ? "polite" : undefined, children: pending
                                            ? pendingLabel
                                            : checked
                                                ? checkedLabel
                                                : uncheckedLabel })] }, column.key));
                        }) })] }, row.key))), visibleCount < rows.length ? (_jsxs("button", { type: "button", onClick: () => setVisibleCount((count) => count + safePageSize), className: "min-h-11 w-full cursor-pointer rounded-md border border-indigo-300 bg-white px-4 py-2 text-sm font-semibold text-indigo-700 hover:bg-indigo-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2", children: [showMoreLabel, " (", rows.length - visibleCount, ")"] })) : null] }));
};
