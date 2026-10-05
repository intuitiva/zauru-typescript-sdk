import { PencilSvg, TrashSvg } from "@zauru-sdk/icons";
import type {
  WebAppRowGraphQL,
  WebappRole,
} from "@zauru-sdk/types";
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

export type WebappRoleValues = {
  name: string;
  description: string;
};

type Props = {
  roles: WebAppRowGraphQL<WebappRole>[];
  canCreate?: boolean;
  canEdit?: boolean;
  canDelete?: boolean;
  loading?: boolean;
  createTitle?: string;
  createButtonLabel?: string;
  editTitle?: string;
  deleteTitle?: string;
  deleteDescription?: string;
  onCreate: (values: WebappRoleValues) => void;
  onUpdate: (roleId: number, values: WebappRoleValues) => void;
  onDelete: (roleId: number) => void;
};

export function WebappRoleManagement({
  roles,
  canCreate = false,
  canEdit = false,
  canDelete = false,
  loading = false,
  createTitle = "Crear rol",
  createButtonLabel = "Crear rol",
  editTitle = "Editar rol",
  deleteTitle = "¿Eliminar este rol?",
  deleteDescription = "No se puede eliminar si hay empleados asignados.",
  onCreate,
  onUpdate,
  onDelete,
}: Props) {
  const isClient = useSyncExternalStore(
    subscribeToBrowser,
    getBrowserSnapshot,
    getServerSnapshot,
  );

  const editRole = async (role: WebAppRowGraphQL<WebappRole>) => {
    let name = role.data.name;
    let description = role.data.description ?? "";
    const response = await createModal({
      title: editTitle,
      okButtonText: "Guardar",
      description: (
        <>
          <TextField
            title="Nombre"
            name="name"
            defaultValue={name}
            onChange={(value) => {
              name = value;
            }}
          />
          <TextField
            className="mt-4"
            title="Descripción"
            name="description"
            defaultValue={description}
            onChange={(value) => {
              description = value;
            }}
          />
        </>
      ),
    });

    if (response === "OK") {
      onUpdate(role.id, { name, description });
    }
  };

  const confirmDelete = async (roleId: number) => {
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
      selector: (role: WebAppRowGraphQL<WebappRole>) => role.data.name,
    },
    {
      name: "Descripción",
      grow: 2,
      selector: (role: WebAppRowGraphQL<WebappRole>) =>
        role.data.description || "—",
    },
    {
      name: "Permisos",
      width: "8%",
      selector: (role: WebAppRowGraphQL<WebappRole>) =>
        role.data.permission_keys?.length ?? 0,
    },
    {
      name: "",
      grow: 0,
      minWidth: "90px",
      maxWidth: "90px",
      cell: (role: WebAppRowGraphQL<WebappRole>) => (
        <div className="flex gap-2">
          {canDelete ? (
            <button
              type="button"
              title="Eliminar"
              aria-label={`Eliminar rol ${role.data.name}`}
              disabled={loading}
              className="cursor-pointer rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              onClick={() => void confirmDelete(role.id)}
            >
              <TrashSvg />
            </button>
          ) : null}
          {canEdit ? (
            <button
              type="button"
              title="Editar"
              aria-label={`Editar rol ${role.data.name}`}
              disabled={loading}
              className="cursor-pointer rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              onClick={() => void editRole(role)}
            >
              <PencilSvg />
            </button>
          ) : null}
        </div>
      ),
    },
  ];

  if (!isClient) {
    return null;
  }

  return (
    <div className="mt-4 space-y-6">
      <ZauruTable
        columns={columns}
        data={[...roles].sort((a, b) =>
          a.data.name.localeCompare(b.data.name),
        )}
        loading={loading}
        offlineSearch={["data.name", "data.description"]}
      />
      {canCreate ? (
        <div className="rounded-md border border-gray-200 bg-white p-4">
          <ReactZodForm
            schema={roleSchema}
            onSubmit={(values) =>
              onCreate({
                name: String(values.name ?? ""),
                description: String(values.description ?? ""),
              })
            }
          >
            <h2 className="mb-4 text-base font-semibold text-gray-900">
              {createTitle}
            </h2>
            <TextField name="name" title="Nombre del rol" required />
            <TextField
              className="mt-4"
              name="description"
              title="Descripción"
            />
            <ButtonSectionContainer>
              <Button loading={loading} title={createButtonLabel} />
            </ButtonSectionContainer>
          </ReactZodForm>
        </div>
      ) : null}
    </div>
  );
}
