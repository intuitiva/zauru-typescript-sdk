import { ReactNode } from "react";
export type CheckMatrixColumn = {
    key: string;
    label: ReactNode;
};
export type CheckMatrixRow = {
    key: string;
    label: ReactNode;
    description?: ReactNode;
};
export interface CheckMatrixCardsProps {
    rows: CheckMatrixRow[];
    columns: CheckMatrixColumn[];
    isChecked: (rowKey: string, columnKey: string) => boolean;
    isPending?: (rowKey: string, columnKey: string) => boolean;
    onToggle: (rowKey: string, columnKey: string, checked: boolean) => void;
    disabled?: boolean;
    renderRowAction?: (row: CheckMatrixRow) => ReactNode;
    checkedLabel?: string;
    uncheckedLabel?: string;
    pendingLabel?: string;
    emptyText?: string;
    pageSize?: number;
    showMoreLabel?: string;
    className?: string;
}
export declare const CheckMatrixCards: ({ rows, columns, isChecked, isPending, onToggle, disabled, renderRowAction, checkedLabel, uncheckedLabel, pendingLabel, emptyText, pageSize, showMoreLabel, className, }: CheckMatrixCardsProps) => import("react/jsx-runtime").JSX.Element;
