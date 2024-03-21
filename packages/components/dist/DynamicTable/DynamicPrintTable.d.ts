import React, { type ReactNode } from "react";
export type TableStateItem = {
    item_id: string | undefined;
    quantity: number | undefined;
};
export type FormatedItem = {
    label: string;
    value: number;
    template: string;
};
type Props = {
    name: string;
    formName?: string;
    className?: string;
    items: FormatedItem[];
    onChange?: (tableState?: TableStateItem[]) => void;
    forwardedRef?: React.RefObject<{
        insertItems: (items: FormatedItem[]) => void;
        getTableState: (updatedData?: ReactNode[][]) => TableStateItem[] | undefined;
    }>;
};
declare const _default: React.ForwardRefExoticComponent<Props & React.RefAttributes<unknown>>;
export default _default;
