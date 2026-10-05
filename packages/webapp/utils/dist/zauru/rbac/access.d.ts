import type { WebappAccessContext, WebAppRowGraphQL } from "@zauru-sdk/types";
export declare function isSuperAdminEmail(email: string | null | undefined, suffixes?: readonly string[]): boolean;
export declare function hasPermissionKey(superAdmin: boolean | undefined, permissionKeys: readonly string[] | undefined, key: string): boolean;
export declare function hasPermission(context: WebappAccessContext | null | undefined, key: string): boolean;
export declare function isActiveWebappRow<T extends {
    fechaEliminacion?: string;
}>(row: WebAppRowGraphQL<T> | null | undefined): row is WebAppRowGraphQL<T>;
export declare function emptyAccessContext(employeeId: number, email: string): WebappAccessContext;
