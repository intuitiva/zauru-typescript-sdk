export type SearchFilterItem = {
    key: string;
    label: string;
    value: string;
};
type Props = {
    items?: SearchFilterItem[];
    emptyText?: string;
    className?: string;
};
export declare const SearchFiltersSummary: ({ items, emptyText, className, }: Props) => import("react/jsx-runtime").JSX.Element;
export {};
