import { redirect } from "@remix-run/node";
import { handlePossibleAxiosErrors } from "@zauru-sdk/common";
import { createWebAppTableRegister, getVariablesByName, getWebAppRow, getWebAppTableRegisters, updateWebAppTableRegister, } from "@zauru-sdk/services";
import { hasPermission as hasPermissionInContext, isActiveWebappRow, isSuperAdminEmail, } from "./access.js";
import { DEFAULT_SUPER_ADMIN_EMAIL_SUFFIXES, isValidPermissionKey, normalizeIdList, normalizePermissionKeys, } from "./catalog.js";
const deletedAt = () => new Date().toISOString();
const toNumber = (value) => {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
};
export function createWebappRbac(config) {
    const suffixes = config.superAdminEmailSuffixes ?? DEFAULT_SUPER_ADMIN_EMAIL_SUFFIXES;
    const validKeys = new Set(config.allPermissionKeys);
    const getTableIds = async (headers, session) => {
        const vars = await getVariablesByName(headers, session, [
            config.rolesTableVar,
            config.employeeRolesTableVar,
        ]);
        return {
            rolesTableId: vars[config.rolesTableVar],
            employeeRolesTableId: vars[config.employeeRolesTableVar],
        };
    };
    const sanitizeKeys = (keys) => normalizePermissionKeys(keys).filter((key) => isValidPermissionKey(key, validKeys));
    const listRoles = (headers, session) => handlePossibleAxiosErrors(async () => {
        const { rolesTableId } = await getTableIds(headers, session);
        const response = await getWebAppTableRegisters(session, rolesTableId);
        if (response.error) {
            throw new Error(`Ocurrió un error al consultar los roles: ${response.userMsg}`);
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
    const getRoleById = (session, roleId) => handlePossibleAxiosErrors(async () => {
        const response = await getWebAppRow(session, roleId);
        if (response.error) {
            throw new Error(`Ocurrió un error al consultar el rol: ${response.userMsg}`);
        }
        if (!response.data || response.data.fechaEliminacion) {
            return null;
        }
        return {
            ...response.data,
            permission_keys: sanitizeKeys(response.data.permission_keys),
        };
    });
    const listEmployeeRoles = (headers, session, employeeId) => handlePossibleAxiosErrors(async () => {
        const { employeeRolesTableId } = await getTableIds(headers, session);
        const response = await getWebAppTableRegisters(session, employeeRolesTableId, employeeId
            ? { data: { employee_id: employeeId } }
            : undefined);
        if (response.error) {
            throw new Error(`Ocurrió un error al consultar las asignaciones de rol: ${response.userMsg}`);
        }
        const rows = (response.data ?? []).filter(isActiveWebappRow);
        if (employeeId == null) {
            return rows;
        }
        return rows.filter((row) => Number(row.data.employee_id) === Number(employeeId));
    });
    const createRole = (headers, session, body) => handlePossibleAxiosErrors(async () => {
        const name = body.name.trim();
        if (!name) {
            throw new Error("El nombre del rol es requerido.");
        }
        const { rolesTableId } = await getTableIds(headers, session);
        return createWebAppTableRegister(headers, rolesTableId, {
            name,
            description: body.description?.trim() ?? "",
            permission_keys: sanitizeKeys(body.permission_keys),
            fechaEliminacion: "",
        });
    });
    const updateRole = (headers, session, roleId, body) => handlePossibleAxiosErrors(async () => {
        const { rolesTableId } = await getTableIds(headers, session);
        const current = await getWebAppRow(session, roleId);
        if (current.error || !current.data || current.data.fechaEliminacion) {
            throw new Error("El rol no existe o fue eliminado.");
        }
        const next = {
            name: body.name?.trim() || current.data.name,
            description: body.description !== undefined
                ? body.description.trim()
                : (current.data.description ?? ""),
            permission_keys: body.permission_keys !== undefined
                ? sanitizeKeys(body.permission_keys)
                : sanitizeKeys(current.data.permission_keys),
            fechaEliminacion: current.data.fechaEliminacion ?? "",
        };
        return updateWebAppTableRegister(headers, rolesTableId, roleId, next);
    });
    const deleteRole = (headers, session, roleId) => handlePossibleAxiosErrors(async () => {
        const assignments = await listEmployeeRoles(headers, session);
        if (assignments.error) {
            throw new Error(assignments.userMsg ?? "No se pudieron consultar las asignaciones.");
        }
        const inUse = (assignments.data ?? []).some((row) => Number(row.data.role_id) === Number(roleId));
        if (inUse) {
            throw new Error("No se puede eliminar el rol: hay empleados asignados. Reasígnalos primero.");
        }
        const { rolesTableId } = await getTableIds(headers, session);
        const current = await getWebAppRow(session, roleId);
        if (current.error || !current.data) {
            throw new Error("El rol no existe.");
        }
        return updateWebAppTableRegister(headers, rolesTableId, roleId, {
            ...current.data,
            permission_keys: sanitizeKeys(current.data.permission_keys),
            fechaEliminacion: deletedAt(),
        });
    });
    const syncRolePermissionKeys = (headers, session, roleId, keys) => updateRole(headers, session, roleId, { permission_keys: keys });
    const assignEmployeeRole = (headers, session, body) => handlePossibleAxiosErrors(async () => {
        const employeeId = toNumber(body.employee_id);
        if (!employeeId) {
            throw new Error("El empleado es requerido.");
        }
        const existing = await listEmployeeRoles(headers, session, employeeId);
        if (existing.error) {
            throw new Error(existing.userMsg ?? "No se pudieron consultar las asignaciones.");
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
            return updateWebAppTableRegister(headers, employeeRolesTableId, current.id, {
                ...current.data,
                allowed_item_ids: normalizeIdList(body.allowed_item_ids ?? current.data.allowed_item_ids),
                allowed_payee_ids: normalizeIdList(body.allowed_payee_ids ?? current.data.allowed_payee_ids),
                fechaEliminacion: deletedAt(),
            });
        }
        const payload = {
            employee_id: employeeId,
            role_id: toNumber(body.role_id),
            allowed_item_ids: normalizeIdList(body.allowed_item_ids),
            allowed_payee_ids: normalizeIdList(body.allowed_payee_ids),
            fechaEliminacion: "",
        };
        if (current) {
            return updateWebAppTableRegister(headers, employeeRolesTableId, current.id, payload);
        }
        return createWebAppTableRegister(headers, employeeRolesTableId, payload);
    });
    const resolveAccess = async (headers, session) => {
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
                permissionKeys: [...config.allPermissionKeys],
                allowedItemIds: [],
                allowedPayeeIds: [],
            };
        }
        if (!employeeId) {
            return null;
        }
        const assignments = await listEmployeeRoles(headers, session, employeeId);
        if (assignments.error) {
            throw new Error(assignments.userMsg ?? "No se pudieron consultar las asignaciones.");
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
            permissionKeys: sanitizeKeys(role.data.permission_keys),
            allowedItemIds: normalizeIdList(assignment.data.allowed_item_ids),
            allowedPayeeIds: normalizeIdList(assignment.data.allowed_payee_ids),
        };
    };
    const hasAppAccess = async (headers, session) => {
        if (isSuperAdminEmail(session.get("email"), suffixes)) {
            return true;
        }
        const context = await resolveAccess(headers, session);
        return context != null;
    };
    const requireAppAccess = async (headers, session) => {
        if (!session.has("username")) {
            throw redirect("/");
        }
        const context = await resolveAccess(headers, session);
        if (!context) {
            throw redirect("/");
        }
        return context;
    };
    const requirePermission = async (headers, session, key) => {
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
        requireAppAccess,
        requirePermission,
        hasPermission: hasPermissionInContext,
        isSuperAdminEmail: (email) => isSuperAdminEmail(email, suffixes),
    };
}
