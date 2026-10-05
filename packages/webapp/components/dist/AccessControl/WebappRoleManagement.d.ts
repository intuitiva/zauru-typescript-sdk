import type { WebAppRowGraphQL, WebappRole } from "@zauru-sdk/types";
export type WebappRoleValues = {
    name: string;
    description: string;
};
type Props = {
    roles: WebAppRowGraphQL<WebappRole>[];
    canCreate?: boolean;
    canEdit?: boolean;
    canDelete?: boolean;
    loading?: boolean;
    createTitle?: string;
    createButtonLabel?: string;
    editTitle?: string;
    deleteTitle?: string;
    deleteDescription?: string;
    onCreate: (values: WebappRoleValues) => void;
    onUpdate: (roleId: number, values: WebappRoleValues) => void;
    onDelete: (roleId: number) => void;
};
export declare function WebappRoleManagement({ roles, canCreate, canEdit, canDelete, loading, createTitle, createButtonLabel, editTitle, deleteTitle, deleteDescription, onCreate, onUpdate, onDelete, }: Props): import("react/jsx-runtime").JSX.Element | null;
export {};
