export type RejectionPercentageHistoryItem = {
    discount: number;
    description?: string;
    agency_id?: number;
    employee_id?: number;
    employee_name?: string;
    created_at?: string;
    type?: string;
    successive?: boolean;
};
type NamedRecord = {
    id?: number;
    name?: string;
};
export type RejectionPercentageHistoryListProps = {
    items: RejectionPercentageHistoryItem[];
    employees?: NamedRecord[];
    agencies?: NamedRecord[];
    actorLabel?: string;
    emptyText?: string;
    className?: string;
};
export declare const RejectionPercentageHistoryList: ({ items, employees, agencies, actorLabel, emptyText, className, }: RejectionPercentageHistoryListProps) => import("react/jsx-runtime").JSX.Element;
export {};
