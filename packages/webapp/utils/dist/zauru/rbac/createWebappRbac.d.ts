import { type Session } from "@remix-run/node";
import type { AxiosUtilsResponse, WebappAccessContext, WebappEmployeeRole, WebappRbacConfig, WebappRole, WebAppRowGraphQL, WebAppTableUpdateResponse } from "@zauru-sdk/types";
import { hasPermission as hasPermissionInContext } from "./access.js";
type TableIds = {
    rolesTableId: string;
    employeeRolesTableId: string;
};
export type CreateRoleInput = {
    name: string;
    description?: string;
    permission_keys?: string[];
};
export type UpdateRoleInput = Partial<Pick<WebappRole, "name" | "description" | "permission_keys">>;
export type AssignEmployeeRoleInput = {
    employee_id: number;
    role_id: number | null;
    allowed_item_ids?: number[];
    allowed_payee_ids?: number[];
};
export declare function createWebappRbac(config: WebappRbacConfig): {
    config: WebappRbacConfig;
    getTableIds: (headers: any, session: Session) => Promise<TableIds>;
    listRoles: (headers: any, session: Session) => Promise<AxiosUtilsResponse<WebAppRowGraphQL<WebappRole>[]>>;
    getRoleById: (session: Session, roleId: number) => Promise<AxiosUtilsResponse<WebappRole | null>>;
    createRole: (headers: any, session: Session, body: CreateRoleInput) => Promise<AxiosUtilsResponse<WebAppTableUpdateResponse>>;
    updateRole: (headers: any, session: Session, roleId: number, body: UpdateRoleInput) => Promise<AxiosUtilsResponse<WebAppTableUpdateResponse>>;
    deleteRole: (headers: any, session: Session, roleId: number) => Promise<AxiosUtilsResponse<WebAppTableUpdateResponse>>;
    syncRolePermissionKeys: (headers: any, session: Session, roleId: number, keys: string[]) => Promise<AxiosUtilsResponse<WebAppTableUpdateResponse>>;
    listEmployeeRoles: (headers: any, session: Session, employeeId?: number) => Promise<AxiosUtilsResponse<WebAppRowGraphQL<WebappEmployeeRole>[]>>;
    assignEmployeeRole: (headers: any, session: Session, body: AssignEmployeeRoleInput) => Promise<AxiosUtilsResponse<WebAppTableUpdateResponse>>;
    resolveAccess: (headers: any, session: Session) => Promise<WebappAccessContext | null>;
    hasAppAccess: (headers: any, session: Session) => Promise<boolean>;
    requireAppAccess: (headers: any, session: Session) => Promise<WebappAccessContext>;
    requirePermission: (headers: any, session: Session, key: string) => Promise<WebappAccessContext>;
    hasPermission: typeof hasPermissionInContext;
    isSuperAdminEmail: (email: string | null | undefined) => boolean;
};
export type WebappRbac = ReturnType<typeof createWebappRbac>;
export {};
