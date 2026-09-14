export type ActionListItem = {
    key: string;
    label: string;
    loadingLabel?: string;
    loading?: boolean;
    badge?: string;
    badgeClassName?: string;
    disabled?: boolean;
    onClick: () => void;
};
type ActionListProps = {
    items: ActionListItem[];
    disabled?: boolean;
    className?: string;
};
export declare const ActionList: ({ items, disabled, className, }: ActionListProps) => import("react/jsx-runtime").JSX.Element;
export {};
