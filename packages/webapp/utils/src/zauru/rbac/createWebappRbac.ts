import { redirect, type Session } from "@remix-run/node";
import { handlePossibleAxiosErrors } from "@zauru-sdk/common";
import {
  createWebAppTableRegister,
  getHeaders,
  getVariablesByName,
  getWebAppRow,
  getWebAppTableRegisters,
  updateWebAppTableRegister,
} from "@zauru-sdk/services";
import type {
  AxiosUtilsResponse,
  WebappAccessContext,
  WebappEmployeeRole,
  WebappRbacConfig,
  WebappRole,
  WebAppRowGraphQL,
  WebAppTableUpdateResponse,
} from "@zauru-sdk/types";
import {
  hasPermission as hasPermissionInContext,
  isActiveWebappRow,
  isSuperAdminEmail,
} from "./access.js";
import {
  DEFAULT_SUPER_ADMIN_EMAIL_SUFFIXES,
  isValidPermissionKey,
  normalizePermissionKeys,
} from "./catalog.js";

const deletedAt = () => new Date().toISOString();

const toNumber = (value: unknown): number => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

type TableIds = {
  rolesTableId: string;
  employeeRolesTableId: string;
};

export type CreateRoleInput = {
  name: string;
  description?: string;
  permission_keys?: string[];
};

export type UpdateRoleInput = Partial<
  Pick<WebappRole, "name" | "description" | "permission_keys">
>;

export type AssignEmployeeRoleInput = {
  employee_id: number;
  role_id: number | null;
  extra?: Record<string, unknown>;
};

