import type { ReactNode } from "react";
type Props = {
    children: ReactNode;
    showEmployees?: boolean;
    showRoles?: boolean;
    showPermissions?: boolean;
    basePath?: string;
    title?: string;
    description?: string;
};
export declare const WebappSettingsChrome: ({ children, showEmployees, showRoles, showPermissions, basePath, title, description, }: Props) => import("react/jsx-runtime").JSX.Element;
export {};
