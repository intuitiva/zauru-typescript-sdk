import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { PencilSvg, TrashSvg } from "@zauru-sdk/icons";
import { useSyncExternalStore } from "react";
import { z } from "zod";
import { Button } from "../Buttons/Button.js";
import { ButtonSectionContainer } from "../Containers/ButtonSectionContainer.js";
import { ReactZodForm } from "../Form/ReactZodForm/index.js";
import { TextField } from "../Form/TextField/index.js";
import { createModal } from "../Modal/Modal.js";
import { ZauruTable } from "../Table/ZauruTable.js";
const roleSchema = z.object({
    name: z.string().min(1, "El nombre es requerido"),
    description: z.string().optional(),
});
const subscribeToBrowser = () => () => undefined;
const getBrowserSnapshot = () => true;
const getServerSnapshot = () => false;
export function WebappRoleManagement({ roles, canCreate = false, canEdit = false, canDelete = false, loading = false, createTitle = "Crear rol", createButtonLabel = "Crear rol", editTitle = "Editar rol", deleteTitle = "¿Eliminar este rol?", deleteDescription = "No se puede eliminar si hay empleados asignados.", onCreate, onUpdate, onDelete, }) {
    const isClient = useSyncExternalStore(subscribeToBrowser, getBrowserSnapshot, getServerSnapshot);
    const editRole = async (role) => {
        let name = role.data.name;
        let description = role.data.description ?? "";
        const response = await createModal({
            title: editTitle,
            okButtonText: "Guardar",
            description: (_jsxs(_Fragment, { children: [_jsx(TextField, { title: "Nombre", name: "name", defaultValue: name, onChange: (value) => {
                            name = value;
                        } }), _jsx(TextField, { className: "mt-4", title: "Descripci\u00F3n", name: "description", defaultValue: description, onChange: (value) => {
                            description = value;
                        } })] })),
        });
        if (response === "OK") {
            onUpdate(role.id, { name, description });
        }
    };
    const confirmDelete = async (roleId) => {
        const response = await createModal({
            title: deleteTitle,
            description: deleteDescription,
        });
        if (response === "OK") {
            onDelete(roleId);
        }
    };
    const columns = [
        {
            name: "Nombre",
            sortable: true,
            grow: 1,
            selector: (role) => role.data.name,
        },
        {
            name: "Descripción",
            grow: 2,
            selector: (role) => role.data.description || "—",
        },
        {
            name: "Permisos",
            width: "8%",
            selector: (role) => role.data.permission_keys?.length ?? 0,
        },
        {
            name: "",
            grow: 0,
            minWidth: "90px",
            maxWidth: "90px",
            cell: (role) => (_jsxs("div", { className: "flex gap-2", children: [canDelete ? (_jsx("button", { type: "button", title: "Eliminar", "aria-label": `Eliminar rol ${role.data.name}`, disabled: loading, className: "cursor-pointer rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50", onClick: () => void confirmDelete(role.id), children: _jsx(TrashSvg, {}) })) : null, canEdit ? (_jsx("button", { type: "button", title: "Editar", "aria-label": `Editar rol ${role.data.name}`, disabled: loading, className: "cursor-pointer rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50", onClick: () => void editRole(role), children: _jsx(PencilSvg, {}) })) : null] })),
        },
    ];
    if (!isClient) {
        return null;
    }
    return (_jsxs("div", { className: "mt-4 space-y-6", children: [_jsx(ZauruTable, { columns: columns, data: [...roles].sort((a, b) => a.data.name.localeCompare(b.data.name)), loading: loading, offlineSearch: ["data.name", "data.description"] }), canCreate ? (_jsx("div", { className: "rounded-md border border-gray-200 bg-white p-4", children: _jsxs(ReactZodForm, { schema: roleSchema, onSubmit: (values) => onCreate({
                        name: String(values.name ?? ""),
                        description: String(values.description ?? ""),
                    }), children: [_jsx("h2", { className: "mb-4 text-base font-semibold text-gray-900", children: createTitle }), _jsx(TextField, { name: "name", title: "Nombre del rol", required: true }), _jsx(TextField, { className: "mt-4", name: "description", title: "Descripci\u00F3n" }), _jsx(ButtonSectionContainer, { children: _jsx(Button, { loading: loading, title: createButtonLabel }) })] }) })) : null] }));
}