export function createWebappRbac(config: WebappRbacConfig) {
  const suffixes =
    config.superAdminEmailSuffixes ?? DEFAULT_SUPER_ADMIN_EMAIL_SUFFIXES;
  const validKeys = new Set(config.allPermissionKeys);

  const resolveHeaders = async (headers: any, session: Session) => {
    if (headers?.["X-User-Token"] || headers?.["x-user-token"]) {
      return headers;
    }
    return getHeaders(null, session);
  };

  const getTableIds = async (
    headers: any,
    session: Session,
  ): Promise<TableIds> => {
    const vars = await getVariablesByName(
      await resolveHeaders(headers, session),
      session,
      [config.rolesTableVar, config.employeeRolesTableVar],
    );
    return {
      rolesTableId: vars[config.rolesTableVar],
      employeeRolesTableId: vars[config.employeeRolesTableVar],
    };
  };

  const sanitizeKeys = (keys: unknown): string[] =>
    normalizePermissionKeys(keys).filter((key) =>
      isValidPermissionKey(key, validKeys),
    );

  const listRoles = (
    headers: any,
    session: Session,
  ): Promise<AxiosUtilsResponse<WebAppRowGraphQL<WebappRole>[]>> =>
    handlePossibleAxiosErrors(async () => {
      const { rolesTableId } = await getTableIds(headers, session);
      const response = await getWebAppTableRegisters<WebappRole>(
        session,
        rolesTableId,
      );
      if (response.error) {
        throw new Error(
          `Ocurrió un error al consultar los roles: ${response.userMsg}`,
        );
      }
      return (response.data ?? [])
        .filter(isActiveWebappRow)
        .map((row) => ({
          ...row,
          data: {
            ...row.data,
            permission_keys: sanitizeKeys(row.data.permission_keys),
          },
        }));
    });

  const getRoleById = (
    session: Session,
    roleId: number,
  ): Promise<AxiosUtilsResponse<WebappRole | null>> =>
    handlePossibleAxiosErrors(async () => {
      const response = await getWebAppRow<WebappRole>(session, roleId);
      if (response.error) {
        throw new Error(
          `Ocurrió un error al consultar el rol: ${response.userMsg}`,
        );
      }
      if (!response.data || response.data.fechaEliminacion) {
        return null;
      }
      return {
        ...response.data,
        permission_keys: sanitizeKeys(response.data.permission_keys),
      };
    });

  const listEmployeeRoles = (
    headers: any,
    session: Session,
    employeeId?: number,
  ): Promise<AxiosUtilsResponse<WebAppRowGraphQL<WebappEmployeeRole>[]>> =>
    handlePossibleAxiosErrors(async () => {
      const { employeeRolesTableId } = await getTableIds(headers, session);
      const response = await getWebAppTableRegisters<WebappEmployeeRole>(
        session,
        employeeRolesTableId,
        employeeId
          ? { data: { employee_id: employeeId } }
          : undefined,
      );
      if (response.error) {
        throw new Error(
          `Ocurrió un error al consultar las asignaciones de rol: ${response.userMsg}`,
        );
      }
      const rows = (response.data ?? []).filter(isActiveWebappRow);
      if (employeeId == null) {
        return rows;
      }
      return rows.filter(
        (row) => Number(row.data.employee_id) === Number(employeeId),
      );
    });

  const createRole = (
    headers: any,
    session: Session,
    body: CreateRoleInput,
  ): Promise<AxiosUtilsResponse<WebAppTableUpdateResponse>> =>
    handlePossibleAxiosErrors(async () => {
      const name = body.name.trim();
      if (!name) {
        throw new Error("El nombre del rol es requerido.");
      }
      const { rolesTableId } = await getTableIds(headers, session);
      return createWebAppTableRegister<WebappRole>(headers, rolesTableId, {
        name,
        description: body.description?.trim() ?? "",
        permission_keys: sanitizeKeys(body.permission_keys),
        fechaEliminacion: "",
      });
    });

  const updateRole = (
    headers: any,
    session: Session,
    roleId: number,
    body: UpdateRoleInput,
  ): Promise<AxiosUtilsResponse<WebAppTableUpdateResponse>> =>
    handlePossibleAxiosErrors(async () => {
      const { rolesTableId } = await getTableIds(headers, session);
      const current = await getWebAppRow<WebappRole>(session, roleId);
      if (current.error || !current.data || current.data.fechaEliminacion) {
        throw new Error("El rol no existe o fue eliminado.");
      }
      const next: WebappRole = {
        name: body.name?.trim() || current.data.name,
        description:
          body.description !== undefined
            ? body.description.trim()
            : (current.data.description ?? ""),
        permission_keys:
          body.permission_keys !== undefined
            ? sanitizeKeys(body.permission_keys)
            : sanitizeKeys(current.data.permission_keys),
        fechaEliminacion: current.data.fechaEliminacion ?? "",
      };
      return updateWebAppTableRegister<WebappRole>(
        headers,
        rolesTableId,
        roleId,
        next,
      );
    });

  const deleteRole = (
    headers: any,
    session: Session,
    roleId: number,
  ): Promise<AxiosUtilsResponse<WebAppTableUpdateResponse>> =>
    handlePossibleAxiosErrors(async () => {
      const assignments = await listEmployeeRoles(headers, session);
      if (assignments.error) {
        throw new Error(
          assignments.userMsg ?? "No se pudieron consultar las asignaciones.",
        );
      }
      const inUse = (assignments.data ?? []).some(
        (row) => Number(row.data.role_id) === Number(roleId),
      );
      if (inUse) {
        throw new Error(
          "No se puede eliminar el rol: hay empleados asignados. Reasígnalos primero.",
        );
      }
      const { rolesTableId } = await getTableIds(headers, session);
      const current = await getWebAppRow<WebappRole>(session, roleId);
      if (current.error || !current.data) {
        throw new Error("El rol no existe.");
      }
      return updateWebAppTableRegister<WebappRole>(
        headers,
        rolesTableId,
        roleId,
        {
          ...current.data,
          permission_keys: sanitizeKeys(current.data.permission_keys),
          fechaEliminacion: deletedAt(),
        },
      );
    });

  const syncRolePermissionKeys = (
    headers: any,
    session: Session,
    roleId: number,
    keys: string[],
  ): Promise<AxiosUtilsResponse<WebAppTableUpdateResponse>> =>
    updateRole(headers, session, roleId, { permission_keys: keys });

  const assignEmployeeRole = (
    headers: any,
    session: Session,
    body: AssignEmployeeRoleInput,
  ): Promise<AxiosUtilsResponse<WebAppTableUpdateResponse>> =>
    handlePossibleAxiosErrors(async () => {
      const employeeId = toNumber(body.employee_id);
      if (!employeeId) {
        throw new Error("El empleado es requerido.");
      }
      const existing = await listEmployeeRoles(headers, session, employeeId);
      if (existing.error) {
        throw new Error(
          existing.userMsg ?? "No se pudieron consultar las asignaciones.",
        );
      }
      const current = existing.data?.[0];
      const { employeeRolesTableId } = await getTableIds(headers, session);

      if (body.role_id == null) {
        if (!current) {
          return {
            id: 0,
            webapp_table_id: Number(employeeRolesTableId),
            data: { Nombre: "" },
            creator_id: 0,
            updater_id: null,
            created_at: "",
            updated_at: "",
          };
        }
        return updateWebAppTableRegister<WebappEmployeeRole>(
          headers,
          employeeRolesTableId,
          current.id,
          {
            ...current.data,
            fechaEliminacion: deletedAt(),
          },
        );
      }

      const payload = {
        ...current?.data,
        ...(body.extra ?? {}),
        employee_id: employeeId,
        role_id: toNumber(body.role_id),
        fechaEliminacion: "",
      };

      if (current) {
        return updateWebAppTableRegister<WebappEmployeeRole>(
          headers,
          employeeRolesTableId,
          current.id,
          payload,
        );
      }

      return createWebAppTableRegister<WebappEmployeeRole>(
        headers,
        employeeRolesTableId,
        payload,
      );
    });

  const resolveAccess = async (
    headers: any,
    session: Session,
  ): Promise<WebappAccessContext | null> => {
    const email = String(session.get("email") ?? "");
    const employeeId = toNumber(session.get("employee_id"));
    const superAdmin = isSuperAdminEmail(email, suffixes);

    if (superAdmin) {
      return {
        employeeId,
        email,
        superAdmin: true,
        roleId: null,
        roleName: null,
        assignmentId: null,
        assignment: null,
        permissionKeys: [...config.allPermissionKeys],
      };
    }

    if (!employeeId) {
      return null;
    }

    const assignments = await listEmployeeRoles(headers, session, employeeId);
    if (assignments.error) {
      throw new Error(
        assignments.userMsg ?? "No se pudieron consultar las asignaciones.",
      );
    }
    const assignment = assignments.data?.[0];
    if (!assignment) {
      return null;
    }

    const roleId = Number(assignment.data.role_id);
    const role = await getRoleById(session, roleId);
    if (role.error) {
      throw new Error(role.userMsg ?? "No se pudo consultar el rol.");
    }
    if (!role.data) {
      return null;
    }

    return {
      employeeId,
      email,
      superAdmin: false,
      roleId,
      roleName: role.data.name,
      assignmentId: assignment.id,
      assignment: assignment.data,
      permissionKeys: sanitizeKeys(role.data.permission_keys),
    };
  };

  const hasAppAccess = async (
    headers: any,
    session: Session,
  ): Promise<boolean> => {
    if (isSuperAdminEmail(session.get("email"), suffixes)) {
      return true;
    }
    const context = await resolveAccess(headers, session);
    return context != null;
  };

  const hasAppAccessFromSession = (session: Session): Promise<boolean> =>
    hasAppAccess(undefined, session);

  const requireAppAccess = async (
    headers: any,
    session: Session,
  ): Promise<WebappAccessContext> => {
    if (!session.has("username")) {
      throw redirect("/");
    }
    const context = await resolveAccess(headers, session);
    if (!context) {
      throw redirect("/");
    }
    return context;
  };

  const requireAppAccessFromSession = (
    session: Session,
  ): Promise<WebappAccessContext> => requireAppAccess(undefined, session);

  const requirePermission = async (
    headers: any,
    session: Session,
    key: string,
  ): Promise<WebappAccessContext> => {
    const context = await requireAppAccess(headers, session);
    if (!hasPermissionInContext(context, key)) {
      throw redirect("/");
    }
    return context;
  };

  return {
    config,
    getTableIds,
    listRoles,
    getRoleById,
    createRole,
    updateRole,
    deleteRole,
    syncRolePermissionKeys,
    listEmployeeRoles,
    assignEmployeeRole,
    resolveAccess,
    hasAppAccess,
    hasAppAccessFromSession,
    requireAppAccess,
    requireAppAccessFromSession,
    requirePermission,
    hasPermission: hasPermissionInContext,
    isSuperAdminEmail: (email: string | null | undefined) =>
      isSuperAdminEmail(email, suffixes),
  };
}

export type WebappRbac = ReturnType<typeof createWebappRbac>;
