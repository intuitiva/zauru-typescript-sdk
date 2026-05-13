import React from "react";
export type ChecklistItem = {
    id: string;
    name: string;
    label: string;
    defaultValue?: boolean;
    disabled?: boolean;
};
type ChecklistProps = {
    items: ChecklistItem[];
    onChange?: (name: string, value: boolean) => void;
};
export declare const Checklist: React.FC<ChecklistProps>;
export {};
