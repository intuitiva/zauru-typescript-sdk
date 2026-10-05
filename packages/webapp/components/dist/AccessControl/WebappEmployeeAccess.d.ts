import type { EmployeeGraphQL, WebAppRowGraphQL, WebappEmployeeRole, WebappRole } from "@zauru-sdk/types";
import { type ReactNode } from "react";
export type WebappEmployeeAssignmentChange<TAssignment extends WebappEmployeeRole> = {
    employee: EmployeeGraphQL;
    assignment?: WebAppRowGraphQL<TAssignment>;
    roleId: number | null;
};
export type WebappEmployeeAssignmentDetails<TAssignment extends WebappEmployeeRole> = {
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
    renderAssignmentDetails?: (details: WebappEmployeeAssignmentDetails<TAssignment>) => ReactNode;
    superAdminEmailSuffixes?: readonly string[];
    onAssignRole: (change: WebappEmployeeAssignmentChange<TAssignment>) => void;
    onAddEmployee: (employeeId: number, roleId: number) => void;
};
export declare function WebappEmployeeAccess<TAssignment extends WebappEmployeeRole = WebappEmployeeRole>({ employees, roles, assignments, canAssign, loading, description, superAdminLabel, addEmployeeTitle, addEmployeeDescription, noEmployeesToAddText, noRolesText, assignmentDetailsColumn, renderAssignmentDetails, superAdminEmailSuffixes, onAssignRole, onAddEmployee, }: Props<TAssignment>): import("react/jsx-runtime").JSX.Element;
export {};
