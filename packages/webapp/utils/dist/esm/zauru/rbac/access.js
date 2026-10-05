import { DEFAULT_SUPER_ADMIN_EMAIL_SUFFIXES } from "./catalog.js";
export function isSuperAdminEmail(email, suffixes = DEFAULT_SUPER_ADMIN_EMAIL_SUFFIXES) {
    if (!email) {
        return false;
    }
    const normalized = email.toLowerCase().trim();
    return suffixes.some((suffix) => normalized.endsWith(suffix.toLowerCase()));
}
export function hasPermissionKey(superAdmin, permissionKeys, key) {
    if (superAdmin) {
        return true;
    }
    return (permissionKeys ?? []).includes(key);
}
export function hasPermission(context, key) {
    if (!context) {
        return false;
    }
    return hasPermissionKey(context.superAdmin, context.permissionKeys, key);
}
export function isActiveWebappRow(row) {
    return Boolean(row?.data) && !row?.data?.fechaEliminacion;
}
export function emptyAccessContext(employeeId, email) {
    return {
        employeeId,
        email,
        superAdmin: false,
        roleId: null,
        roleName: null,
        assignmentId: null,
        assignment: null,
        permissionKeys: [],
    };
}
