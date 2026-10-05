import type { WebappAccessContext, WebAppRowGraphQL } from "@zauru-sdk/types";
import { DEFAULT_SUPER_ADMIN_EMAIL_SUFFIXES } from "./catalog.js";

export function isSuperAdminEmail(
  email: string | null | undefined,
  suffixes: readonly string[] = DEFAULT_SUPER_ADMIN_EMAIL_SUFFIXES,
): boolean {
  if (!email) {
    return false;
  }
  const normalized = email.toLowerCase().trim();
  return suffixes.some((suffix) => normalized.endsWith(suffix.toLowerCase()));
}

export function hasPermissionKey(
  superAdmin: boolean | undefined,
  permissionKeys: readonly string[] | undefined,
  key: string,
): boolean {
  if (superAdmin) {
    return true;
  }
  return (permissionKeys ?? []).includes(key);
}

export function hasPermission(
  context: WebappAccessContext | null | undefined,
  key: string,
): boolean {
  if (!context) {
    return false;
  }
  return hasPermissionKey(context.superAdmin, context.permissionKeys, key);
}

export function isActiveWebappRow<T extends { fechaEliminacion?: string }>(
  row: WebAppRowGraphQL<T> | null | undefined,
): row is WebAppRowGraphQL<T> {
  return Boolean(row?.data) && !row?.data?.fechaEliminacion;
}

export function emptyAccessContext(
  employeeId: number,
  email: string,
): WebappAccessContext {
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
