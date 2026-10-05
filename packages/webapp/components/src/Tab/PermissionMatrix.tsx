import type { PermissionGroup } from "@zauru-sdk/types";

export type PermissionMatrixRole = {
  id: number;
  name: string;
  permissionKeys: string[];
};

type Props = {
  groups: PermissionGroup[];
  roles: PermissionMatrixRole[];
  disabled?: boolean;
  pendingCells?: ReadonlySet<string>;
  onToggle: (roleId: number, key: string, granted: boolean) => void;
  onBulkRole?: (roleId: number, mode: "all" | "none") => void;
  onBulkSection?: (
    roleId: number,
    groupId: string,
    mode: "add" | "remove",
  ) => void;
  emptyText?: string;
  markAllLabel?: string;
  unmarkAllLabel?: string;
};

export function permissionMatrixCellKey(roleId: number, key: string): string {
  return `${roleId}:${key}`;
}

const checkboxClass =
  "form-checkbox h-4 w-4 cursor-pointer rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 disabled:cursor-not-allowed disabled:opacity-50";

export const PermissionMatrix = ({
  groups,
  roles,
  disabled = false,
  pendingCells,
  onToggle,
  onBulkRole,
  onBulkSection,
  emptyText = "Crea un rol para editar la matriz de permisos.",
  markAllLabel = "Marcar todo",
  unmarkAllLabel = "Desmarcar todo",
}: Props) => {
  const allKeys = groups.flatMap((group) =>
    group.actions.map((action) => action.key),
  );

  if (roles.length === 0) {
    return (
      <p className="text-sm text-gray-600" role="status">
        {emptyText}
      </p>
    );
  }

  const roleHasKeys = (role: PermissionMatrixRole, keys: string[]) =>
    keys.length > 0 && keys.every((key) => role.permissionKeys.includes(key));

  return (
    <div className="overflow-x-auto rounded-md border border-gray-200">
      <table className="min-w-full border-collapse text-sm">
        <caption className="sr-only">
          Matriz de permisos por rol. Filas son acciones, columnas son roles.
        </caption>
        <thead>
          <tr className="bg-gray-50">
            <th
              scope="col"
              className="sticky left-0 z-10 min-w-[16rem] border-b border-gray-200 bg-gray-50 px-3 py-2 text-left font-semibold text-gray-800"
            >
              Permiso
            </th>
            {roles.map((role) => {
              const allGranted = roleHasKeys(role, allKeys);
              return (
                <th
                  key={role.id}
                  scope="col"
                  className="min-w-[9rem] border-b border-l border-gray-200 px-3 py-2 text-center font-semibold text-gray-800"
                >
                  <div className="flex flex-col items-center gap-1">
                    <span className="break-words">{role.name}</span>
                    {onBulkRole ? (
                      <button
                        type="button"
                        className="cursor-pointer text-xs font-medium text-indigo-700 hover:text-indigo-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded"
                        disabled={disabled}
                        onClick={() =>
                          onBulkRole(role.id, allGranted ? "none" : "all")
                        }
                      >
                        {allGranted ? unmarkAllLabel : markAllLabel}
                      </button>
                    ) : null}
                  </div>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {groups.map((group) => {
            const sectionKeys = group.actions.map((action) => action.key);
            return (
              <GroupRows
                key={group.id}
                group={group}
                roles={roles}
                sectionKeys={sectionKeys}
                disabled={disabled}
                pendingCells={pendingCells}
                onToggle={onToggle}
                onBulkSection={onBulkSection}
                checkboxClass={checkboxClass}
              />
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

function GroupRows({
  group,
  roles,
  sectionKeys,
  disabled,
  pendingCells,
  onToggle,
  onBulkSection,
  checkboxClass,
}: {
  group: PermissionGroup;
  roles: PermissionMatrixRole[];
  sectionKeys: string[];
  disabled: boolean;
  pendingCells?: ReadonlySet<string>;
  onToggle: Props["onToggle"];
  onBulkSection: Props["onBulkSection"];
  checkboxClass: string;
}) {
  return (
    <>
      <tr className="bg-slate-100">
        <th
          scope="colgroup"
          colSpan={roles.length + 1}
          className="sticky left-0 border-b border-gray-200 px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-700"
        >
          {group.label}
        </th>
      </tr>
      {group.actions.map((action) => (
        <tr key={action.key} className="odd:bg-white even:bg-slate-50">
          <th
            scope="row"
            className="sticky left-0 z-10 border-b border-gray-100 bg-inherit px-3 py-2 text-left font-normal text-gray-800"
          >
            <div className="flex flex-col gap-0.5">
              <span>{action.label}</span>
              <code className="text-xs text-gray-500">{action.key}</code>
            </div>
          </th>
          {roles.map((role) => {
            const granted = role.permissionKeys.includes(action.key);
            const cellKey = permissionMatrixCellKey(role.id, action.key);
            const pending = pendingCells?.has(cellKey) ?? false;
            return (
              <td
                key={role.id}
                className="border-b border-l border-gray-100 px-3 py-2 text-center"
              >
                <input
                  type="checkbox"
                  className={checkboxClass}
                  checked={granted}
                  disabled={disabled || pending}
                  aria-label={`${role.name}: ${action.label}`}
                  onChange={() => onToggle(role.id, action.key, !granted)}
                />
              </td>
            );
          })}
        </tr>
      ))}
      {onBulkSection ? (
        <tr>
          <td className="sticky left-0 z-10 border-b border-gray-200 bg-white px-3 py-1 text-xs text-gray-500">
            Sección
          </td>
          {roles.map((role) => {
            const sectionGranted = sectionKeys.every((key) =>
              role.permissionKeys.includes(key),
            );
            return (
              <td
                key={role.id}
                className="border-b border-l border-gray-200 px-3 py-1 text-center"
              >
                <button
                  type="button"
                  className="cursor-pointer text-xs font-medium text-indigo-700 hover:text-indigo-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={disabled}
                  onClick={() =>
                    onBulkSection(
                      role.id,
                      group.id,
                      sectionGranted ? "remove" : "add",
                    )
                  }
                >
                  {sectionGranted ? "Quitar sección" : "Marcar sección"}
                </button>
              </td>
            );
          })}
        </tr>
      ) : null}
    </>
  );
}
