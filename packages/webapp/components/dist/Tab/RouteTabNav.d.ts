export type RouteTabNavItem = {
    to: string;
    label: string;
    hide?: boolean;
    end?: boolean;
};
type Props = {
    items: RouteTabNavItem[];
    ariaLabel?: string;
    selectedColor?: "indigo" | "slate" | "blue" | "green";
};
export declare const RouteTabNav: ({ items, ariaLabel, selectedColor, }: Props) => import("react/jsx-runtime").JSX.Element | null;
export {};
