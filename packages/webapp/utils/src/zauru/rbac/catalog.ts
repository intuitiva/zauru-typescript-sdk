import type { PermissionGroup } from "@zauru-sdk/types";

export const DEFAULT_SUPER_ADMIN_EMAIL_SUFFIXES = [
  "@zauru.com",
  "@intuitiva.biz",
] as const;

export function flattenPermissionRows(groups: PermissionGroup[]): Array<{
  groupId: string;
  groupLabel: string;
  key: string;
  label: string;
}> {
  return groups.flatMap((group) =>
    group.actions.map((action) => ({
      groupId: group.id,
      groupLabel: group.label,
      key: action.key,
      label: action.label,
    })),
  );
}

export function allPermissionKeysFromGroups(
  groups: PermissionGroup[],
): string[] {
  return flattenPermissionRows(groups).map((row) => row.key);
}

export function isValidPermissionKey(
  key: string,
  validKeys: ReadonlySet<string> | readonly string[],
): boolean {
  if (Array.isArray(validKeys)) {
    return validKeys.includes(key);
  }
  return (validKeys as ReadonlySet<string>).has(key);
}

export function normalizePermissionKeys(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.filter((key): key is string => typeof key === "string");
  }
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) {
      return [];
    }
    try {
      const parsed = JSON.parse(trimmed);
      if (Array.isArray(parsed)) {
        return parsed.filter((key): key is string => typeof key === "string");
      }
    } catch {
      return [trimmed];
    }
  }
  return [];
}

export function normalizeIdList(value: unknown): number[] {
  if (!Array.isArray(value)) {
    return [];
  }
  return value
    .map((item) => Number(item))
    .filter((item) => Number.isFinite(item) && item > 0);
}

export function togglePermissionKey(
  keys: readonly string[],
  key: string,
  granted: boolean,
): string[] {
  const next = new Set(keys);
  if (granted) {
    next.add(key);
  } else {
    next.delete(key);
  }
  return [...next];
}

export function addPermissionKeys(
  keys: readonly string[],
  add: readonly string[],
): string[] {
  return [...new Set([...keys, ...add])];
}

export function removePermissionKeys(
  keys: readonly string[],
  remove: readonly string[],
): string[] {
  const drop = new Set(remove);
  return keys.filter((key) => !drop.has(key));
}
