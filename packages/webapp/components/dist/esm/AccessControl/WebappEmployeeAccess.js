import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { isSuperAdminEmail } from "@zauru-sdk/utils";
import { useMemo } from "react";
import { z } from "zod";
import { Button } from "../Buttons/Button.js";
import { ButtonSectionContainer } from "../Containers/ButtonSectionContainer.js";
import { DoubleFieldContainer } from "../Form/FieldContainer/DoubleFieldContainer.js";
import { ReactZodForm } from "../Form/ReactZodForm/index.js";
import { SelectField } from "../Form/SelectField/index.js";
import { ZauruTable } from "../Table/ZauruTable.js";
const addEmployeeSchema = z.object({
    employee_id: z.coerce.number().min(1, "El empleado es requerido"),
    role_id: z.coerce.number().min(1, "El rol es requerido"),
});
export function WebappEmployeeAccess({ employees, roles, assignments, canAssign = false, loading = false, description = "Solo aparecen quienes ya tienen acceso: rol asignado o super admin. Quitar el rol los saca de la lista.", superAdminLabel = "Super admin (todos los permisos)", addEmployeeTitle = "Agregar empleado", addEmployeeDescription = "Busca entre quienes aún no están en la lista y asígnales un rol.", noEmployeesToAddText = "No quedan empleados activos por agregar.", noRolesText = "Crea al menos un rol antes de agregar empleados.", assignmentDetailsColumn, renderAssignmentDetails, superAdminEmailSuffixes, onAssignRole, onAddEmployee, }) {
    const roleOptions = useMemo(() => [
        { value: "", label: "Sin rol" },
        ...roles.map((role) => ({
            value: String(role.id),
            label: role.data.name,
        })),
    ], [roles]);
    const addRoleOptions = useMemo(() => roles.map((role) => ({
        value: String(role.id),
        label: role.data.name,
    })), [roles]);
    const assignmentByEmployee = useMemo(() => {
        const map = new Map();
        for (const row of assignments) {
            map.set(Number(row.data.employee_id), row);
        }
        return map;
    }, [assignments]);
    const listedEmployees = useMemo(() => employees
        .filter((employee) => isSuperAdminEmail(employee.email, superAdminEmailSuffixes) ||
        assignmentByEmployee.has(employee.id))
        .sort((a, b) => a.name.localeCompare(b.name)), [assignmentByEmployee, employees, superAdminEmailSuffixes]);
    const addEmployeeOptions = useMemo(() => {
        const listedIds = new Set(listedEmployees.map((employee) => employee.id));
        return employees
            .filter((employee) => !listedIds.has(employee.id))
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((employee) => ({
            value: employee.id,
            label: employee.email
                ? `${employee.name} (${employee.email})`
                : employee.name,
        }));
    }, [employees, listedEmployees]);
    const columns = [
        {
            name: "Empleado",
            sortable: true,
            grow: 1,
            minWidth: "12rem",
            selector: (employee) => employee.name,
        },
        {
            name: "Email",
            sortable: true,
            grow: 1,
            minWidth: "14rem",
            selector: (employee) => employee.email || "—",
        },
        {
            name: "Rol",
            minWidth: "14rem",
            cell: (employee) => {
                const assignment = assignmentByEmployee.get(employee.id);
                const superAdmin = isSuperAdminEmail(employee.email, superAdminEmailSuffixes);
                const currentRole = assignment
                    ? String(assignment.data.role_id)
                    : "";
                return (_jsx("div", { className: "w-56 py-2", children: superAdmin ? (_jsx("p", { className: "text-sm text-gray-600", children: superAdminLabel })) : (_jsx(SelectField, { name: `role_${employee.id}`, options: roleOptions, defaultValue: roleOptions.find((option) => option.value === currentRole) ?? roleOptions[0], disabled: !canAssign || loading, onChange: (option) => {
                            const value = option?.value?.toString() ?? "";
                            onAssignRole({
                                employee,
                                assignment,
                                roleId: value ? Number(value) : null,
                            });
                        } })) }));
            },
        },
        ...(assignmentDetailsColumn && renderAssignmentDetails
            ? [
                {
                    name: assignmentDetailsColumn.name,
                    minWidth: assignmentDetailsColumn.minWidth ?? "16rem",
                    grow: assignmentDetailsColumn.grow ?? 1,
                    cell: (employee) => {
                        const assignment = assignmentByEmployee.get(employee.id);
                        return renderAssignmentDetails({
                            employee,
                            assignment,
                            disabled: !canAssign || !assignment || loading,
                        });
                    },
                },
            ]
            : []),
    ];
    return (_jsxs("div", { className: "mt-4 space-y-6", children: [_jsx("p", { className: "text-sm text-gray-600", children: description }), _jsx(ZauruTable, { columns: columns, data: listedEmployees, loading: loading, offlineSearch: ["name", "email"] }), canAssign ? (roles.length === 0 ? (_jsx("p", { className: "text-sm text-gray-600", role: "status", children: noRolesText })) : addEmployeeOptions.length > 0 ? (_jsx("div", { className: "rounded-md border border-gray-200 bg-white p-4", children: _jsxs(ReactZodForm, { schema: addEmployeeSchema, onSubmit: (values) => onAddEmployee(Number(values.employee_id), Number(values.role_id)), children: [_jsx("h2", { className: "text-base font-semibold text-gray-900", children: addEmployeeTitle }), _jsx("p", { className: "mb-4 mt-1 text-sm text-gray-600", children: addEmployeeDescription }), _jsxs(DoubleFieldContainer, { alignCenter: false, children: [_jsx(SelectField, { name: "employee_id", title: "Empleado", hint: "Escribe para filtrar por nombre o correo", options: addEmployeeOptions, required: true }), _jsx(SelectField, { name: "role_id", title: "Rol", options: addRoleOptions, required: true })] }), _jsx(ButtonSectionContainer, { children: _jsx(Button, { loading: loading, title: "Agregar" }) })] }) })) : (_jsx("p", { className: "text-sm text-gray-600", role: "status", children: noEmployeesToAddText }))) : null] }));
}
