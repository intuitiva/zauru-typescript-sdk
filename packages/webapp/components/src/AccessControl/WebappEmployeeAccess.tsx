import type {
  EmployeeGraphQL,
  SelectFieldOption,
  WebAppRowGraphQL,
  WebappEmployeeRole,
  WebappRole,
} from "@zauru-sdk/types";
import { isSuperAdminEmail } from "@zauru-sdk/utils";
import { useMemo, type ReactNode } from "react";
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

export type WebappEmployeeAssignmentChange<
  TAssignment extends WebappEmployeeRole,
> = {
  employee: EmployeeGraphQL;
  assignment?: WebAppRowGraphQL<TAssignment>;
  roleId: number | null;
};

export type WebappEmployeeAssignmentDetails<
  TAssignment extends WebappEmployeeRole,
> = {
  employee: EmployeeGraphQL;
  assignment?: WebAppRowGraphQL<TAssignment>;
  disabled: boolean;
};

type Props<TAssignment extends WebappEmployeeRole> = {
  employees: EmployeeGraphQL[];
  roles: WebAppRowGraphQL<WebappRole>[];
  assignments: WebAppRowGraphQL<TAssignment>[];
  canAssign?: boolean;
  loading?: boolean;
  description?: string;
  superAdminLabel?: string;
  addEmployeeTitle?: string;
  addEmployeeDescription?: string;
  noEmployeesToAddText?: string;
  noRolesText?: string;
  assignmentDetailsColumn?: {
    name: string;
    minWidth?: string;
    grow?: number;
  };
  renderAssignmentDetails?: (
    details: WebappEmployeeAssignmentDetails<TAssignment>,
  ) => ReactNode;
  superAdminEmailSuffixes?: readonly string[];
  onAssignRole: (
    change: WebappEmployeeAssignmentChange<TAssignment>,
  ) => void;
  onAddEmployee: (employeeId: number, roleId: number) => void;
};

export function WebappEmployeeAccess<
  TAssignment extends WebappEmployeeRole = WebappEmployeeRole,
>({
  employees,
  roles,
  assignments,
  canAssign = false,
  loading = false,
  description =
    "Solo aparecen quienes ya tienen acceso: rol asignado o super admin. Quitar el rol los saca de la lista.",
  superAdminLabel = "Super admin (todos los permisos)",
  addEmployeeTitle = "Agregar empleado",
  addEmployeeDescription =
    "Busca entre quienes aún no están en la lista y asígnales un rol.",
  noEmployeesToAddText = "No quedan empleados activos por agregar.",
  noRolesText = "Crea al menos un rol antes de agregar empleados.",
  assignmentDetailsColumn,
  renderAssignmentDetails,
  superAdminEmailSuffixes,
  onAssignRole,
  onAddEmployee,
}: Props<TAssignment>) {
  const roleOptions: SelectFieldOption[] = useMemo(
    () => [
      { value: "", label: "Sin rol" },
      ...roles.map((role) => ({
        value: String(role.id),
        label: role.data.name,
      })),
    ],
    [roles],
  );

  const addRoleOptions: SelectFieldOption[] = useMemo(
    () =>
      roles.map((role) => ({
        value: String(role.id),
        label: role.data.name,
      })),
    [roles],
  );

  const assignmentByEmployee = useMemo(() => {
    const map = new Map<number, WebAppRowGraphQL<TAssignment>>();
    for (const row of assignments) {
      map.set(Number(row.data.employee_id), row);
    }
    return map;
  }, [assignments]);

  const listedEmployees = useMemo(
    () =>
      employees
        .filter(
          (employee) =>
            isSuperAdminEmail(employee.email, superAdminEmailSuffixes) ||
            assignmentByEmployee.has(employee.id),
        )
        .sort((a, b) => a.name.localeCompare(b.name)),
    [assignmentByEmployee, employees, superAdminEmailSuffixes],
  );

  const addEmployeeOptions: SelectFieldOption[] = useMemo(() => {
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
      selector: (employee: EmployeeGraphQL) => employee.name,
    },
    {
      name: "Email",
      sortable: true,
      grow: 1,
      minWidth: "14rem",
      selector: (employee: EmployeeGraphQL) => employee.email || "—",
    },
    {
      name: "Rol",
      minWidth: "14rem",
      cell: (employee: EmployeeGraphQL) => {
        const assignment = assignmentByEmployee.get(employee.id);
        const superAdmin = isSuperAdminEmail(
          employee.email,
          superAdminEmailSuffixes,
        );
        const currentRole = assignment
          ? String(assignment.data.role_id)
          : "";

        return (
          <div className="w-56 py-2">
            {superAdmin ? (
              <p className="text-sm text-gray-600">{superAdminLabel}</p>
            ) : (
              <SelectField
                name={`role_${employee.id}`}
                options={roleOptions}
                defaultValue={
                  roleOptions.find(
                    (option) => option.value === currentRole,
                  ) ?? roleOptions[0]
                }
                disabled={!canAssign || loading}
                onChange={(option) => {
                  const value = option?.value?.toString() ?? "";
                  onAssignRole({
                    employee,
                    assignment,
                    roleId: value ? Number(value) : null,
                  });
                }}
              />
            )}
          </div>
        );
      },
    },
    ...(assignmentDetailsColumn && renderAssignmentDetails
      ? [
          {
            name: assignmentDetailsColumn.name,
            minWidth: assignmentDetailsColumn.minWidth ?? "16rem",
            grow: assignmentDetailsColumn.grow ?? 1,
            cell: (employee: EmployeeGraphQL) => {
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

  return (
    <div className="mt-4 space-y-6">
      <p className="text-sm text-gray-600">{description}</p>
      <ZauruTable
        columns={columns}
        data={listedEmployees}
        loading={loading}
        offlineSearch={["name", "email"]}
      />
      {canAssign ? (
        roles.length === 0 ? (
          <p className="text-sm text-gray-600" role="status">
            {noRolesText}
          </p>
        ) : addEmployeeOptions.length > 0 ? (
          <div className="rounded-md border border-gray-200 bg-white p-4">
            <ReactZodForm
              schema={addEmployeeSchema}
              onSubmit={(values) =>
                onAddEmployee(
                  Number(values.employee_id),
                  Number(values.role_id),
                )
              }
            >
              <h2 className="text-base font-semibold text-gray-900">
                {addEmployeeTitle}
              </h2>
              <p className="mb-4 mt-1 text-sm text-gray-600">
                {addEmployeeDescription}
              </p>
              <DoubleFieldContainer alignCenter={false}>
                <SelectField
                  name="employee_id"
                  title="Empleado"
                  hint="Escribe para filtrar por nombre o correo"
                  options={addEmployeeOptions}
                  required
                />
                <SelectField
                  name="role_id"
                  title="Rol"
                  options={addRoleOptions}
                  required
                />
              </DoubleFieldContainer>
              <ButtonSectionContainer>
                <Button loading={loading} title="Agregar" />
              </ButtonSectionContainer>
            </ReactZodForm>
          </div>
        ) : (
          <p className="text-sm text-gray-600" role="status">
            {noEmployeesToAddText}
          </p>
        )
      ) : null}
    </div>
  );
}
