import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { isAutomaticRejectionRuleHistoryType, toFixedIfNeeded, } from "@zauru-sdk/common";
const formatHistoryDate = (value) => {
    if (!value)
        return "";
    const date = new Date(value);
    if (Number.isNaN(date.getTime()))
        return value;
    return new Intl.DateTimeFormat("es-GT", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
    })
        .format(date)
        .replace(",", "");
};
const formatSignedPercentage = (value, forceSign) => {
    const formatted = toFixedIfNeeded(Math.abs(value));
    if (value < 0)
        return `-${formatted}%`;
    if (forceSign && value > 0)
        return `+${formatted}%`;
    return `${formatted}%`;
};
const findName = (records, id) => {
    if (id == null)
        return undefined;
    return records?.find((record) => record.id === id)?.name;
};
export const RejectionPercentageHistoryList = ({ items, employees, agencies, actorLabel = "Empleado", emptyText = "No hay historial de porcentajes registrado", className = "", }) => {
    if (!items.length) {
        return _jsx("p", { className: "text-gray-500 italic", children: emptyText });
    }
    return (_jsx("div", { className: `space-y-3 max-h-60 overflow-y-auto ${className}`.trim(), children: items.map((item, index) => {
            const isAutomatic = isAutomaticRejectionRuleHistoryType(item.type);
            const isSuccessive = item.successive === true;
            const employeeName = item.employee_name?.trim() ||
                findName(employees, item.employee_id) ||
                (item.employee_id != null ? `ID: ${item.employee_id}` : "No especificado");
            const agencyName = findName(agencies, item.agency_id) ||
                (item.agency_id != null ? `ID: ${item.agency_id}` : "No especificada");
            const description = item.description || "Sin descripción";
            const observations = item.observations?.trim() ?? "";
            const noteClassName = isSuccessive
                ? "text-sm text-amber-900 mb-1"
                : isAutomatic
                    ? "text-sm text-indigo-900 mb-1"
                    : "text-sm text-gray-700 mb-1";
            return (_jsxs("div", { className: isSuccessive
                    ? "border border-amber-200 rounded-lg p-3 bg-amber-50"
                    : isAutomatic
                        ? "border border-indigo-200 rounded-lg p-3 bg-indigo-50"
                        : "border border-gray-100 rounded-lg p-3 bg-gray-50", children: [_jsxs("div", { className: "flex justify-between items-start gap-3 mb-2", children: [_jsxs("div", { className: "flex items-center gap-2 min-w-0", children: [_jsx("span", { className: isSuccessive
                                            ? "font-semibold text-amber-800"
                                            : isAutomatic
                                                ? "font-semibold text-indigo-800"
                                                : "font-semibold text-blue-600", children: formatSignedPercentage(Number(item.discount) || 0, isAutomatic) }), isSuccessive ? (_jsx("span", { className: "shrink-0 whitespace-nowrap rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800", children: "Sucesivo" })) : null, isAutomatic ? (_jsx("span", { className: "shrink-0 whitespace-nowrap rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-medium text-indigo-800", children: "Autom\u00E1tico" })) : null] }), item.created_at ? (_jsx("span", { className: "text-xs text-gray-500 shrink-0", children: formatHistoryDate(item.created_at) })) : null] }), _jsx("p", { className: noteClassName, title: description, children: description }), observations ? (_jsxs("p", { className: `${noteClassName} break-words whitespace-pre-wrap`, children: [_jsx("span", { className: "font-medium", children: "Motivo: " }), observations] })) : null, _jsxs("div", { className: "flex justify-between gap-3 text-xs text-gray-500", children: [_jsx("span", { className: "min-w-0", children: isAutomatic
                                    ? "Aplicado por el sistema"
                                    : `${actorLabel}: ${employeeName}` }), _jsxs("span", { className: "shrink-0", children: ["Agencia: ", agencyName] })] })] }, `${item.created_at ?? "entry"}-${item.type ?? "manual"}-${index}`));
        }) }));
};
