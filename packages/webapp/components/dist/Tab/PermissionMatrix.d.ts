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
    onBulkSection?: (roleId: number, groupId: string, mode: "add" | "remove") => void;
    emptyText?: string;
    markAllLabel?: string;
    unmarkAllLabel?: string;
};
export declare function permissionMatrixCellKey(roleId: number, key: string): string;
export declare const PermissionMatrix: ({ groups, roles, disabled, pendingCells, onToggle, onBulkRole, onBulkSection, emptyText, markAllLabel, unmarkAllLabel, }: Props) => import("react/jsx-runtime").JSX.Element;
export {};
