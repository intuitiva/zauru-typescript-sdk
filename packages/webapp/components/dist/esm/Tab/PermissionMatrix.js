import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
export function permissionMatrixCellKey(roleId, key) {
    return `${roleId}:${key}`;
}
const checkboxClass = "form-checkbox h-4 w-4 cursor-pointer rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 disabled:cursor-not-allowed disabled:opacity-50";
export const PermissionMatrix = ({ groups, roles, disabled = false, pendingCells, onToggle, onBulkRole, onBulkSection, emptyText = "Crea un rol para editar la matriz de permisos.", markAllLabel = "Marcar todo", unmarkAllLabel = "Desmarcar todo", }) => {
    const allKeys = groups.flatMap((group) => group.actions.map((action) => action.key));
    if (roles.length === 0) {
        return (_jsx("p", { className: "text-sm text-gray-600", role: "status", children: emptyText }));
    }
    const roleHasKeys = (role, keys) => keys.length > 0 && keys.every((key) => role.permissionKeys.includes(key));
    return (_jsx("div", { className: "overflow-x-auto rounded-md border border-gray-200", children: _jsxs("table", { className: "min-w-full border-collapse text-sm", children: [_jsx("caption", { className: "sr-only", children: "Matriz de permisos por rol. Filas son acciones, columnas son roles." }), _jsx("thead", { children: _jsxs("tr", { className: "bg-gray-50", children: [_jsx("th", { scope: "col", className: "sticky left-0 z-10 min-w-[16rem] border-b border-gray-200 bg-gray-50 px-3 py-2 text-left font-semibold text-gray-800", children: "Permiso" }), roles.map((role) => {
                                const allGranted = roleHasKeys(role, allKeys);
                                return (_jsx("th", { scope: "col", className: "min-w-[9rem] border-b border-l border-gray-200 px-3 py-2 text-center font-semibold text-gray-800", children: _jsxs("div", { className: "flex flex-col items-center gap-1", children: [_jsx("span", { className: "break-words", children: role.name }), onBulkRole ? (_jsx("button", { type: "button", className: "cursor-pointer text-xs font-medium text-indigo-700 hover:text-indigo-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded", disabled: disabled, onClick: () => onBulkRole(role.id, allGranted ? "none" : "all"), children: allGranted ? unmarkAllLabel : markAllLabel })) : null] }) }, role.id));
                            })] }) }), _jsx("tbody", { children: groups.map((group) => {
                        const sectionKeys = group.actions.map((action) => action.key);
                        return (_jsx(GroupRows, { group: group, roles: roles, sectionKeys: sectionKeys, disabled: disabled, pendingCells: pendingCells, onToggle: onToggle, onBulkSection: onBulkSection, checkboxClass: checkboxClass }, group.id));
                    }) })] }) }));
};
function GroupRows({ group, roles, sectionKeys, disabled, pendingCells, onToggle, onBulkSection, checkboxClass, }) {
    return (_jsxs(_Fragment, { children: [_jsx("tr", { className: "bg-slate-100", children: _jsx("th", { scope: "colgroup", colSpan: roles.length + 1, className: "sticky left-0 border-b border-gray-200 px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-700", children: group.label }) }), group.actions.map((action) => (_jsxs("tr", { className: "odd:bg-white even:bg-slate-50", children: [_jsx("th", { scope: "row", className: "sticky left-0 z-10 border-b border-gray-100 bg-inherit px-3 py-2 text-left font-normal text-gray-800", children: _jsxs("div", { className: "flex flex-col gap-0.5", children: [_jsx("span", { children: action.label }), _jsx("code", { className: "text-xs text-gray-500", children: action.key })] }) }), roles.map((role) => {
                        const granted = role.permissionKeys.includes(action.key);
                        const cellKey = permissionMatrixCellKey(role.id, action.key);
                        const pending = pendingCells?.has(cellKey) ?? false;
                        return (_jsx("td", { className: "border-b border-l border-gray-100 px-3 py-2 text-center", children: _jsx("input", { type: "checkbox", id: `permission-${role.id}-${action.key}`, name: `permission-${role.id}-${action.key}`, className: checkboxClass, checked: granted, disabled: disabled || pending, "aria-label": `${role.name}: ${action.label}`, onChange: () => onToggle(role.id, action.key, !granted) }) }, role.id));
                    })] }, action.key))), onBulkSection ? (_jsxs("tr", { children: [_jsx("td", { className: "sticky left-0 z-10 border-b border-gray-200 bg-white px-3 py-1 text-xs text-gray-500", children: "Secci\u00F3n" }), roles.map((role) => {
                        const sectionGranted = sectionKeys.every((key) => role.permissionKeys.includes(key));
                        return (_jsx("td", { className: "border-b border-l border-gray-200 px-3 py-1 text-center", children: _jsx("button", { type: "button", className: "cursor-pointer text-xs font-medium text-indigo-700 hover:text-indigo-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded disabled:cursor-not-allowed disabled:opacity-50", disabled: disabled, onClick: () => onBulkSection(role.id, group.id, sectionGranted ? "remove" : "add"), children: sectionGranted ? "Quitar sección" : "Marcar sección" }) }, role.id));
                    })] })) : null] }));
}
