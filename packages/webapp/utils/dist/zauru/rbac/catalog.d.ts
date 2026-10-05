import type { PermissionGroup } from "@zauru-sdk/types";
export declare const DEFAULT_SUPER_ADMIN_EMAIL_SUFFIXES: readonly ["@zauru.com", "@intuitiva.biz"];
export declare function flattenPermissionRows(groups: PermissionGroup[]): Array<{
    groupId: string;
    groupLabel: string;
    key: string;
    label: string;
}>;
export declare function allPermissionKeysFromGroups(groups: PermissionGroup[]): string[];
export declare function isValidPermissionKey(key: string, validKeys: ReadonlySet<string> | readonly string[]): boolean;
export declare function normalizePermissionKeys(value: unknown): string[];
export declare function normalizeIdList(value: unknown): number[];
export declare function togglePermissionKey(keys: readonly string[], key: string, granted: boolean): string[];
export declare function addPermissionKeys(keys: readonly string[], add: readonly string[]): string[];
export declare function removePermissionKeys(keys: readonly string[], remove: readonly string[]): string[];
